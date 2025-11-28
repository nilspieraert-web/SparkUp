import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from '@expo-google-fonts/urbanist';
import { store, persistor } from './src/store';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { setUiHydrated } from './src/features/ui/uiSlice';

const queryClient = new QueryClient();

const Root: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });

  React.useEffect(() => {
    if (!fontsLoaded) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { Text, TextInput } = require('react-native') as { Text: any; TextInput: any };

    if (Text.defaultProps == null) {
      Text.defaultProps = {};
    }
    Text.defaultProps.style = {
      ...(Text.defaultProps.style ?? {}),
      fontFamily: 'Urbanist_400Regular',
    };

    if (TextInput?.defaultProps == null) {
      TextInput.defaultProps = {};
    }
    TextInput.defaultProps.style = {
      ...(TextInput.defaultProps.style ?? {}),
      fontFamily: 'Urbanist_400Regular',
    };
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.fontLoading}>
        <ActivityIndicator />
      </View>
    );
  }

  return <AppNavigator />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => {
          store.dispatch(setUiHydrated(true));
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Root />
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  fontLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
