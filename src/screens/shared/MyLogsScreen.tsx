import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { useSessions } from '../../hooks/useSessions';
import { SessionSummaryCard } from '../../components/SessionSummaryCard';

type Props = DrawerScreenProps<RootDrawerParamList, 'MyLogs'>;

export const MyLogsScreen: React.FC<Props> = ({ navigation }) => {
  const { sessions, isLoading } = useSessions();

  return (
    <ScreenContainer>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SessionSummaryCard session={item} onPress={(id) => navigation.navigate('Home', { screen: 'LogStack', params: { screen: 'SessionDetail', params: { sessionId: id } } })} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>{isLoading ? 'Loading...' : 'Nog geen sessies gelogd.'}</ThemedText>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 32,
  },
  emptyText: {
    marginTop: 24,
    textAlign: 'center',
  },
});
