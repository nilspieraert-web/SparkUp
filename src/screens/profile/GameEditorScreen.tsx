import React, { useEffect } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { useQueryClient } from '@tanstack/react-query';
import { ProfileStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { FormTextField } from '../../components/forms/FormTextField';
import { FormSwitchField } from '../../components/forms/FormSwitchField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { THEMES } from '../../../utils/constants';
import { createGame, fetchGameById, updateGame } from '../../services/firestore';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

type Props = NativeStackScreenProps<ProfileStackParamList, 'GameEditor'>;

interface GameEditorValues {
  title: string;
  theme: string;
  description: string;
  durationMins: string;
  minAge: string;
  maxAge: string;
  indoorAllowed: boolean;
  outdoorAllowed: boolean;
  coverPhotoUrl?: string;
}

const REQUIRED_FIELD_KEYS: Array<keyof Pick<GameEditorValues, 'title' | 'theme' | 'description' | 'durationMins' | 'minAge' | 'maxAge'>> = [
  'title',
  'theme',
  'description',
  'durationMins',
  'minAge',
  'maxAge',
];

const REQUIRED_FIELD_LABELS: Record<typeof REQUIRED_FIELD_KEYS[number], string> = {
  title: 'Titel',
  theme: 'Thema',
  description: 'Beschrijving',
  durationMins: 'Duur',
  minAge: 'Minimum leeftijd',
  maxAge: 'Maximum leeftijd',
};

const numericString = (min: number, max: number, label: string) =>
  Yup.string()
    .required(`${label} is verplicht`)
    .matches(/^\d+$/, 'Enkel cijfers')
    .test('range', `Tussen ${min} en ${max}`, (value) => {
      if (!value) {
        return false;
      }
      const numeric = Number(value);
      return numeric >= min && numeric <= max;
    });

const validationSchema = Yup.object<GameEditorValues>({
  title: Yup.string().trim().required('Titel is verplicht').max(80, 'Hou het kort'),
  theme: Yup.string().trim().required('Kies een thema'),
  description: Yup.string().trim().required('Beschrijf het spel').max(1000, 'Beschrijving te lang'),
  durationMins: numericString(1, 240, 'Duur'),
  minAge: numericString(4, 18, 'Minimum leeftijd'),
  maxAge: numericString(4, 18, 'Maximum leeftijd').test('age-order', 'Max leeftijd moet ≥ min leeftijd zijn', function (value) {
    if (!value) {
      return false;
    }
    const minAge = Number(this.parent.minAge);
    const maxAge = Number(value);
    return maxAge >= minAge;
  }),
  indoorAllowed: Yup.boolean().required(),
  outdoorAllowed: Yup.boolean().required(),
  coverPhotoUrl: Yup.string()
    .optional()
    .test('valid-image-uri', 'Kies een geldige foto (file/http)', (value) => {
      if (!value) {
        return true;
      }
      const trimmed = value.trim();
      return /^(https?:\/\/|file:\/\/|content:\/\/)/i.test(trimmed);
    }),
});

export const GameEditorScreen: React.FC<Props> = ({ route, navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const gameId = route.params?.gameId;
  const [initialValues, setInitialValues] = React.useState<GameEditorValues>({
    title: '',
    theme: '',
    description: '',
    durationMins: '30',
    minAge: '6',
    maxAge: '14',
    indoorAllowed: true,
    outdoorAllowed: false,
    coverPhotoUrl: undefined,
  });

  useEffect(() => {
    if (!gameId) {
      return;
    }
    const load = async () => {
      const existingGame = await fetchGameById(gameId);
      if (existingGame) {
        setInitialValues({
          title: existingGame.title,
          theme: existingGame.theme,
          description: existingGame.description,
          durationMins: String(existingGame.durationMins),
          minAge: String(existingGame.ageRange.min),
          maxAge: String(existingGame.ageRange.max),
          indoorAllowed: existingGame.indoorAllowed,
          outdoorAllowed: existingGame.outdoorAllowed,
          coverPhotoUrl: existingGame.coverPhotoUrl ?? undefined,
        });
      }
    };
    void load();
  }, [gameId]);

  const pickImage = async (setFieldValue: (field: keyof GameEditorValues, value: string | undefined) => void) => {
    const [{ status: libraryStatus }, { status: cameraStatus }] = await Promise.all([
      ImagePicker.requestMediaLibraryPermissionsAsync(),
      ImagePicker.requestCameraPermissionsAsync(),
    ]);

    const handleResult = (result: ImagePicker.ImagePickerResult) => {
      if (result.canceled) {
        return;
      }
      const asset = result.assets[0];
      if (asset?.uri) {
        setFieldValue('coverPhotoUrl', asset.uri);
      }
    };

    const openLibrary = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      handleResult(result);
    };

    const openCamera = async () => {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });
      handleResult(result);
    };

    if (libraryStatus !== ImagePicker.PermissionStatus.GRANTED && cameraStatus !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert('Geen toegang', 'Geef camera of fotobibliotheek toegang om een cover toe te voegen.');
      return;
    }

    if (libraryStatus === ImagePicker.PermissionStatus.GRANTED && cameraStatus === ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert('Cover photo', 'Hoe wil je een foto toevoegen?', [
        { text: 'Foto nemen', onPress: () => void openCamera() },
        { text: 'Kies uit bibliotheek', onPress: () => void openLibrary() },
        { text: 'Annuleer', style: 'cancel' },
      ]);
      return;
    }

    if (cameraStatus === ImagePicker.PermissionStatus.GRANTED) {
      await openCamera();
      return;
    }

    if (libraryStatus === ImagePicker.PermissionStatus.GRANTED) {
      await openLibrary();
    }
  };

  if (!user) {
    return (
      <ScreenContainer>
        <ThemedText>Log in om games te beheren.</ThemedText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <Formik<GameEditorValues>
        enableReinitialize
        validateOnMount
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          const normalizedCoverPhotoUrl = values.coverPhotoUrl?.trim() ?? '';
          const sharedPayload = {
            title: values.title.trim(),
            theme: values.theme.trim(),
            description: values.description.trim(),
            durationMins: Number(values.durationMins),
            ageRange: {
              min: Number(values.minAge),
              max: Number(values.maxAge),
            },
            indoorAllowed: values.indoorAllowed,
            outdoorAllowed: values.outdoorAllowed,
          };
          const coverPhotoUrl = normalizedCoverPhotoUrl.length > 0 ? normalizedCoverPhotoUrl : null;

          try {
            if (gameId) {
              await updateGame({
                id: gameId,
                ...sharedPayload,
                createdBy: user.id,
                coverPhotoUrl,
              });
            } else {
              await createGame({
                ...sharedPayload,
                ...(coverPhotoUrl ? { coverPhotoUrl } : {}),
                createdBy: user.id,
              });
            }
            void queryClient.invalidateQueries({ queryKey: ['games'] });
            navigation.goBack();
          } catch (error) {
            Alert.alert('Opslaan mislukt', 'We konden het spel niet opslaan. Probeer opnieuw.');
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, isSubmitting, isValid, setFieldValue, values, errors }) => {
          const validationMessages = REQUIRED_FIELD_KEYS.map((field) => {
            const message = errors[field];
            if (typeof message !== 'string') {
              return null;
            }
            return {
              field,
              message,
            };
          }).filter((entry): entry is { field: typeof REQUIRED_FIELD_KEYS[number]; message: string } => entry !== null);

          return (
            <View>
              <FormTextField name="title" label="Titel" placeholder="Game titel" />
              <FormTextField name="theme" label="Thema" placeholder={`Bijv: ${THEMES.join(', ')}`} />
              <FormTextField name="description" label="Beschrijving" placeholder="Leg uit hoe het spel werkt..." multiline />
              <FormTextField name="durationMins" label="Duur (minuten)" keyboardType="numeric" />
              <View style={styles.row}>
                <View style={styles.half}>
                  <FormTextField name="minAge" label="Min leeftijd" keyboardType="numeric" />
                </View>
                <View style={styles.half}>
                  <FormTextField name="maxAge" label="Max leeftijd" keyboardType="numeric" />
                </View>
              </View>
              <FormSwitchField name="indoorAllowed" label="Indoor geschikt" />
              <FormSwitchField name="outdoorAllowed" label="Outdoor geschikt" />

              {values.coverPhotoUrl ? <Image source={{ uri: values.coverPhotoUrl }} style={styles.cover} /> : null}

              <PrimaryButton
                label={values.coverPhotoUrl ? 'Wijzig cover photo' : 'Voeg cover photo toe'}
                onPress={() => pickImage((field, value) => setFieldValue(field, value))}
                style={styles.button}
              />

              {!isValid && validationMessages.length > 0 ? (
                <View style={[styles.validationContainer, { borderColor: theme.colors.danger, backgroundColor: theme.colors.card }]}>
                  <ThemedText variant="caption" style={[styles.validationTitle, { color: theme.colors.danger }]}>
                    Vul deze velden in om op te slaan:
                  </ThemedText>
                  {validationMessages.map(({ field, message }) => (
                    <ThemedText variant="caption" key={field} style={[styles.validationMessage, { color: theme.colors.danger }]}>
                      - {REQUIRED_FIELD_LABELS[field]}: {message}
                    </ThemedText>
                  ))}
                </View>
              ) : null}

              <PrimaryButton
                label={gameId ? 'Update game' : 'Maak game'}
                onPress={handleSubmit}
                disabled={!isValid || isSubmitting}
              />
            </View>
          );
        }}
      </Formik>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  cover: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  validationContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  validationTitle: {
    marginBottom: 4,
    fontFamily: 'Urbanist_600SemiBold',
  },
  validationMessage: {
    marginBottom: 2,
  },
});
