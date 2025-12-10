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
import { sendPasswordReset } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

interface ForgotPasswordValues {
  email: string;
}

const validationSchema = Yup.object<ForgotPasswordValues>({
  email: Yup.string().email('Geef een geldige email').required('Email is verplicht'),
});

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  return (
    <ScreenContainer scrollable>
      <ThemedText variant="heading" style={styles.title}>
        Reset je wachtwoord
      </ThemedText>
      <ThemedText style={styles.description}>Geef het emailadres van je account. Je krijgt een reset-link.</ThemedText>

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

            {submitted ? (
              <ThemedText style={styles.feedback}>
                Als dit emailadres bestaat, ontvang je zo meteen een reset-link.
              </ThemedText>
            ) : null}

            <PrimaryButton
              label="Stuur reset-link"
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting || status === 'loading'}
            />
          </View>
        )}
      </Formik>

      <PrimaryButton
        label="Terug naar login"
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
    marginBottom: 20,
  },
  form: {
    gap: 8,
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
  feedback: {
    marginBottom: 8,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    marginTop: 12,
  },
  ghostButtonText: {
    color: '#2563EB',
  },
});
