export type SessionContext = 'indoor' | 'outdoor';

export interface SessionLog {
  id: string;
  gameId: string;
  playedAt: number;
  context: SessionContext;
  funRating: 1 | 2 | 3 | 4 | 5;
  engagementRating: 1 | 2 | 3 | 4 | 5;
  kidsAllJoined: boolean;
  notes: string;
  createdBy: string;
  createdAt: number;
}
