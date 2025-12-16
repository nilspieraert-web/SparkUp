import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { FormTextField } from '../../components/forms/FormTextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AuthStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { loginWithEmail } from '../../features/auth/authSlice';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object<LoginFormValues>({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const errorMessage = useAppSelector((state) => state.auth.errorMessage);

  return (
    <ScreenContainer scrollable>
      <ThemedText variant="heading" style={styles.title}>
        Welcome back
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
        {({ handleSubmit, isSubmitting, isValid }) => (
          <View>
            <FormTextField
              name="email"
              label="Email"
              placeholder="leader@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <FormTextField
              name="password"
              label="Password"
              placeholder="••••••••"
              secureTextEntry
            />

            {errorMessage ? (
              <ThemedText style={styles.error}>
                {errorMessage}
              </ThemedText>
            ) : null}

            <PrimaryButton
              label="Log In"
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting || status === 'loading'}
            />
          </View>
        )}
      </Formik>

      <PrimaryButton
        label="Forgot password?"
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.ghostButton}
        textStyle={styles.ghostButtonText}
      />
      <PrimaryButton
        label="Need an account? Register"
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
  error: {
    marginBottom: 12,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    marginTop: 12,
  },
  ghostButtonText: {
    color: '#2563EB',
  },
});
