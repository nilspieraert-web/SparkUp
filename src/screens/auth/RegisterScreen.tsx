import React from 'react';
import { StyleSheet, Switch, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useTheme } from '../../contexts/ThemeContext';
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
  displayName: Yup.string().required('Naam is verplicht').max(60, 'Hou het beknopt'),
  email: Yup.string().email('Geef een geldige email').required('Email is verplicht'),
  password: Yup.string().min(6, 'Minstens 6 tekens').required('Wachtwoord is verplicht'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Wachtwoorden moeten overeenkomen')
    .required('Bevestig je wachtwoord'),
  acceptPolicy: Yup.boolean().oneOf([true], 'Aanvaard de gebruiksafspraken'),
});

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const errorMessage = useAppSelector((state) => state.auth.errorMessage);

  return (
    <ScreenContainer scrollable>
      <ThemedText variant="heading" style={styles.title}>
        Maak een account
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
        {({ handleChange, handleBlur, values, errors, touched, handleSubmit, isSubmitting, isValid, setFieldValue }) => (
          <View style={styles.form}>
            <ThemedText variant="subheading">Naam</ThemedText>
            <TextInput
              value={values.displayName}
              onChangeText={handleChange('displayName')}
              onBlur={handleBlur('displayName')}
              placeholder="Groepsleider"
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
            {touched.displayName && errors.displayName ? <ThemedText style={styles.error}>{errors.displayName}</ThemedText> : null}

            <ThemedText variant="subheading" style={styles.fieldLabel}>
              Email
            </ThemedText>
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

            <ThemedText variant="subheading" style={styles.fieldLabel}>
              Bevestig wachtwoord
            </ThemedText>
            <TextInput
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
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
            {touched.confirmPassword && errors.confirmPassword ? (
              <ThemedText style={styles.error}>{errors.confirmPassword}</ThemedText>
            ) : null}

            <View style={styles.switchRow}>
              <Switch
                value={values.acceptPolicy}
                onValueChange={(value) => {
                  setFieldValue('acceptPolicy', value);
                }}
                thumbColor={values.acceptPolicy ? theme.colors.primary : theme.colors.border}
              />
              <ThemedText style={styles.switchLabel}>
                Ik ga akkoord met zorgvuldig loggen (privacy jeugdleden).
              </ThemedText>
            </View>
            {touched.acceptPolicy && errors.acceptPolicy ? <ThemedText style={styles.error}>{errors.acceptPolicy}</ThemedText> : null}

            {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}

            <PrimaryButton
              label="Registreren"
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting || status === 'loading'}
            />
          </View>
        )}
      </Formik>

      <PrimaryButton
        label="Ik heb al een account"
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  switchLabel: {
    flex: 1,
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
