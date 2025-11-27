# SparkUp

A youth movement game logger built with Expo (managed workflow) and TypeScript. Leaders can discover games, log sessions, and track favorites with Firebase-backed persistence.

## Requirements

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase project (Authentication + Firestore)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment template and populate Firebase credentials:
   ```bash
   cp .env.example .env
   ```
3. Update `app.config.ts` if you need custom bundle identifiers.
4. Start the Expo development server:
   ```bash
   npm run start
   ```
5. Open the app in Expo Go or an emulator.

## Firebase Setup

- Enable Email/Password authentication in Firebase Auth.
- Create Firestore database in native mode.
- TODO: add Firestore security rules to restrict data access to the authenticated user.

Environment variables used (see `.env.example`):

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER`
- `FIREBASE_APP_ID`
- `APP_BUNDLE_IDENTIFIER`
- `APP_PACKAGE`
- `EAS_PROJECT_ID`

## Project Structure

```
assets/
  fonts/
  images/
src/
  components/
  contexts/
  features/
  hooks/
  navigation/
  screens/
  services/
  store/
  types/
  utils/
App.tsx
```

## Key Libraries

- Expo 54 (managed workflow)
- React Navigation (bottom tabs + drawer + native stacks)
- Redux Toolkit + redux-persist
- Formik + Yup for form management
- Firebase Auth & Firestore
- @tanstack/react-query for server-state caching

## Scripts

- `npm run start` – start Expo
- `npm run lint` – run ESLint
- `npm run typecheck` – run TypeScript

## Native Features

- Uses `expo-image-picker` for choosing cover photos when creating games.
- Shares persisted font setup via `@expo-google-fonts/urbanist`.

## Testing & Verification

Before shipping changes, run:

```
npm run lint
npm run typecheck
```

Add platform-specific testing (iOS/Android) for navigation and Firebase flows once keys are configured.
