# 📋 Environment Variables - Quick Reference

## New Mobile App Variables (Expo)

All variables for the mobile app use the `EXPO_PUBLIC_` prefix for public variables.

### ✅ Complete List

```bash
# Required
EXPO_PUBLIC_API_BASE_URL=https://labscheck.com/backendapi
EXPO_PUBLIC_APP_URL=https://partner.labscheck.com

# Optional
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RQ8X0oYv8KbTkc
EXPO_PUBLIC_GOOGLE_CLIENT_ID=528104107190-l0l2ci8r8uoeimitt699ob7prj345jf2.apps.googleusercontent.com

# App Info
EXPO_PUBLIC_APP_NAME=LabsCheck Partner
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_ENVIRONMENT=development
```

## 🔄 Web vs Mobile Variable Names

| Purpose | Web App (Next.js) | Mobile App (Expo) | Status |
|---------|------------------|-------------------|--------|
| API URL | `NEXT_PUBLIC_API_URL` | `EXPO_PUBLIC_API_BASE_URL` | ✅ Renamed |
| App URL | `NEXT_PUBLIC_APP_URL` | `EXPO_PUBLIC_APP_URL` | ✅ Same |
| Google Maps Key | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ Same |
| Razorpay Key | `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `EXPO_PUBLIC_RAZORPAY_KEY_ID` | ✅ Same |
| Google Client ID | `GOOGLE_CLIENT_ID` | `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | ✅ Now public |
| Google Client Secret | `GOOGLE_CLIENT_SECRET` | ❌ **NOT USED** | Mobile uses PKCE |
| NextAuth Secret | `NEXTAUTH_SECRET` | ❌ **NOT USED** | Mobile uses JWT |
| NextAuth URL | `NEXTAUTH_URL` | ❌ **NOT USED** | Not applicable |
| NextAuth Base Path | `NEXTAUTH_BASE_PATH` | ❌ **NOT USED** | Not applicable |

## ⚡ Quick Setup

1. Copy the environment file:
```bash
cd latest-app
cp .env.example .env
```

2. Edit `.env` with your values (already configured with defaults)

3. Access in code:
```typescript
import { env } from '@/config/env';

// Use typed, validated config
console.log(env.api.baseUrl);
console.log(env.google.mapsApiKey);
console.log(env.razorpay.keyId);
```

## 📁 Files Updated

- ✅ `latest-app/.env` - Your environment variables
- ✅ `latest-app/.env.example` - Template for others
- ✅ `latest-app/config/env.ts` - Centralized config with type safety
- ✅ `latest-app/lib/api-client.ts` - Updated to use new config
- ✅ `latest-app/.gitignore` - Ensures .env is not committed

## 🔒 Security Notes

**Why no secrets in mobile apps?**
- Mobile app bundles can be reverse-engineered
- Use public API keys only (with backend validation)
- OAuth uses PKCE flow (no client secret needed)
- Sensitive operations happen on the backend
- User tokens stored in encrypted SecureStore

For full details, see `ENVIRONMENT_VARIABLES.md`
