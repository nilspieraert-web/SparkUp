import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';

type Props = DrawerScreenProps<RootDrawerParamList, 'MyLogs'>;

export const MyLogsScreen: React.FC<Props> = () => {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <ThemedText variant="heading">My logs</ThemedText>
        <ThemedText>Hier komen later gelogde sessies. Nu enkel een placeholder.</ThemedText>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
});
