import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedText } from '../../components/ThemedText';

type Props = DrawerScreenProps<RootDrawerParamList, 'Help'>;

export const HelpScreen: React.FC<Props> = () => {
  return (
    <ScreenContainer scrollable>
      <View style={styles.section}>
        <ThemedText variant="heading">About & Help</ThemedText>
        <ThemedText>
          SparkUp helpt jeugdleiders om spelmomenten te plannen, terug te vinden en te verbeteren. Je vindt inspiratie
          in de Discover-tab, bewaart favorieten en logt sessies zodat je later ziet wat werkte.
        </ThemedText>
      </View>
      <View style={styles.section}>
        <ThemedText variant="subheading">Wat kun je doen?</ThemedText>
        <ThemedText>Ontdek nieuwe spellen met filters op thema en doelgroep.</ThemedText>
        <ThemedText>Sla favoriete spellen op om snel terug te vinden.</ThemedText>
        <ThemedText>Log sessies met datum, context en ratings om voortgang te volgen.</ThemedText>
        <ThemedText>Beheer je eigen spellen in het profiel.</ThemedText>
      </View>
      <View style={styles.section}>
        <ThemedText variant="subheading">Hoe werkt het?</ThemedText>
        <ThemedText>
          Discover toont spellen die je kunt openen voor details. Met de favorietenknop zet je een spel op je lijst. In
          Log kies je een spel, datum en sfeer van het moment; de app bewaart dit in je logboek zodat je later kan
          terugkijken.
        </ThemedText>
        <ThemedText>
          In je profiel kan je thema-instellingen wijzigen en eigen spellen toevoegen of aanpassen.
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
});
