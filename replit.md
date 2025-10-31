# LabsCheck Partner Portal - Mobile App Project

## Project Overview

This project contains both the **Next.js backend API** and the **React Native mobile app** for the LabsCheck Partner Portal. The architecture follows Plan A: keeping the Next.js application as a headless API service while building a mobile app that consumes those APIs.

## Project Structure

```
.
├── latest-app/            # NEW React Native mobile app (Expo) ⭐
│   ├── app/              # Expo Router pages
│   │   ├── (dashboard)/ # Dashboard screens (home, labs, bookings, etc.)
│   │   ├── auth/        # Authentication screens
│   │   ├── _layout.tsx  # Root layout with auth guards
│   │   └── index.tsx    # Landing screen
│   ├── components/      # Reusable UI components
│   │   └── ui/         # Button, Input, Card, etc.
│   ├── lib/            # API client & utilities
│   ├── store/          # Zustand state management
│   ├── hooks/          # React Query hooks for data fetching
│   ├── config/         # Environment configuration
│   ├── validations/    # Zod schemas
│   ├── .env           # Environment variables
│   └── package.json   # Mobile app dependencies
│
├── mobile/              # OLD mobile app (archived)
│
├── src/                 # Next.js backend API
│   ├── app/            # Next.js app router
│   │   ├── api/       # API routes
│   │   ├── (auth)/    # Auth pages (web)
│   │   └── (dashboard)/ # Dashboard pages (web)
│   ├── components/     # React components
│   ├── lib/            # Utilities
│   └── hooks/          # Custom hooks
│
└── package.json        # Backend dependencies
```

## Technology Stack

### Next.js Backend (Port 5000)
- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js (Google OAuth, Credentials)
- **API Client**: Axios
- **Styling**: Tailwind CSS with purple gradient design
- **Database Integration**: External API at https://labscheck.com/backendapi
- **Payments**: Razorpay
- **Maps**: Google Maps API
- **PDF Generation**: @react-pdf/renderer, pdfkit

### React Native Mobile App
- **Framework**: Expo SDK 52 with React Native 0.76
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind for React Native)
- **State Management**: 
  - Zustand (client state)
  - TanStack Query (server state)
- **Forms**: React Hook Form + Zod validation
- **API Communication**: Axios with JWT token management
- **Secure Storage**: Expo Secure Store
- **Maps**: React Native Maps
- **Charts**: Victory Native
- **Icons**: Expo Vector Icons

## Getting Started

### Backend (Next.js)

The backend is currently running on port 5000 and serves as the API for the mobile app.

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# The server runs on http://0.0.0.0:5000
```

**Required Environment Variables:**
- `NEXT_PUBLIC_API_URL` - External backend API URL (https://labscheck.com/backendapi)
- `NEXT_PUBLIC_APP_URL` - This app's URL
- `NEXTAUTH_SECRET` - Auth secret key
- `NEXTAUTH_URL` - Auth callback URL
- `NEXTAUTH_BASE_PATH` - Auth base path (/api/auth)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay key for payments

### Mobile App (React Native)

To run the mobile app, you'll need to install dependencies and start the Expo development server:

```bash
cd mobile

# Install dependencies
npm install

# Start Expo
npm start

# Run on specific platform
npm run ios      # iOS Simulator (Mac only)
npm run android  # Android Emulator
npm run web      # Web browser
```

**Environment Configuration**:
The mobile app uses centralized environment configuration. See `latest-app/ENV_VARIABLES_SUMMARY.md` for complete details.

Required variables in `latest-app/.env`:
```bash
EXPO_PUBLIC_API_BASE_URL=https://labscheck.com/backendapi
EXPO_PUBLIC_APP_URL=https://partner.labscheck.com
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RQ8X0oYv8KbTkc
EXPO_PUBLIC_GOOGLE_CLIENT_ID=528104107190-l0l2ci8r8uoeimitt699ob7prj345jf2.apps.googleusercontent.com
```

Note: Mobile apps use different variables than the Next.js web app. See variable mapping in `ENV_VARIABLES_SUMMARY.md`.

## Architecture & Design Decisions

### API Communication
- **Mobile → Backend**: The mobile app uses Axios to make HTTP requests to the Next.js backend API
- **Authentication**: JWT tokens stored securely in Expo Secure Store
- **Token Refresh**: Automatic token refresh on 401 responses
- **CORS**: Configured in next.config.ts to allow mobile app requests

### Authentication Flow
1. User signs in via mobile app
2. Credentials sent to backend API (`/auth/signin`)
3. Backend validates and returns JWT token
4. Token stored in Expo Secure Store
5. All subsequent requests include token in Authorization header
6. Automatic refresh on token expiration

### Design System
Both web and mobile apps share the same purple gradient design system:
- **Primary Colors**: Purple gradient (#7B2CBF to #3C096C)
- **Accent**: Medical green (#16A34A)
- **Typography**: Clean, modern fonts
- **Components**: Consistent UI across platforms

## Mobile App Features

### Completed Features
✅ **Authentication System**
- Sign In screen with email/password
- Sign Up screen with form validation
- Forgot Password flow
- Secure token storage
- Automatic authentication state management

✅ **Dashboard Navigation**
- Tab-based navigation (Home, Labs, Bookings, Profile)
- Purple gradient headers matching web design
- Smooth transitions and animations

✅ **Core Screens**
- Landing/Welcome screen
- Dashboard home with quick stats
- Laboratories listing
- Bookings management
- User profile with logout

✅ **UI Components**
- Custom Button component (default, outline, ghost variants)
- Custom Input component with labels and error states
- Consistent styling with NativeWind
- Loading states and activity indicators

### Pending Features
🔄 **Laboratory Management**
- Full CRUD operations for labs
- Location search with Google Maps
- Photo uploads
- Operating hours management

🔄 **Test & Package Management**
- Browse available tests
- Create custom test packages
- Pricing management
- Test categories

🔄 **Advanced Bookings**
- Detailed booking information
- Status updates
- Calendar integration
- Notifications

🔄 **Analytics Dashboard**
- Revenue charts (Victory Native)
- Booking trends
- Popular tests
- Regional performance

🔄 **Payments Integration**
- Razorpay React Native SDK
- Subscription management
- Invoice generation and sharing
- Payment history

🔄 **Enhanced Features**
- Push notifications
- Offline support
- Biometric authentication
- Photo/document uploads

## Development Workflow

### For Backend Changes
1. Edit files in `src/`
2. Hot reload automatically updates
3. Test API endpoints
4. Restart workflow if needed: workflow will auto-restart

### For Mobile App Changes
1. Navigate to `mobile/` directory
2. Edit files in `app/`, `components/`, etc.
3. Expo automatically reloads changes
4. Test on iOS Simulator/Android Emulator or web

### Testing Mobile App
```bash
cd mobile

# Test on different platforms
npm run ios      # Requires Mac + Xcode
npm run android  # Requires Android Studio
npm run web      # Works on any platform
```

## Mobile App File-Based Routing

Expo Router uses file-based routing similar to Next.js:

```
app/
├── index.tsx              → / (landing page)
├── _layout.tsx           → Root layout
├── (auth)/
│   ├── _layout.tsx       → Auth layout
│   ├── signin.tsx        → /auth/signin
│   ├── signup.tsx        → /auth/signup
│   └── forgot-password.tsx → /auth/forgot-password
└── (dashboard)/
    ├── _layout.tsx       → Dashboard tab layout
    ├── home.tsx          → /(dashboard)/home
    ├── labs.tsx          → /(dashboard)/labs
    ├── bookings.tsx      → /(dashboard)/bookings
    └── profile.tsx       → /(dashboard)/profile
```

## API Endpoints Used by Mobile App

The mobile app consumes these API endpoints from the backend:

### Authentication
- `POST /auth/signin` - User login
- `POST /auth/signup` - User registration
- `POST /auth/forgot-password` - Password reset
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Get current user

### Laboratories
- `GET /api/labs` - List all labs
- `GET /api/labs/:id` - Get lab details
- `POST /api/labs` - Create new lab
- `PUT /api/labs/:id` - Update lab
- `DELETE /api/labs/:id` - Delete lab

### Tests & Packages
- `GET /api/tests` - List tests
- `GET /api/packages` - List packages
- `POST /api/packages` - Create package

### Bookings
- `GET /api/bookings` - List bookings
- `GET /api/bookings/:id` - Get booking details

### Payments
- `POST /api/subscribe` - Create subscription
- `GET /api/invoices/download/:invoice_no` - Download invoice

## Security Considerations

✅ **Implemented Security Measures**
- JWT token-based authentication
- Secure credential storage (Expo Secure Store)
- Automatic token refresh
- CORS configuration for API access
- Input validation with Zod schemas
- Form validation with React Hook Form

🔄 **Recommended Additional Security**
- API rate limiting
- Request throttling
- Certificate pinning for production
- Biometric authentication option
- Session timeout configuration

## Next Steps

### Immediate Tasks
1. Install mobile app dependencies: `cd mobile && npm install`
2. Test authentication flow on mobile
3. Implement laboratory CRUD operations
4. Add Google Maps integration for location search
5. Implement test and package management screens
6. Add analytics dashboard with Victory Native charts
7. Integrate Razorpay for payments
8. Add invoice viewing and sharing

### Future Enhancements
- Push notifications (Expo Notifications)
- Offline mode with local database
- Camera integration for document scanning
- QR code scanning for bookings
- Dark mode toggle
- Multi-language support
- Biometric authentication
- App Store & Google Play deployment

## Troubleshooting

### Backend Issues
- **Port 5000 not accessible**: Check if workflow is running
- **API errors**: Verify environment variables are set
- **CORS errors**: Ensure next.config.ts has proper CORS headers

### Mobile App Issues
- **Dependencies not installed**: Run `npm install` in mobile directory
- **Expo won't start**: Clear cache with `expo start -c`
- **Module not found**: Ensure all imports use correct paths with `@/` alias
- **Styling not working**: Check that global.css is imported in _layout.tsx

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Next.js Documentation](https://nextjs.org/docs)

## Project Status

**Current Phase**: Foundation & Authentication Complete ✅

**Next.js Backend**: ✅ Running on port 5000
**Mobile App Structure**: ✅ Created with Expo Router
**Authentication**: ✅ Sign In, Sign Up, Forgot Password screens
**Navigation**: ✅ Tab navigation setup
**Basic Screens**: ✅ Home, Labs, Bookings, Profile

**Next Phase**: Implement core laboratory management features and integrate with backend APIs.
