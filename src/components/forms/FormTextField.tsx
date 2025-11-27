import React from 'react';
import { useField } from 'formik';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useTheme } from '../../contexts/ThemeContext';

interface FormTextFieldProps extends TextInputProps {
  name: string;
  label: string;
  multiline?: boolean;
}

export const FormTextField: React.FC<FormTextFieldProps> = ({ name, label, multiline = false, ...rest }) => {
  const [field, meta, helpers] = useField<string>(name);
  const { theme } = useTheme();
  const showError = Boolean(meta.touched && meta.error);

  return (
    <View style={styles.container}>
      <ThemedText variant="subheading" style={styles.label}>
        {label}
      </ThemedText>
      <TextInput
        {...rest}
        value={field.value}
        onBlur={() => helpers.setTouched(true)}
        onChangeText={helpers.setValue}
        multiline={multiline}
        style={[
          styles.input,
          {
            borderColor: showError ? theme.colors.danger : theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.card,
          },
          multiline && styles.multiline,
        ]}
        placeholderTextColor={theme.colors.muted}
      />
      {showError ? (
        <ThemedText variant="caption" style={[styles.error, { color: theme.colors.danger }]}>
          {meta.error}
        </ThemedText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Urbanist_400Regular',
    fontSize: 16,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  error: {
    marginTop: 4,
  },
});
