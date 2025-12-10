import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SessionLog } from '../types/session';
import { ThemedText } from './ThemedText';
import { useTheme } from '../contexts/ThemeContext';

interface SessionSummaryCardProps {
  session: SessionLog;
  onPress?: (sessionId: string) => void;
}

export const SessionSummaryCard: React.FC<SessionSummaryCardProps> = ({ session, onPress }) => {
  const { theme } = useTheme();
  const displayDate = new Date(session.playedAt).toLocaleDateString();

  const content = (
    <>
      <ThemedText variant="subheading">{displayDate}</ThemedText>
      <View style={styles.row}>
        <ThemedText>Fun: {session.funRating}/5</ThemedText>
        <ThemedText>Engagement: {session.engagementRating}/5</ThemedText>
      </View>
      <ThemedText style={styles.notes} numberOfLines={2}>
        {session.notes || 'No notes logged'}
      </ThemedText>
    </>
  );

  const commonStyle = [styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }];

  if (onPress) {
    return (
      <Pressable style={commonStyle} onPress={() => onPress(session.id)} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }

  return <View style={commonStyle}>{content}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  notes: {
    marginTop: 8,
  },
});
