import React from 'react';
import { useField } from 'formik';
import { View, StyleSheet, Switch } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useTheme } from '../../contexts/ThemeContext';

interface FormSwitchFieldProps {
  name: string;
  label: string;
}

export const FormSwitchField: React.FC<FormSwitchFieldProps> = ({ name, label }) => {
  const [field, , helpers] = useField<boolean>(name);
  const { theme } = useTheme();

  const handleChange = (value: boolean) => {
    void helpers.setValue(value);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Switch
        value={field.value}
        onValueChange={handleChange}
        thumbColor={field.value ? '#FFFFFF' : '#E5E7EB'}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    flex: 1,
    marginRight: 12,
  },
});
