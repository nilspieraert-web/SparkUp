import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { FormTextField } from '../../components/forms/FormTextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { FormSwitchField } from '../../components/forms/FormSwitchField';
import { AuthStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { registerWithEmail } from '../../features/auth/authSlice';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

interface RegisterFormValues {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptPolicy: boolean;
}

const validationSchema = Yup.object<RegisterFormValues>({
  displayName: Yup.string().required('Name is required').max(60, 'Keep it concise'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
  acceptPolicy: Yup.boolean().oneOf([true], 'Please accept the usage policy'),
});

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const errorMessage = useAppSelector((state) => state.auth.errorMessage);

  return (
    <ScreenContainer scrollable>
      <ThemedText variant="heading" style={styles.title}>
        Create your account
      </ThemedText>

      <Formik<RegisterFormValues>
        initialValues={{
          displayName: '',
          email: '',
          password: '',
          confirmPassword: '',
          acceptPolicy: false,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          const result = await dispatch(registerWithEmail(values));
          if (registerWithEmail.rejected.match(result)) {
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, isSubmitting, isValid }) => (
          <View>
            <FormTextField
              name="displayName"
              label="Full name"
              placeholder="Pat Leader"
            />
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
            <FormTextField
              name="confirmPassword"
              label="Confirm password"
              placeholder="••••••••"
              secureTextEntry
            />
            <FormSwitchField
              name="acceptPolicy"
              label="I agree to responsibly log sessions with youth privacy in mind."
            />

            {errorMessage ? (
              <ThemedText style={styles.error}>
                {errorMessage}
              </ThemedText>
            ) : null}

            <PrimaryButton
              label="Register"
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting || status === 'loading'}
            />
          </View>
        )}
      </Formik>

      <PrimaryButton
        label="Already have an account? Log in"
        onPress={() => navigation.navigate('Login')}
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
