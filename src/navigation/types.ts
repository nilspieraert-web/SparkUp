import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type DiscoverStackParamList = {
  Discover: undefined;
  GameDetail: { gameId: string };
};

export type LogStackParamList = {
  LogSession: { gameId?: string } | undefined;
  SessionDetail: { sessionId: string };
};

export type FavoritesStackParamList = {
  Favorites: undefined;
  GameDetail: { gameId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  GameEditor: { gameId?: string };
};

export type RootTabParamList = {
  DiscoverStack: NavigatorScreenParams<DiscoverStackParamList>;
  LogStack: NavigatorScreenParams<LogStackParamList>;
  FavoritesStack: NavigatorScreenParams<FavoritesStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootDrawerParamList = {
  Home: NavigatorScreenParams<RootTabParamList> | undefined;
  MyLogs: undefined;
  Help: undefined;
};
