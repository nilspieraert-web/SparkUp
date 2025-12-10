import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <ScreenContainer scrollable>
      <View style={[styles.hero, { backgroundColor: theme.colors.secondary }]}>
        <View style={[styles.heroBadge, { backgroundColor: theme.colors.primary }]} />
        <ThemedText variant="subheading" style={[styles.heroText, { color: theme.colors.text }]}>
          Plan, speel en log je activiteiten met één app.
        </ThemedText>
      </View>
      <ThemedText variant="heading" style={styles.title}>
        SparkUp
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Ontdek spellen, bewaar favorieten en hou je sessies bij. Log in of maak een account om te starten.
      </ThemedText>
      <PrimaryButton label="Log in" onPress={() => navigation.navigate('Login')} />
      <PrimaryButton
        label="Account aanmaken"
        onPress={() => navigation.navigate('Register')}
        style={styles.secondaryButton}
        textStyle={styles.secondaryButtonText}
      />
      <PrimaryButton
        label="Wachtwoord vergeten"
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.ghostButton}
        textStyle={styles.ghostButtonText}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 220,
    marginBottom: 24,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  heroBadge: {
    position: 'absolute',
    top: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    opacity: 0.35,
  },
  heroText: {
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: 24,
  },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
  ghostButton: {
    backgroundColor: 'transparent',
    marginTop: 12,
  },
  ghostButtonText: {
    color: '#2563EB',
  },
});
