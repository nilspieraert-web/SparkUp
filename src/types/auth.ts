export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  role: 'leader';
  avatarUrl?: string;
  createdAt: number;
}

export interface AuthState {
  user: UserProfile | null;
  status: AuthStatus;
  errorMessage?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegistrationPayload extends Credentials {
  displayName: string;
  confirmPassword: string;
  acceptPolicy: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}
