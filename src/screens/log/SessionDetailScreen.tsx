import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';

type Props = NativeStackScreenProps<LogStackParamList, 'SessionDetail'>;

export const SessionDetailScreen: React.FC<Props> = ({ route }) => {
  const { sessionId } = route.params;

  return (
    <ScreenContainer>
      <View style={styles.section}>
        <ThemedText variant="heading">Session detail</ThemedText>
        <ThemedText>Session ID: {sessionId}</ThemedText>
        <ThemedText>In een latere stap tonen we hier het Firestore logboek-item.</ThemedText>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
});
