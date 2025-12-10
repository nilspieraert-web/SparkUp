import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';

type Props = NativeStackScreenProps<LogStackParamList, 'LogSession'>;

export const LogSessionScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer scrollable>
      <View style={styles.section}>
        <ThemedText variant="heading">Log session</ThemedText>
        <ThemedText>Hier komt de Formik/Yup flow voor sessies. Nu enkel navigatie.</ThemedText>
      </View>
      <PrimaryButton
        label="Open sessie detail"
        onPress={() => navigation.navigate('SessionDetail', { sessionId: 'demo-session' })}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 8,
    marginBottom: 16,
  },
});
