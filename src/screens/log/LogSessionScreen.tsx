import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LogStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';
import { FormTextField } from '../../components/forms/FormTextField';
import { FormSegmentedControl } from '../../components/forms/FormSegmentedControl';
import { FormRatingGroup } from '../../components/forms/FormRatingGroup';
import { FormSwitchField } from '../../components/forms/FormSwitchField';
import { FormDateTimeField } from '../../components/forms/FormDateTimeField';
import { createSession } from '../../services/firestore';
import { useAuth } from '../../hooks/useAuth';
import { SessionContext } from '../../types/session';

type Props = NativeStackScreenProps<LogStackParamList, 'LogSession'>;

interface LogSessionFormValues {
  gameId: string;
  playedAt: number;
  context: SessionContext;
  funRating: 1 | 2 | 3 | 4 | 5;
  engagementRating: 1 | 2 | 3 | 4 | 5;
  kidsAllJoined: boolean;
  notes: string;
}

const validationSchema = Yup.object<LogSessionFormValues>({
  gameId: Yup.string().required('Kies een game-id (placeholder)'),
  playedAt: Yup.number().required(),
  context: Yup.mixed<SessionContext>().oneOf(['indoor', 'outdoor']).required(),
  funRating: Yup.number().min(1).max(5).required(),
  engagementRating: Yup.number().min(1).max(5).required(),
  kidsAllJoined: Yup.boolean().required(),
  notes: Yup.string().min(4, 'Een korte notitie helpt later').required('Notes zijn verplicht'),
});

export const LogSessionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const initialGameId = route.params?.gameId ?? '';

  const initialValues: LogSessionFormValues = {
    gameId: initialGameId,
    playedAt: Date.now(),
    context: 'indoor',
    funRating: 3,
    engagementRating: 3,
    kidsAllJoined: false,
    notes: '',
  };

  return (
    <ScreenContainer scrollable>
      <ThemedText variant="heading" style={styles.title}>
        Log een sessie
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Noteer hoe de activiteit liep. Gebruik voorlopig het game-id veld als handmatige input.
      </ThemedText>

      <Formik<LogSessionFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          if (!user) {
            Alert.alert('Log in', 'Je moet ingelogd zijn om een sessie te loggen.');
            return;
          }

          try {
            const id = await createSession({
              ...values,
              createdBy: user.id,
            });
            helpers.setSubmitting(false);
            navigation.navigate('SessionDetail', { sessionId: id });
          } catch (error) {
            helpers.setSubmitting(false);
            Alert.alert('Opslaan mislukt', (error as Error).message);
          }
        }}
      >
        {({ handleSubmit, isSubmitting, isValid }) => (
          <View>
            <FormTextField name="gameId" label="Game ID" placeholder="bv. uit de discover lijst" />

            <FormDateTimeField name="playedAt" label="Datum en tijd" mode="date" />

            <FormSegmentedControl
              name="context"
              label="Context"
              options={[
                { label: 'Indoor', value: 'indoor' },
                { label: 'Outdoor', value: 'outdoor' },
              ]}
            />

            <FormRatingGroup name="funRating" label="Fun" options={[1, 2, 3, 4, 5]} />
            <FormRatingGroup name="engagementRating" label="Engagement" options={[1, 2, 3, 4, 5]} />
            <FormSwitchField name="kidsAllJoined" label="Iedereen deed mee" />

            <FormTextField name="notes" label="Notities" placeholder="Wat werkte / wat niet?" multiline />

            <PrimaryButton
              label="Opslaan"
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting}
              style={styles.submitButton}
            />
          </View>
        )}
      </Formik>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});
