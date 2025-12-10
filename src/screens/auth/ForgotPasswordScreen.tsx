import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer scrollable>
      <View style={styles.section}>
        <ThemedText variant="heading">Wachtwoord vergeten</ThemedText>
        <ThemedText>Dit is een placeholder. In de echte flow komt hier de reset-actie.</ThemedText>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Terug naar login" onPress={() => navigation.navigate('Login')} />
        <PrimaryButton label="Naar welkom" onPress={() => navigation.navigate('Welcome')} />
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
