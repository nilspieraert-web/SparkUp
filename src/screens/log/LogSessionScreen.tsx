import React from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { LogStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';
import { PrimaryButton } from '../../components/PrimaryButton';
import { FormTextField } from '../../components/forms/FormTextField';
import { FormSegmentedControl } from '../../components/forms/FormSegmentedControl';
import { FormRatingGroup } from '../../components/forms/FormRatingGroup';
import { FormSwitchField } from '../../components/forms/FormSwitchField';
import { FormDateTimeField } from '../../components/forms/FormDateTimeField';
import { createSession, defaultGameQueryConstraints, fetchGames } from '../../services/firestore';
import { useAuth } from '../../hooks/useAuth';
import { SessionContext } from '../../types/session';
import { Game } from '../../types/game';
import { useTheme } from '../../contexts/ThemeContext';

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
  gameId: Yup.string().required('Kies een spel om te loggen'),
  playedAt: Yup.number().required(),
  context: Yup.mixed<SessionContext>().oneOf(['indoor', 'outdoor']).required(),
  funRating: Yup.number().min(1).max(5).required(),
  engagementRating: Yup.number().min(1).max(5).required(),
  kidsAllJoined: Yup.boolean().required(),
  notes: Yup.string().min(4, 'Een korte notitie helpt later').required('Notes zijn verplicht'),
});

export const LogSessionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const initialGameId = route.params?.gameId ?? '';
  const { data: availableGames, isLoading: isGamesLoading, isError: hasGameFetchError } = useQuery<Game[]>({
    queryKey: ['games', 'log-session'],
    queryFn: async () => fetchGames(defaultGameQueryConstraints()),
  });
  const [isGamePickerOpen, setGamePickerOpen] = React.useState(false);

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
        Kies een spel en vul daarna je ervaring in zodat je later makkelijk kan terugvinden wat goed werkte.
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
        {({ handleSubmit, isSubmitting, isValid, setFieldValue, values, errors }) => {
          const games = availableGames ?? [];
          const selectedGame = games.find((game) => game.id === values.gameId);

          return (
          <View>
            <ThemedText variant="subheading" style={styles.sectionTitle}>
              Kies een spel
            </ThemedText>
            {isGamesLoading ? (
              <ActivityIndicator style={styles.gameListLoading} />
            ) : hasGameFetchError ? (
              <ThemedText style={styles.errorText}>Kon games niet laden. Probeer opnieuw.</ThemedText>
            ) : games.length === 0 ? (
              <ThemedText>Er zijn nog geen games beschikbaar om te loggen.</ThemedText>
            ) : (
              <View>
                <Pressable
                  style={[
                    styles.dropdownTrigger,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.card,
                    },
                  ]}
                  onPress={() => setGamePickerOpen((prev) => !prev)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isGamePickerOpen }}
                >
                  <ThemedText numberOfLines={1}>
                    {selectedGame ? selectedGame.title : 'Selecteer een spel'}
                  </ThemedText>
                  <ThemedText variant="caption" style={{ color: theme.colors.muted }}>
                    {selectedGame ? `${selectedGame.theme} • ${selectedGame.durationMins} min` : 'Tik om lijst te openen'}
                  </ThemedText>
                </Pressable>
                {isGamePickerOpen ? (
                  <View style={[styles.dropdownList, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
                    {games.map((game) => {
                      const isSelected = values.gameId === game.id;
                      return (
                        <Pressable
                          key={game.id}
                          onPress={() => {
                            setFieldValue('gameId', game.id);
                            setGamePickerOpen(false);
                          }}
                          style={[
                            styles.gameOption,
                            {
                              borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                              backgroundColor: isSelected ? theme.colors.secondary : theme.colors.card,
                            },
                          ]}
                          accessibilityRole="button"
                          accessibilityState={{ selected: isSelected }}
                        >
                          <ThemedText variant="subheading" numberOfLines={1}>
                            {game.title}
                          </ThemedText>
                          <ThemedText variant="caption" style={{ color: theme.colors.muted }}>
                            {game.theme} • {game.durationMins} min
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            )}
            {errors.gameId ? (
              <ThemedText variant="caption" style={[styles.errorText, styles.gameError]}>
                {errors.gameId}
              </ThemedText>
            ) : null}

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
          );
        }}
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
  sectionTitle: {
    marginBottom: 8,
  },
  gameListLoading: {
    marginVertical: 12,
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  dropdownList: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
  },
  gameOption: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  errorText: {
    color: '#DC2626',
  },
  gameError: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 8,
  },
});
