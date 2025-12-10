import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { loginWithEmail } from '../../features/auth/authSlice';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object<LoginFormValues>({
  email: Yup.string().email('Geef een geldige email').required('Email is verplicht'),
  password: Yup.string().min(6, 'Minstens 6 tekens').required('Wachtwoord is verplicht'),
});

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const errorMessage = useAppSelector((state) => state.auth.errorMessage);

  return (
    <ScreenContainer scrollable>
      <ThemedText variant="heading" style={styles.title}>
        Log in
      </ThemedText>

      <Formik<LoginFormValues>
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          const result = await dispatch(loginWithEmail(values));
          if (loginWithEmail.rejected.match(result)) {
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, values, errors, touched, handleSubmit, isSubmitting, isValid }) => (
          <View style={styles.form}>
            <ThemedText variant="subheading">Email</ThemedText>
            <TextInput
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="leader@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              style={[
                styles.input,
                {
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card,
                },
              ]}
              placeholderTextColor={theme.colors.muted}
            />
            {touched.email && errors.email ? <ThemedText style={styles.error}>{errors.email}</ThemedText> : null}

            <ThemedText variant="subheading" style={styles.fieldLabel}>
              Wachtwoord
            </ThemedText>
            <TextInput
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              placeholder="••••••••"
              secureTextEntry
              style={[
                styles.input,
                {
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card,
                },
              ]}
              placeholderTextColor={theme.colors.muted}
            />
            {touched.password && errors.password ? <ThemedText style={styles.error}>{errors.password}</ThemedText> : null}

            {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}

            <PrimaryButton
              label="Log in"
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting || status === 'loading'}
            />
          </View>
        )}
      </Formik>

      <PrimaryButton
        label="Wachtwoord vergeten?"
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.ghostButton}
        textStyle={styles.ghostButtonText}
      />
      <PrimaryButton
        label="Nog geen account? Registreren"
        onPress={() => navigation.navigate('Register')}
        style={styles.ghostButton}
        textStyle={styles.ghostButtonText}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 24,
  },
  form: {
    gap: 8,
  },
  fieldLabel: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Urbanist_400Regular',
  },
  error: {
    color: '#DC2626',
    marginBottom: 4,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    marginTop: 12,
  },
  ghostButtonText: {
    color: '#2563EB',
  },
});
