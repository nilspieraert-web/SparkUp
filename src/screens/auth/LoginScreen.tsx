import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer scrollable>
      <View style={styles.section}>
        <ThemedText variant="heading">Login</ThemedText>
        <ThemedText>Auth flow komt later. Gebruik de knoppen om de navigatie te testen.</ThemedText>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Terug naar welkom" onPress={() => navigation.navigate('Welcome')} />
        <PrimaryButton label="Ga naar register" onPress={() => navigation.navigate('Register')} />
        <PrimaryButton label="Wachtwoord vergeten" onPress={() => navigation.navigate('ForgotPassword')} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 8,
    marginBottom: 24,
  },
  actions: {
    gap: 12,
  },
});
