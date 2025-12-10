import { useEffect, useMemo, useState } from 'react';
import { subscribeToUserSessions } from '../services/firestore';
import { SessionLog } from '../types/session';
import { useAuth } from './useAuth';

interface UseSessionsResult {
  sessions: SessionLog[];
  isLoading: boolean;
}

export const useSessions = (): UseSessionsResult => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToUserSessions(user.id, (sessionLogs) => {
      setSessions(sessionLogs);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => b.playedAt - a.playedAt);
  }, [sessions]);

  return {
    sessions: sortedSessions,
    isLoading,
  };
};
