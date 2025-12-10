import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DiscoverStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'Discover'>;

export const DiscoverScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <ThemedText variant="heading">Discover</ThemedText>
        <ThemedText>Placeholder lijst. Later komt hier de Firestore/React Query feed.</ThemedText>
      </View>
      <PrimaryButton label="Open game detail" onPress={() => navigation.navigate('GameDetail', { gameId: 'demo' })} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 8,
    marginBottom: 16,
  },
});
