# Fleet Management Mobile

This repository contains the Expo-managed React Native mobile app for Fleet Management.

## About

- Expo SDK: 54.0.0
- Android: EAS build configured in `eas.json`
- iOS: Requires Apple Developer Program enrollment to build via EAS

## Setup

```powershell
cd C:\Users\Lyson\bulp-fleet-manager\mobile
npm install
```

## Run locally

```powershell
npx expo start
```

## Build Android

```powershell
Set-Item Env:EAS_SKIP_AUTO_FINGERPRINT '1'
cd C:\Users\Lyson\bulp-fleet-manager\mobile
eas build --platform android --profile preview --clear-cache
```

## Build iOS

Requires a paid Apple Developer Program account and Apple credentials configured in EAS.

```powershell
Set-Item Env:EAS_SKIP_AUTO_FINGERPRINT '1'
cd C:\Users\Lyson\bulp-fleet-manager\mobile
eas build --platform ios --profile preview --clear-cache
```

## Expo app settings

The Expo configuration lives in `app.json`.

- `expo.name`: Bulp Fleet Manager
- `expo.slug`: bulp-fleet-manager-mobile
- `expo.version`: 1.0.0
- `expo.ios.bundleIdentifier`: com.yango.bulpfleetmanager
- `expo.android.package`: com.yango.bulpfleetmanager
- `expo.extra.apiBaseUrl`: `http://localhost:4000/api` (used by the app)
- `expo.ios.infoPlist.ITSAppUsesNonExemptEncryption`: false

If you change package names or app IDs, update both `app.json` and any EAS build settings.

## Backend configuration

The app uses `src/services/api.js` to call the backend.

- `API_BASE_URL` is currently set to `http://localhost:4000/api`.
- `ADMIN_TOKEN` is currently set to `changeme`.

To use a deployed backend, update both values in `src/services/api.js`, or switch to environment-based config if you want different URLs for development and production.

### Local backend

Ensure your backend is running at the URL configured in `src/services/api.js` before starting the app.

### Deploying backend

Update `API_BASE_URL` to the live backend URL and set a secure `ADMIN_TOKEN` before pushing to production.

## Notes

- `app.json` contains the Expo app configuration used by both `expo` and EAS.
- `README.md` is the main documentation for this repository.
