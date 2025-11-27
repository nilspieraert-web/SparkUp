import React, { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FavoritesStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { useFavorites } from '../../hooks/useFavorites';
import { useGames } from '../../hooks/useGames';
import { GameCard } from '../../components/GameCard';
import { Game } from '../../types/game';

type Props = NativeStackScreenProps<FavoritesStackParamList, 'Favorites'>;

export const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { games, isLoading } = useGames();

  const favoriteGames = useMemo(() => {
    const map = new Map(games.map((game) => [game.id, game]));
    return favoriteIds.map((id) => map.get(id)).filter(Boolean) as Game[];
  }, [favoriteIds, games]);

  const handlePress = (game: Game) => {
    navigation.navigate('GameDetail', { gameId: game.id });
  };

  return (
    <ScreenContainer>
      <FlatList
        data={favoriteGames}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GameCard game={item} onPress={handlePress} onToggleFavorite={toggleFavorite} />
        )}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>
            {isLoading ? 'Loading...' : 'Favorite games will appear here.'}
          </ThemedText>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    marginTop: 24,
    textAlign: 'center',
  },
});


