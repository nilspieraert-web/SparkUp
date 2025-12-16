import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGames, defaultGameQueryConstraints } from '../services/firestore';
import { Game } from '../types/game';
import type { RootState } from '../store';
import { useAppSelector } from './useRedux';

const filterGamesClientSide = (games: Game[], filters: RootState['filters']): Game[] => {
  return games.filter((game) => {
    const { indoorOutdoor, theme, minAge, maxAge, maxDuration, searchQuery } = filters;

    if (indoorOutdoor === 'indoor' && !game.indoorAllowed) {
      return false;
    }
    if (indoorOutdoor === 'outdoor' && !game.outdoorAllowed) {
      return false;
    }
    if (theme && game.theme.toLowerCase() !== theme.toLowerCase()) {
      return false;
    }
    if (minAge !== null && game.ageRange.min > minAge) {
      return false;
    }
    if (maxAge !== null && game.ageRange.max < maxAge) {
      return false;
    }
    if (maxDuration !== null && game.durationMins > maxDuration) {
      return false;
    }
    if (searchQuery.trim().length > 0) {
      const normalized = searchQuery.trim().toLowerCase();
      if (!game.title.toLowerCase().includes(normalized) && !game.description.toLowerCase().includes(normalized)) {
        return false;
      }
    }
    return true;
  });
};

export const useGames = () => {
  const filters = useAppSelector((state) => state.filters);

  const queryKey = useMemo(() => ['games', filters], [filters]);

  const query = useQuery({
    queryKey,
    queryFn: async () => fetchGames(defaultGameQueryConstraints()),
  });

  const filteredGames = useMemo(() => {
    if (!query.data) {
      return [];
    }
    return filterGamesClientSide(query.data, filters);
  }, [filters, query.data]);

  return {
    ...query,
    games: filteredGames,
  };
};
