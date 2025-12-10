import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';

type Props = DrawerScreenProps<RootDrawerParamList, 'Help'>;

const outstandingItems = [
  {
    title: 'Firebase-authenticatie afronden',
    description:
      'Verwijder de hard-coded gebruiker in de auth-slice en laat de app pas na een Firebase-listener overschakelen naar de tabs, zodat niet-ingelogde leiders de Welcome/Login/Forgot Password-flow zien. Koppel de register- en login-acties volledig aan Firebase (incl. profieldocument).',
  },
  {
    title: 'Filters in Discover uitbreiden',
    description:
      'Voeg UI-elementen toe voor thema, leeftijdsrange en duur zodat alle velden uit filtersSlice bruikbaar zijn en de game-query daarop reageert. De filterwaarden moeten opgeslagen blijven via redux-persist.',
  },
  {
    title: 'Taalinstellingen + i18n',
    description:
      'Exposeer de language-setting (settingsSlice.language) in het profiel of instellingenpaneel en sluit react-i18next aan zodat labels/knoppen vertaald kunnen worden.',
  },
  {
    title: 'Account-optie in het zijmenu',
    description:
      'Het ontwerp verwacht een expliciete "Account"-entry in de drawer die naar het profiel en de sign-out actie leidt, naast My Logs en About/Help.',
  },
  {
    title: 'Tijdselectie bij sessies',
    description:
      'De logboek-flow bewaart nu enkel een datum voor playedAt. Voeg een tijdpicker (of aparte velden) toe zodat datum en tijd geregistreerd worden voordat de sessie naar Firestore gaat.',
  },
];

export const HelpScreen: React.FC<Props> = () => {
  return (
    <ScreenContainer scrollable>
      <View style={styles.section}>
        <ThemedText variant="heading">Help & info</ThemedText>
        <ThemedText>
          SparkUp is een compagnon voor leiders om spellen te ontdekken, te loggen en favorieten te bewaren. Neem bij
          bugs of feedback contact op met je groepsverantwoordelijke.
        </ThemedText>
      </View>
      <View style={styles.section}>
        <ThemedText variant="subheading">Snelle tips</ThemedText>
        <ThemedText>- Swipe vanaf de linker rand om dit paneel te openen.</ThemedText>
        <ThemedText>- Profieltap "Profile" bevat thema-instellingen en de game-editor.</ThemedText>
        <ThemedText>- Noteer bij elke sessie wat wel/niet werkte voor future you.</ThemedText>
      </View>
      <View style={styles.section}>
        <ThemedText variant="subheading">Nog te voltooien voor release</ThemedText>
        <View style={styles.taskList}>
          {outstandingItems.map((item) => (
            <View style={styles.taskCard} key={item.title}>
              <ThemedText variant="subheading" style={styles.taskTitle}>
                {item.title}
              </ThemedText>
              <ThemedText>{item.description}</ThemedText>
            </View>
          ))}
        </View>
        <ThemedText style={styles.todoNote}>
          TODO: Firestore security rules moeten nog aangescherpt worden zodat elke gebruiker enkel eigen data kan lezen
          of schrijven.
        </ThemedText>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    gap: 8,
  },
  taskList: {
    gap: 12,
    marginTop: 8,
  },
  taskCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  taskTitle: {
    marginBottom: 4,
  },
  todoNote: {
    marginTop: 12,
    fontStyle: 'italic',
  },
});
