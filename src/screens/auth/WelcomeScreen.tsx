import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer scrollable>
      <View style={styles.hero}>
        <ThemedText variant="heading">Welkom bij SparkUp</ThemedText>
        <ThemedText>Placeholder auth flow — de echte login/registratie volgt nog.</ThemedText>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Log in" onPress={() => navigation.navigate('Login')} />
        <PrimaryButton label="Maak account" onPress={() => navigation.navigate('Register')} />
        <PrimaryButton label="Wachtwoord vergeten" onPress={() => navigation.navigate('ForgotPassword')} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  hero: {
    marginBottom: 24,
    gap: 8,
  },
  actions: {
    gap: 12,
  },
});
