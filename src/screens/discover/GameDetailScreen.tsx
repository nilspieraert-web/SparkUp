import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { DiscoverStackParamList, FavoritesStackParamList } from '../../navigation/types';
import { fetchGameById } from '../../services/firestore';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useFavorites } from '../../hooks/useFavorites';
import { useTheme } from '../../contexts/ThemeContext';

type DiscoverProps = NativeStackScreenProps<DiscoverStackParamList, 'GameDetail'>;
type FavoritesProps = NativeStackScreenProps<FavoritesStackParamList, 'GameDetail'>;
type Props = DiscoverProps | FavoritesProps;

export const GameDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { gameId } = route.params;
  const { toggleFavorite, hasFavorite } = useFavorites();
  const { theme } = useTheme();

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => fetchGameById(gameId),
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ThemedText>Loading game details...</ThemedText>
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.centered}>
        <ThemedText>Game not found.</ThemedText>
      </View>
    );
  }

  const favorite = hasFavorite(game.id);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      {game.coverPhotoUrl ? <Image source={{ uri: game.coverPhotoUrl }} style={styles.cover} /> : null}
      <View style={styles.content}>
        <ThemedText variant="heading" style={styles.title}>
          {game.title}
        </ThemedText>
        <ThemedText style={styles.meta}>
          {game.theme} · {game.durationMins} mins · Ages {game.ageRange.min}-{game.ageRange.max}
        </ThemedText>
        <ThemedText style={styles.description}>{game.description}</ThemedText>
        <View style={styles.buttonRow}>
          <PrimaryButton
            label={favorite ? 'Remove Favorite' : 'Add Favorite'}
            onPress={() => toggleFavorite(game.id)}
            style={styles.flexButton}
          />
          <PrimaryButton
            label="Log session"
            onPress={() =>
              navigation.getParent()?.navigate('LogStack', { screen: 'LogSession', params: { gameId: game.id } })
            }
            style={styles.flexButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  content: {
    padding: 16,
  },
  cover: {
    width: '100%',
    height: 220,
  },
  title: {
    marginBottom: 8,
  },
  meta: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  flexButton: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
