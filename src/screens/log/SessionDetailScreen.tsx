import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { LogStackParamList } from '../../navigation/types';
import { fetchGameById, fetchSessionById } from '../../services/firestore';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';

type Props = NativeStackScreenProps<LogStackParamList, 'SessionDetail'>;

export const SessionDetailScreen: React.FC<Props> = ({ route }) => {
  const { sessionId, gameId } = route.params;

  const { data: session, isLoading } = useQuery({
    queryKey: ['session', gameId, sessionId],
    queryFn: () => fetchSessionById(gameId, sessionId),
  });

  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => fetchGameById(gameId),
  });

  if (isLoading) {
    return (
      <ScreenContainer>
        <ThemedText>Loading session...</ThemedText>
      </ScreenContainer>
    );
  }

  if (!session) {
    return (
      <ScreenContainer>
        <ThemedText>Session not found.</ThemedText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <ThemedText variant="heading" style={styles.title}>
        {game?.title ?? 'Session'}
      </ThemedText>
      <ThemedText style={styles.meta}>
        Played {new Date(session.playedAt).toLocaleString()} • {session.context === 'indoor' ? 'Indoor' : 'Outdoor'}
      </ThemedText>
      <View style={styles.ratings}>
        <ThemedText>Fun rating: {session.funRating}/5</ThemedText>
        <ThemedText>Engagement: {session.engagementRating}/5</ThemedText>
      </View>
      <ThemedText style={styles.notesLabel}>Notes</ThemedText>
      <ThemedText>{session.notes || 'No notes recorded.'}</ThemedText>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
  meta: {
    marginBottom: 16,
  },
  ratings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  notesLabel: {
    marginBottom: 8,
  },
});
