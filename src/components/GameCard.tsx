import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Game } from '../types/game';
import { ThemedText } from './ThemedText';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';

interface GameCardProps {
  game: Game;
  onPress: (game: Game) => void;
  onToggleFavorite?: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPress, onToggleFavorite }) => {
  const { theme } = useTheme();
  const { hasFavorite } = useFavorites();
  const isFavorite = hasFavorite(game.id);

  return (
    <Pressable
      onPress={() => onPress(game)}
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      accessibilityRole="button"
    >
      {game.coverPhotoUrl ? (
        <Image source={{ uri: game.coverPhotoUrl }} style={styles.cover} />
      ) : (
        <View style={[styles.placeholderCover, { backgroundColor: theme.colors.secondary }]}>
          <ThemedText variant="heading" style={styles.placeholderText}>
            {game.title.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="heading" numberOfLines={1}>
            {game.title}
          </ThemedText>
          <Pressable
            onPress={() => onToggleFavorite?.(game.id)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
          >
            <ThemedText variant="heading" style={{ color: isFavorite ? theme.colors.primary : theme.colors.muted }}>
              {isFavorite ? '★' : '☆'}
            </ThemedText>
          </Pressable>
        </View>
        <ThemedText variant="subheading" style={{ color: theme.colors.muted }}>
          {game.theme} • {game.durationMins} mins
        </ThemedText>
        <ThemedText numberOfLines={2}>{game.description}</ThemedText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cover: {
    height: 140,
    width: '100%',
  },
  placeholderCover: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});
