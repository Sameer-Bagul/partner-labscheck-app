# LabsCheck Mobile App

React Native mobile application for LabsCheck Partner Portal built with Expo.

## Tech Stack

- **Framework**: Expo SDK 52 with React Native 0.76
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: 
  - Zustand (client state)
  - TanStack Query (server state)
- **Forms**: React Hook Form + Zod
- **API Client**: Axios
- **Secure Storage**: Expo Secure Store
- **Maps**: React Native Maps
- **Charts**: Victory Native
- **Payments**: Razorpay React Native SDK

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Configuration

Create a `.env` file in the mobile directory:

```bash
# For local Next.js backend on Replit
EXPO_PUBLIC_API_URL=https://your-replit-url.repl.co/api

# Or for production backend
EXPO_PUBLIC_API_URL=https://labscheck.com/backendapi
```

### Installation

```bash
cd mobile
npm install
```

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Project Structure

```
mobile/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (dashboard)/       # Dashboard screens
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home/landing screen
├── components/            # Reusable components
│   └── ui/               # UI components
├── config/               # Configuration files
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API client
├── screens/              # Screen components
├── store/                # Zustand stores
├── types/                # TypeScript types
└── validations/          # Zod validation schemas
```

## Features

- ✅ Authentication (Sign In, Sign Up, Password Reset)
- ✅ Laboratory Management (CRUD)
- ✅ Test & Package Management
- ✅ Bookings Management
- ✅ Analytics Dashboard
- ✅ User Profile
- ✅ Subscription & Payments
- ✅ Google Maps Integration
- ✅ Invoice Generation & Sharing
- ✅ Dark Mode Support

## API Integration

The mobile app connects to the Next.js backend API running at:
`https://labscheck.com/backendapi`

All API requests are authenticated using JWT tokens stored securely with Expo Secure Store.

## Design System

The app uses the same purple gradient design system as the web version:
- Primary: Purple gradient (#7B2CBF to #3C096C)
- Accent: Medical green (#16A34A)
- All brand colors from the web version are preserved

## Development Notes

- Uses Expo Router for file-based navigation
- NativeWind provides Tailwind-like styling
- Automatic token refresh on 401 responses
- Secure credential storage with Expo Secure Store
