import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  QueryConstraint,
  FirestoreDataConverter,
  WithFieldValue,
} from "firebase/firestore";
import { Game } from "../types/game";
import { SessionLog } from "../types/session";
import { UserProfile } from "../types/auth";
import { getFirebaseAuth, getFirestoreDb } from "./firebase";

export type CreateGameInput = Omit<Game, "id" | "createdAt" | "updatedAt" | "createdByUid">;

export interface UpdateGameInput extends Partial<CreateGameInput> {
  id: string;
}

export type CreateSessionInput = Omit<SessionLog, "id" | "createdAt" | "loggedByUid">;

const getDb = () => getFirestoreDb();

const requireAuthUid = () => {
  const auth = getFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("User must be signed in to perform this action.");
  }
  return uid;
};

type FirestoreTimestampLike = { toMillis?: () => number };

const normalizeTimestamp = (value: unknown): number => {
  if (typeof value === "number") {
    return value;
  }
  if (value && typeof (value as FirestoreTimestampLike).toMillis === "function") {
    return (value as FirestoreTimestampLike).toMillis!();
  }
  return Date.now();
};

const gameConverter: FirestoreDataConverter<Game> = {
  toFirestore(game: WithFieldValue<Omit<Game, "id">>) {
    return game;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options) as Record<string, unknown>;
    return {
      id: snapshot.id,
      title: data.title as string,
      theme: data.theme as string,
      ageRange: data.ageRange as Game["ageRange"],
      durationMins: data.durationMins as number,
      indoorAllowed: Boolean(data.indoorAllowed),
      outdoorAllowed: Boolean(data.outdoorAllowed),
      description: (data.description as string) ?? "",
      coverPhotoUrl: data.coverPhotoUrl as string | null | undefined,
      createdByUid: (data.createdByUid as string) ?? (data.createdBy as string) ?? "",
      createdAt: normalizeTimestamp((data as { createdAt?: unknown }).createdAt),
      updatedAt: normalizeTimestamp((data as { updatedAt?: unknown }).updatedAt),
    } satisfies Game;
  },
};

const sessionConverter: FirestoreDataConverter<SessionLog> = {
  toFirestore(session: WithFieldValue<Omit<SessionLog, "id">>) {
    return session;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options) as Record<string, unknown>;
    return {
      id: snapshot.id,
      gameId: data.gameId as string,
      playedAt: normalizeTimestamp((data as { playedAt?: unknown }).playedAt),
      context: data.context as SessionLog["context"],
      funRating: (data.funRating as SessionLog["funRating"]) ?? 3,
      engagementRating: (data.engagementRating as SessionLog["engagementRating"]) ?? 3,
      kidsAllJoined: Boolean(data.kidsAllJoined),
      notes: (data.notes as string) ?? "",
      loggedByUid: (data.loggedByUid as string) ?? (data.createdBy as string) ?? "",
      createdAt: normalizeTimestamp((data as { createdAt?: unknown }).createdAt),
    } satisfies SessionLog;
  },
};

const profileConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore(profile: WithFieldValue<Omit<UserProfile, "id">>) {
    return profile;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options) as Record<string, unknown>;
    return {
      id: snapshot.id,
      displayName: data.displayName as string,
      email: data.email as string,
      role: data.role as UserProfile["role"],
      avatarUrl: data.avatarUrl as string | undefined,
      createdAt: normalizeTimestamp((data as { createdAt?: unknown }).createdAt),
    } satisfies UserProfile;
  },
};

export const firestoreRefs = {
  games: () => collection(getDb(), "games").withConverter(gameConverter),
  logsForGame: (gameId: string) =>
    collection(getDb(), "games", gameId, "logs").withConverter(sessionConverter),
  logsCollectionGroup: () => collectionGroup(getDb(), "logs").withConverter(sessionConverter),
  users: () => collection(getDb(), "users").withConverter(profileConverter),
  favorites: (uid: string) => collection(getDb(), "users", uid, "favorites"),
};

export const subscribeToGames = (
  constraints: QueryConstraint[],
  callback: (games: Game[]) => void,
) => {
  const q = query(firestoreRefs.games(), ...constraints);
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docSnapshot) => docSnapshot.data()));
  });
};

export const fetchGames = async (constraints: QueryConstraint[] = []): Promise<Game[]> => {
  const q = query(firestoreRefs.games(), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnapshot) => docSnapshot.data());
};

export const fetchGameById = async (gameId: string): Promise<Game | null> => {
  const ref = doc(getDb(), "games", gameId).withConverter(gameConverter);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data();
};

export const fetchSessionById = async (gameId: string, sessionId: string): Promise<SessionLog | null> => {
  requireAuthUid();
  const ref = doc(getDb(), "games", gameId, "logs", sessionId).withConverter(sessionConverter);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data();
};

export const createGame = async (input: CreateGameInput): Promise<string> => {
  const uid = requireAuthUid();
  const ref = await addDoc(collection(getDb(), "games"), {
    ...input,
    createdByUid: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateGame = async (input: UpdateGameInput): Promise<void> => {
  requireAuthUid();
  const { id, ...rest } = input;
  const payload = Object.entries(rest).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  await updateDoc(doc(getDb(), "games", id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};

export const createSession = async (input: CreateSessionInput): Promise<string> => {
  const uid = requireAuthUid();
  const ref = await addDoc(collection(getDb(), "games", input.gameId, "logs"), {
    ...input,
    loggedByUid: uid,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const subscribeToUserSessions = (uid: string, callback: (sessions: SessionLog[]) => void) => {
  const q = query(
    firestoreRefs.logsCollectionGroup(),
    where("loggedByUid", "==", uid),
    orderBy("playedAt", "desc"),
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docSnapshot) => docSnapshot.data()));
  });
};

export const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const ref = doc(getDb(), "users", uid).withConverter(profileConverter);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data();
};

export const defaultGameQueryConstraints = (): QueryConstraint[] => [
  orderBy("createdAt", "desc"),
];

export const subscribeToFavorites = (uid: string, callback: (favoriteIds: string[]) => void) => {
  const authUid = requireAuthUid();
  if (authUid !== uid) {
    throw new Error("Cannot subscribe to another user's favorites.");
  }
  return onSnapshot(firestoreRefs.favorites(uid), (snapshot) => {
    callback(snapshot.docs.map((docSnapshot) => docSnapshot.id));
  });
};

export const addFavoriteGame = async (gameId: string): Promise<void> => {
  const uid = requireAuthUid();
  const ref = doc(getDb(), "users", uid, "favorites", gameId);
  await setDoc(ref, { createdAt: serverTimestamp() }, { merge: true });
};

export const removeFavoriteGame = async (gameId: string): Promise<void> => {
  const uid = requireAuthUid();
  const ref = doc(getDb(), "users", uid, "favorites", gameId);
  await deleteDoc(ref);
};


export interface GameRatings {
  averageFun: number | null;
  averageEngagement: number | null;
}

export const fetchGameRatings = async (gameId: string): Promise<GameRatings> => {
  const snapshot = await getDocs(firestoreRefs.logsForGame(gameId));
  if (snapshot.empty) {
    return { averageFun: null, averageEngagement: null };
  }
  let funTotal = 0;
  let engagementTotal = 0;
  let count = 0;
  snapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data();
    funTotal += data.funRating;
    engagementTotal += data.engagementRating;
    count += 1;
  });
  return {
    averageFun: Number((funTotal / count).toFixed(1)),
    averageEngagement: Number((engagementTotal / count).toFixed(1)),
  };
};
