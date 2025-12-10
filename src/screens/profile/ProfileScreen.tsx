import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <ThemedText variant="heading">Profile</ThemedText>
        <ThemedText>Profielbeheer en thema-instellingen volgen later.</ThemedText>
      </View>
      <PrimaryButton label="Open game editor" onPress={() => navigation.navigate('GameEditor', {})} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 8,
    marginBottom: 16,
  },
});
