import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer scrollable>
      <View style={styles.section}>
        <ThemedText variant="heading">Registreren</ThemedText>
        <ThemedText>In een latere stap komt de echte formulier- en Firebase-logica.</ThemedText>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Heb al een account" onPress={() => navigation.navigate('Login')} />
        <PrimaryButton label="Terug naar welkom" onPress={() => navigation.navigate('Welcome')} />
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
