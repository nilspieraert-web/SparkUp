import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FavoritesStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';

type Props = NativeStackScreenProps<FavoritesStackParamList, 'Favorites'>;

export const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <ThemedText variant="heading">Favorites</ThemedText>
        <ThemedText>Nog geen Firestore-koppeling; dit is een placeholderlijst.</ThemedText>
      </View>
      <PrimaryButton label="Bekijk voorbeeld game" onPress={() => navigation.navigate('GameDetail', { gameId: 'demo' })} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 8,
    marginBottom: 16,
  },
});
