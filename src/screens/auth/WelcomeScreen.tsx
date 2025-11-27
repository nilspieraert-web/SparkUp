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
        <ThemedText variant="subheading" style={[styles.heroText, { color: theme.colors.text }]} >
          Plan, play, and record every activity with confidence.
        </ThemedText>
      </View>
      <ThemedText variant="heading" style={styles.title}>
        Spark up every gathering
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Discover tried-and-true games, keep track of what works, and keep your scouts buzzing.
      </ThemedText>
      <PrimaryButton label="Log In" onPress={() => navigation.navigate('Login')} />
      <PrimaryButton
        label="Create an account"
        onPress={() => navigation.navigate('Register')}
        style={styles.secondaryButton}
        textStyle={styles.secondaryButtonText}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 240,
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
    marginBottom: 32,
  },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
});




