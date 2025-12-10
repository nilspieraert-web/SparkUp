import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DiscoverStackParamList, FavoritesStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';

type DiscoverProps = NativeStackScreenProps<DiscoverStackParamList, 'GameDetail'>;
type FavoritesProps = NativeStackScreenProps<FavoritesStackParamList, 'GameDetail'>;
type Props = DiscoverProps | FavoritesProps;

export const GameDetailScreen: React.FC<Props> = ({ route }) => {
  const { gameId } = route.params;

  return (
    <ScreenContainer>
      <View style={styles.section}>
        <ThemedText variant="heading">Game detail</ThemedText>
        <ThemedText>Game ID: {gameId}</ThemedText>
        <ThemedText>Details volgen zodra Firestore/React Query is aangesloten.</ThemedText>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
});
