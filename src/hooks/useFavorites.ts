import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { hydrateFavorites } from "../features/favorites/favoritesSlice";
import { setBadgeCount } from "../features/ui/uiSlice";
import { useAuth } from "./useAuth";
import { addFavoriteGame, removeFavoriteGame, subscribeToFavorites } from "../services/firestore";

interface UseFavoritesResult {
  favoriteIds: string[];
  toggleFavorite: (gameId: string) => Promise<void>;
  hasFavorite: (gameId: string) => boolean;
}

export const useFavorites = (): UseFavoritesResult => {
  const dispatch = useAppDispatch();
  const { user, status } = useAuth();
  const favoriteIds = useAppSelector((state) => state.favorites.ids);

  useEffect(() => {
    dispatch(setBadgeCount({ key: "favorites", value: favoriteIds.length }));
  }, [dispatch, favoriteIds.length]);

  useEffect(() => {
    if (!user || status !== "authenticated") {
      dispatch(hydrateFavorites([]));
      return;
    }
    const unsubscribe = subscribeToFavorites(user.id, (ids) => {
      dispatch(hydrateFavorites(ids));
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch, user?.id, status]);

  const toggle = async (gameId: string) => {
    if (!user || status !== "authenticated") {
      return;
    }
    const isFavorite = favoriteIds.includes(gameId);
    try {
      if (isFavorite) {
        await removeFavoriteGame(gameId);
      } else {
        await addFavoriteGame(gameId);
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
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
