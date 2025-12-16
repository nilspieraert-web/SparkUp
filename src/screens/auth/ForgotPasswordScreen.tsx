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
import { sendPasswordReset } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

interface ForgotPasswordValues {
  email: string;
}

const validationSchema = Yup.object<ForgotPasswordValues>({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
});

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  return (
    <ScreenContainer scrollable>
      <ThemedText variant="heading" style={styles.title}>
        Reset your password
      </ThemedText>
      <ThemedText style={styles.description}>
        Enter the email tied to your account and we will send you a reset link.
      </ThemedText>

      <Formik<ForgotPasswordValues>
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          const result = await dispatch(sendPasswordReset(values));
          if (sendPasswordReset.fulfilled.match(result)) {
            setSubmitted(true);
          } else {
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

            {submitted ? (
              <ThemedText style={styles.feedback}>
                If the email exists, you will receive reset instructions shortly.
              </ThemedText>
            ) : null}

            <PrimaryButton
              label="Send reset link"
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting || status === 'loading'}
            />
          </View>
        )}
      </Formik>

      <PrimaryButton
        label="Back to login"
        onPress={() => navigation.navigate('Login')}
        style={styles.ghostButton}
        textStyle={styles.ghostButtonText}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
  },
  feedback: {
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
