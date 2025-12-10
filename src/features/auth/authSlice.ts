import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseError } from 'firebase/app';
import type { User } from 'firebase/auth';
import { getFirebaseAuth, firebaseAuthApi, createUserProfileDocument } from '../../services/firebase';
import { fetchUserProfile } from '../../services/firestore';
import { AuthState, Credentials, ForgotPasswordPayload, RegistrationPayload, UserProfile } from '../../types/auth';

const mapFirebaseUserToProfile = (user: { uid: string; displayName: string | null; email: string | null }): UserProfile => {
  return {
    id: user.uid,
    displayName: user.displayName ?? 'Leader',
    email: user.email ?? '',
    role: 'leader',
    createdAt: Date.now(),
  };
};

const initialState: AuthState = {
  user: null,
  status: 'idle',
};

const formatFirebaseError = (error: unknown): string => {
  if (error instanceof FirebaseError && error.code) {
    return error.code;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'unknown_error';
};

export const loginWithEmail = createAsyncThunk<UserProfile, Credentials, { rejectValue: string }>(
  'auth/loginWithEmail',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await firebaseAuthApi.signIn(email, password);
      const profile = await fetchUserProfile(user.uid);
      if (profile) {
        return profile;
      }
      return mapFirebaseUserToProfile(user);
    } catch (error) {
      return rejectWithValue(formatFirebaseError(error));
    }
  },
);

export const registerWithEmail = createAsyncThunk<UserProfile, RegistrationPayload, { rejectValue: string }>(
  'auth/registerWithEmail',
  async ({ displayName, email, password }, { rejectWithValue }) => {
    try {
      const user = await firebaseAuthApi.signUp(displayName, email, password);
      const profile: UserProfile = {
        id: user.uid,
        displayName: displayName.trim(),
        email,
        role: 'leader',
        createdAt: Date.now(),
      };
      await createUserProfileDocument(user.uid, profile);
      return profile;
    } catch (error) {
      return rejectWithValue(formatFirebaseError(error));
    }
  },
);

export const sendPasswordReset = createAsyncThunk<void, ForgotPasswordPayload, { rejectValue: string }>(
  'auth/sendPasswordReset',
  async ({ email }, { rejectWithValue }) => {
    try {
      await firebaseAuthApi.sendPasswordReset(email);
      return;
    } catch (error) {
      return rejectWithValue(formatFirebaseError(error));
    }
  },
);

export const signOutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/signOutUser',
  async (_, { rejectWithValue }) => {
    try {
      await firebaseAuthApi.signOut();
      return;
    } catch (error) {
      return rejectWithValue(formatFirebaseError(error));
    }
  },
);

export const listenToAuthChanges = createAsyncThunk<UserProfile | null, void, { rejectValue: string }>(
  'auth/listenToAuthChanges',
  async (_, { rejectWithValue }) => {
    try {
      const auth = getFirebaseAuth();
      return await new Promise<UserProfile | null>((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
          unsubscribe();
          if (!user) {
            resolve(null);
            return;
          }
          const profile = await fetchUserProfile(user.uid);
          resolve(profile ?? mapFirebaseUserToProfile(user));
        });
      });
    } catch (error) {
      return rejectWithValue(formatFirebaseError(error));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile | null>) {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = undefined;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload;
      })
      .addCase(registerWithEmail.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = undefined;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload;
      })
      .addCase(sendPasswordReset.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.errorMessage = action.payload;
      })
      .addCase(listenToAuthChanges.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = undefined;
      })
      .addCase(listenToAuthChanges.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = action.payload ? 'authenticated' : 'idle';
      })
      .addCase(listenToAuthChanges.rejected, (state, action) => {
        state.errorMessage = typeof action.payload === 'string' ? action.payload : 'auth_listen_failed';
        state.status = 'error';
      });
  },
});

export const { setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
