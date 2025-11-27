export interface AgeRange {
  min: number;
  max: number;
}

export interface Game {
  id: string;
  title: string;
  theme: string;
  ageRange: AgeRange;
  durationMins: number;
  indoorAllowed: boolean;
  outdoorAllowed: boolean;
  description: string;
  coverPhotoUrl?: string | null;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface GameFilterState {
  indoorOutdoor: 'any' | 'indoor' | 'outdoor';
  theme: string | null;
  minAge: number | null;
  maxAge: number | null;
  maxDuration: number | null;
  searchQuery: string;
}

export interface GameFilterPayload {
  key: keyof GameFilterState;
  value: GameFilterState[keyof GameFilterState];
}
