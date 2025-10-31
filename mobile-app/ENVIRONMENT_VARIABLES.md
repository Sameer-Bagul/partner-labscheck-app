# Environment Variables for LabsCheck Partner Mobile App

This document lists all environment variables used in the mobile app and their purpose.

## 📋 Complete List of Environment Variables

### Required Variables

| Variable Name | Type | Description | Example Value |
|--------------|------|-------------|---------------|
| `EXPO_PUBLIC_API_BASE_URL` | Public | Backend API base URL | `https://labscheck.com/backendapi` |
| `EXPO_PUBLIC_APP_URL` | Public | Mobile app URL | `https://partner.labscheck.com` |

### Optional Variables

| Variable Name | Type | Description | Example Value |
|--------------|------|-------------|---------------|
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Public | Google Maps API key for location features | `AIzaSy...` |
| `EXPO_PUBLIC_RAZORPAY_KEY_ID` | Public | Razorpay key for payment processing | `rzp_test_RQ8X0oYv8KbTkc` |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | Public | Google OAuth client ID for social login | `528104107190-...` |
| `EXPO_PUBLIC_APP_NAME` | Public | Application display name | `LabsCheck Partner` |
| `EXPO_PUBLIC_APP_VERSION` | Public | Application version | `1.0.0` |
| `EXPO_PUBLIC_ENVIRONMENT` | Public | Environment (development/staging/production) | `development` |

## 🔄 Mapping from Web App Variables

Here's how the web app (Next.js) variables map to mobile app (Expo) variables:

| Web App Variable (Next.js) | Mobile App Variable (Expo) | Notes |
|---------------------------|---------------------------|-------|
| `NEXT_PUBLIC_API_URL` | `EXPO_PUBLIC_API_BASE_URL` | Renamed for clarity |
| `NEXT_PUBLIC_APP_URL` | `EXPO_PUBLIC_APP_URL` | Same purpose |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Same |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `EXPO_PUBLIC_RAZORPAY_KEY_ID` | Same |
| `GOOGLE_CLIENT_ID` | `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | Now public (safe for mobile) |
| `GOOGLE_CLIENT_SECRET` | ⚠️ **NOT USED** | Secrets should never be in mobile apps |
| `NEXTAUTH_SECRET` | ⚠️ **NOT USED** | Server-side only, use JWT tokens instead |
| `NEXTAUTH_URL` | ⚠️ **NOT USED** | Not applicable for mobile OAuth flow |
| `NEXTAUTH_BASE_PATH` | ⚠️ **NOT USED** | Not applicable for mobile |

## ⚠️ Important Notes About Mobile App Security

### Why Some Variables Are Not Used:

1. **`GOOGLE_CLIENT_SECRET`**: 
   - ❌ Never include secrets in mobile apps
   - ✅ Mobile OAuth uses PKCE (Proof Key for Code Exchange) flow which doesn't require client secrets
   - ✅ The `GOOGLE_CLIENT_ID` is public and safe to include

2. **`NEXTAUTH_SECRET`**:
   - ❌ This is for server-side session encryption
   - ✅ Mobile apps use JWT tokens stored in Expo SecureStore instead
   - ✅ Token validation happens on the backend

3. **`NEXTAUTH_URL` & `NEXTAUTH_BASE_PATH`**:
   - ❌ These are Next.js specific for server-side auth routing
   - ✅ Mobile apps handle auth differently with native flows

### Security Best Practices:

- ✅ All sensitive data is stored in Expo SecureStore (encrypted)
- ✅ JWT tokens are used for authentication
- ✅ API calls are authenticated with Bearer tokens
- ✅ No secrets or private keys are embedded in the app bundle
- ✅ OAuth flows use industry-standard PKCE for mobile apps

## 🛠️ How to Use

### 1. Development Setup

Copy `.env.example` to `.env`:

```bash
cd latest-app
cp .env.example .env
```

### 2. Edit `.env` File

Add your actual values:

```bash
# Required
EXPO_PUBLIC_API_BASE_URL=https://labscheck.com/backendapi
EXPO_PUBLIC_APP_URL=https://partner.labscheck.com

# Optional (add as needed)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RQ8X0oYv8KbTkc
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Access in Code

Use the centralized config:

```typescript
import { env } from '@/config/env';

// API base URL
console.log(env.api.baseUrl);

// Google Maps API key
console.log(env.google.mapsApiKey);

// Razorpay key
console.log(env.razorpay.keyId);

// App info
console.log(env.app.name);
console.log(env.app.version);
console.log(env.app.environment);
```

### 4. Different Environments

For staging or production:

```bash
# Staging
EXPO_PUBLIC_ENVIRONMENT=staging
EXPO_PUBLIC_API_BASE_URL=https://staging-api.labscheck.com

# Production
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_API_BASE_URL=https://api.labscheck.com
```

## 📝 Configuration Files

- **`.env`** - Your local environment variables (gitignored)
- **`.env.example`** - Template for other developers
- **`config/env.ts`** - Centralized environment config with type safety
- **`lib/api-client.ts`** - Uses env config for API calls

## 🚀 Deployment Notes

When building for production:

1. Use EAS (Expo Application Services) for building
2. Set environment variables in `eas.json` or EAS Secrets
3. Never commit `.env` to version control
4. Use different values for development, staging, and production

```json
// eas.json example
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_ENVIRONMENT": "production",
        "EXPO_PUBLIC_API_BASE_URL": "https://api.labscheck.com"
      }
    }
  }
}
```

## ❓ FAQ

**Q: Why the EXPO_PUBLIC_ prefix?**  
A: Expo requires this prefix for variables that should be accessible in the app code. Variables without this prefix are only available at build time.

**Q: Can I use the same Google OAuth client ID as the web app?**  
A: You can, but it's recommended to create a separate OAuth client for mobile apps with the appropriate redirect URIs configured.

**Q: Where are the secrets stored?**  
A: API keys that need to be in the app use the `EXPO_PUBLIC_` prefix. User authentication tokens are stored securely in Expo SecureStore (encrypted). Backend secrets should never be in the mobile app.

**Q: How do I change the API URL for testing?**  
A: Just update `EXPO_PUBLIC_API_BASE_URL` in your `.env` file and restart the Expo dev server.
