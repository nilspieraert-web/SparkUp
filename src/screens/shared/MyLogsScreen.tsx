import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useSessions } from '../../hooks/useSessions';
import { SessionSummaryCard } from '../../components/SessionSummaryCard';
import { ThemedText } from '../../components/ThemedText';

type Props = DrawerScreenProps<RootDrawerParamList, 'MyLogs'>;

export const MyLogsScreen: React.FC<Props> = ({ navigation }) => {
  const { sessions, isLoading } = useSessions();

  return (
    <ScreenContainer>
      <FlatList
        data={sessions}
        contentContainerStyle={styles.content}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SessionSummaryCard
            session={item}
            onPress={() =>
              navigation.navigate('Home', {
                screen: 'LogStack',
                params: { screen: 'SessionDetail', params: { sessionId: item.id, gameId: item.gameId } },
              })
            }
          />
        )}
        ListEmptyComponent={
          <ThemedText style={styles.empty}>
            {isLoading ? 'Loading...' : 'You have not logged any sessions yet.'}
          </ThemedText>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  empty: {
    marginTop: 32,
    textAlign: 'center',
  },
});
