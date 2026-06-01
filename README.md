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

## Notes

- The `src/services/api.js` file points to a local backend at `http://localhost:4000/api`. Update this when deploying the backend.
- `app.json` contains app configuration and Expo metadata.
