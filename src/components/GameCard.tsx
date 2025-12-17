import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Game } from '../types/game';
import { ThemedText } from './ThemedText';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';
import { useUserProfile } from '../hooks/useUserProfile';
import { fetchGameRatings } from '../services/firestore';

interface GameCardProps {
  game: Game;
  onPress: (game: Game) => void;
  onToggleFavorite?: (gameId: string) => void | Promise<void>;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPress, onToggleFavorite }) => {
  const { theme } = useTheme();
  const { hasFavorite } = useFavorites();
  const { data: creator } = useUserProfile(game.createdByUid);
  const { data: ratings } = useQuery({
    queryKey: ['game-ratings', game.id],
    queryFn: () => fetchGameRatings(game.id),
  });
  const isFavorite = hasFavorite(game.id);

  const avatarFallback = game.title.charAt(0).toUpperCase();
  const creatorInitials = creator?.displayName
    ? creator.displayName
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 2)
    : avatarFallback;
  const creatorName = creator?.displayName ?? 'Onbekende leider';

  return (
    <Pressable
      onPress={() => onPress(game)}
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      accessibilityRole="button"
    >
      <View style={styles.headerBar}>
        {creator?.avatarUrl ? (
          <Image source={{ uri: creator.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: theme.colors.secondary }]}>
            <ThemedText style={styles.avatarText}>{creatorInitials}</ThemedText>
          </View>
        )}
        <ThemedText numberOfLines={1} style={styles.creatorName}>
          {creatorName}
        </ThemedText>
      </View>

      {game.coverPhotoUrl ? (
        <Image source={{ uri: game.coverPhotoUrl }} style={styles.cover} />
      ) : (
        <View style={[styles.placeholderCover, { backgroundColor: theme.colors.secondary }]}>
          <ThemedText variant="heading" style={styles.placeholderText}>
            Foto bij het spel
          </ThemedText>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <ThemedText variant="heading" numberOfLines={2} style={styles.title}>
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
        <ThemedText variant="subheading" style={[styles.meta, { color: theme.colors.muted }]}>
          {game.theme} · {game.durationMins} mins
        </ThemedText>
        <ThemedText numberOfLines={3} style={styles.description}>
          {game.description}
        </ThemedText>

        <View style={styles.ratingsRow}>
          <ThemedText style={styles.ratingLabel}>
            Fun: {ratings?.averageFun ?? 'N/A'}
          </ThemedText>
          <ThemedText style={styles.ratingLabel}>
            Engagement: {ratings?.averageEngagement ?? 'N/A'}
          </ThemedText>
        </View>
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  creatorName: {
    flex: 1,
  },
  cover: {
    height: 220,
    width: '100%',
  },
  placeholderCover: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    paddingRight: 8,
  },
  meta: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
  },
  ratingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingLabel: {
    fontWeight: '600',
  },
});
