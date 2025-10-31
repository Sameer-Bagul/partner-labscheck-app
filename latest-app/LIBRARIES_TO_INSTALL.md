# Libraries to Install Before Running the LabsCheck Mobile App

## Installation Command

Run this command in the `latest-app` directory:

```bash
npm install axios zustand expo-secure-store @tanstack/react-query nativewind tailwindcss react-hook-form @hookform/resolvers zod clsx expo-image
```

## Additional Dev Dependencies

```bash
npm install --save-dev @types/react react-native-worklets
```

## Required Libraries Breakdown:

### Core Dependencies:
- **axios** - HTTP client for API calls
- **zustand** - Lightweight state management
- **expo-secure-store** - Secure token storage
- **@tanstack/react-query** - Server state management & data fetching
- **nativewind** - Tailwind CSS for React Native
- **tailwindcss** - CSS framework
- **react-hook-form** - Form validation
- **@hookform/resolvers** - Zod resolver for react-hook-form
- **zod** - Schema validation
- **clsx** - Conditional classnames utility
- **expo-image** - Optimized image component

### Dev Dependencies:
- **@types/react** - TypeScript types for React
- **react-native-worklets** - Required for NativeWind

## Post-Installation Setup:

1. After installing, run: `npx expo start`
2. Scan QR code with Expo Go app on your phone
3. Or press `i` for iOS simulator, `a` for Android emulator

## Notes:
- All libraries use the latest stable versions
- Config files (tailwind.config.js, babel.config.js, etc.) are pre-configured
- Compatible with Expo SDK ~54.0
