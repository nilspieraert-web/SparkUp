export interface UiState {
  badges: {
    favorites: number;
    unreadNotifications: number;
  };
  lastSeenFeedPosition: number;
  isHydrated: boolean;
}
