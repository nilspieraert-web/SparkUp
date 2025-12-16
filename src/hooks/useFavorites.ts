import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import { setBadgeCount } from "../features/ui/uiSlice";

interface UseFavoritesResult {
  favoriteIds: string[];
  toggleFavorite: (gameId: string) => void;
  hasFavorite: (gameId: string) => boolean;
}

export const useFavorites = (): UseFavoritesResult => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.ids);

  useEffect(() => {
    dispatch(setBadgeCount({ key: "favorites", value: favoriteIds.length }));
  }, [dispatch, favoriteIds.length]);

  const toggle = (gameId: string) => {
    dispatch(toggleFavorite(gameId));
  };

  const hasFavorite = useMemo(() => {
    return (gameId: string) => favoriteIds.includes(gameId);
  }, [favoriteIds]);

  return {
    favoriteIds,
    toggleFavorite: toggle,
    hasFavorite,
  };
};
