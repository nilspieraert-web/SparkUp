import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { LogStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { fetchSessionById } from '../../services/firestore';

type Props = NativeStackScreenProps<LogStackParamList, 'SessionDetail'>;

export const SessionDetailScreen: React.FC<Props> = ({ route }) => {
  const { sessionId } = route.params;

  const { data: session, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => fetchSessionById(sessionId),
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
    <ScreenContainer>
      <View style={styles.section}>
        <ThemedText variant="heading">Session detail</ThemedText>
        <ThemedText>Game ID: {session.gameId}</ThemedText>
        <ThemedText>Played: {new Date(session.playedAt).toLocaleString()}</ThemedText>
        <ThemedText>Context: {session.context}</ThemedText>
        <ThemedText>Fun: {session.funRating}/5</ThemedText>
        <ThemedText>Engagement: {session.engagementRating}/5</ThemedText>
        <ThemedText>Iedereen deed mee: {session.kidsAllJoined ? 'Ja' : 'Nee'}</ThemedText>
        <ThemedText style={styles.notes}>{session.notes}</ThemedText>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
  notes: {
    marginTop: 8,
  },
});
