import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemePreference } from '../../types/settings';
import { useAppDispatch } from '../../hooks/useRedux';
import { signOutUser } from '../../features/auth/authSlice';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { preference, setTheme, theme } = useTheme();
  const dispatch = useAppDispatch();

  const cycleTheme = () => {
    const order: ThemePreference[] = ['light', 'dark', 'system'];
    const currentIndex = order.indexOf(preference);
    const next = order[(currentIndex + 1) % order.length];
    setTheme(next);
  };

  return (
    <ScreenContainer scrollable>
      {user ? (
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <ThemedText variant="heading">{user.displayName}</ThemedText>
          <ThemedText style={styles.subtitle}>{user.email}</ThemedText>
          <ThemedText style={[styles.meta, { color: theme.colors.muted }]}>
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </ThemedText>
        </View>
      ) : (
        <ThemedText>Sign in to manage your profile.</ThemedText>
      )}

      <PrimaryButton
        label={`Theme preference: ${preference}`}
        onPress={cycleTheme}
        style={styles.button}
      />
      <PrimaryButton
        label="Create a game"
        onPress={() => navigation.navigate('GameEditor', {})}
        style={styles.button}
      />
      <PrimaryButton
        label="Sign out"
        onPress={() => dispatch(signOutUser())}
        style={[styles.signOut, { backgroundColor: theme.colors.danger }]}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 4,
  },
  meta: {
    marginTop: 8,
    opacity: 0.8,
  },
  button: {
    marginBottom: 12,
  },
  signOut: {
    backgroundColor: '#DC2626',
  },
});
