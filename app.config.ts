import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

const readEnv = (expoKey: string, legacyKey: string) =>
  process.env[expoKey] ?? process.env[legacyKey] ?? '';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'SparkUp',
  slug: 'sparkup',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#2563EB',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.APP_BUNDLE_IDENTIFIER ?? 'com.sparkup.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#2563EB',
    },
    package: process.env.APP_PACKAGE ?? 'com.sparkup.app',
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  extra: {
    firebase: {
      apiKey: readEnv('EXPO_PUBLIC_FIREBASE_API_KEY', 'FIREBASE_API_KEY'),
      authDomain: readEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 'FIREBASE_AUTH_DOMAIN'),
      projectId: readEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID'),
      storageBucket: readEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', 'FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: readEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_MESSAGING_SENDER'),
      appId: readEnv('EXPO_PUBLIC_FIREBASE_APP_ID', 'FIREBASE_APP_ID'),
    },
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? '',
    },
  },
  plugins: [
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow SparkUp to access your photos to attach cover images to games.',
        cameraPermission: 'Allow SparkUp to access the camera to capture cover photos.',
      },
    ],
  ],
});
