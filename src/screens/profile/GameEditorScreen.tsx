import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';

type Props = NativeStackScreenProps<ProfileStackParamList, 'GameEditor'>;

export const GameEditorScreen: React.FC<Props> = ({ route }) => {
  const gameId = route.params?.gameId;

  return (
    <ScreenContainer scrollable>
      <View style={styles.section}>
        <ThemedText variant="heading">Game editor</ThemedText>
        <ThemedText>{gameId ? `Bewerk game ${gameId}` : 'Nieuwe game aanmaken (placeholder).'}</ThemedText>
        <ThemedText>Hier komt later de expo-image-picker en Firestore-integratie.</ThemedText>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
});
