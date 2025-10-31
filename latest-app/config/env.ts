/**
 * Environment Configuration
 * Centralized environment variables for the mobile app
 */

interface EnvConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    name: string;
    version: string;
    url: string;
    environment: 'development' | 'staging' | 'production';
  };
  google: {
    mapsApiKey: string;
    clientId: string;
  };
  razorpay: {
    keyId: string;
  };
}

const requiredEnvVars = [
  'EXPO_PUBLIC_API_BASE_URL',
  'EXPO_PUBLIC_APP_URL',
] as const;

function validateEnv() {
  const missing = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missing.length > 0) {
    console.warn(
      `Warning: Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

validateEnv();

export const env: EnvConfig = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://labscheck.com/backendapi',
    timeout: 30000,
  },
  app: {
    name: process.env.EXPO_PUBLIC_APP_NAME || 'LabsCheck Partner',
    version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
    url: process.env.EXPO_PUBLIC_APP_URL || 'https://partner.labscheck.com',
    environment: (process.env.EXPO_PUBLIC_ENVIRONMENT as any) || 'development',
  },
  google: {
    mapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  },
  razorpay: {
    keyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || '',
  },
};

export const isDevelopment = env.app.environment === 'development';
export const isProduction = env.app.environment === 'production';
export const isStaging = env.app.environment === 'staging';

export default env;
