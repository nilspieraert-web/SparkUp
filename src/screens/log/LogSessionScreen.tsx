import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LogStackParamList } from '../../navigation/types';
import { FormTextField } from '../../components/forms/FormTextField';
import { FormDateTimeField } from '../../components/forms/FormDateTimeField';
import { FormSegmentedControl } from '../../components/forms/FormSegmentedControl';
import { FormRatingGroup } from '../../components/forms/FormRatingGroup';
import { FormSwitchField } from '../../components/forms/FormSwitchField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { FUN_RATING_OPTIONS, ENGAGEMENT_RATING_OPTIONS } from '../../../utils/constants';
import { useGames } from '../../hooks/useGames';
import { ThemedText } from '../../components/ThemedText';
import { ScreenContainer } from '../../components/ScreenContainer';
import { createSession } from '../../services/firestore';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

type Props = NativeStackScreenProps<LogStackParamList, 'LogSession'>;

interface LogSessionValues {
  gameId: string;
  playedAt: number;
  context: 'indoor' | 'outdoor';
  funRating: number;
  engagementRating: number;
  kidsAllJoined: boolean;
  notes: string;
}

const validationSchema = Yup.object<LogSessionValues>({
  gameId: Yup.string().required('Select a game to log'),
  playedAt: Yup.number().required(),
  context: Yup.mixed<'indoor' | 'outdoor'>().oneOf(['indoor', 'outdoor']).required(),
  funRating: Yup.number().min(1).max(5).required(),
  engagementRating: Yup.number().min(1).max(5).required(),
  kidsAllJoined: Yup.boolean().required(),
  notes: Yup.string().max(500, 'Try to keep notes concise'),
});

export const LogSessionScreen: React.FC<Props> = ({ route, navigation }) => {
  const initialGameId = route.params?.gameId ?? '';
  const { games } = useGames();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [gamePickerVisible, setGamePickerVisible] = useState(false);

  const selectedGame = useMemo(() => games.find((game) => game.id === initialGameId), [games, initialGameId]);
  const initialValues = useMemo<LogSessionValues>(
    () => ({
      gameId: selectedGame?.id ?? '',
      playedAt: Date.now(),
      context: 'indoor',
      funRating: 3,
      engagementRating: 3,
      kidsAllJoined: true,
      notes: '',
    }),
    [selectedGame?.id],
  );

  if (!user) {
    return (
      <ScreenContainer>
        <ThemedText>You need to be logged in to record sessions.</ThemedText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <Formik<LogSessionValues>
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          try {
            const newSessionId = await createSession({
              gameId: values.gameId,
              playedAt: values.playedAt,
              context: values.context,
              funRating: values.funRating as 1 | 2 | 3 | 4 | 5,
              engagementRating: values.engagementRating as 1 | 2 | 3 | 4 | 5,
              kidsAllJoined: values.kidsAllJoined,
              notes: values.notes,
            });
            helpers.setSubmitting(false);
            navigation.navigate('SessionDetail', { sessionId: newSessionId, gameId: values.gameId });
          } catch (error) {
            console.error('Failed to save session', error);
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, isSubmitting, isValid, values, setFieldValue }) => (
          <View>
            <Pressable
              style={[styles.selectField, { borderColor: theme.colors.border }]}
              onPress={() => setGamePickerVisible(true)}
              accessibilityRole='button'
            >
              <ThemedText variant='subheading'>
                {values.gameId
                  ? games.find((game) => game.id === values.gameId)?.title ?? 'Select a game'
                  : 'Select a game'}
              </ThemedText>
            </Pressable>

            <FormDateTimeField name='playedAt' label='Played on' mode='date' />
            <FormSegmentedControl
              name='context'
              label='Where did you play?'
              options={[
                { label: 'Indoor', value: 'indoor' },
                { label: 'Outdoor', value: 'outdoor' },
              ]}
            />
            <FormRatingGroup name='funRating' label='Fun rating' options={FUN_RATING_OPTIONS} />
            <FormRatingGroup name='engagementRating' label='Engagement rating' options={ENGAGEMENT_RATING_OPTIONS} />
            <FormSwitchField name='kidsAllJoined' label='All youth participated' />
            <FormTextField
              name='notes'
              label='Session notes'
              placeholder='Anything worth remembering?'
              multiline
            />

            <PrimaryButton label='Save session' onPress={handleSubmit} disabled={!isValid || isSubmitting} />

            <Modal visible={gamePickerVisible} animationType='slide'>
              <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}> 
                <ThemedText variant='heading' style={styles.modalTitle}>
                  Pick a game
                </ThemedText>
                <FlatList
                  data={games}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        setFieldValue('gameId', item.id);
                        setGamePickerVisible(false);
                      }}
                      style={[styles.modalItem, { borderColor: theme.colors.border }]}
                    >
                      <ThemedText variant='subheading'>{item.title}</ThemedText>
                      <ThemedText style={styles.modalItemMeta}>{item.theme}</ThemedText>
                    </Pressable>
                  )}
                  ListEmptyComponent={<ThemedText style={styles.modalEmpty}>No games to pick yet. Create one first.</ThemedText>}
                />
                <PrimaryButton label='Close' onPress={() => setGamePickerVisible(false)} />
              </View>
            </Modal>
          </View>
        )}
      </Formik>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  selectField: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 24,
  },
  modalTitle: {
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalItemMeta: {
    opacity: 0.7,
  },
  modalEmpty: {
    marginTop: 32,
  },
});
