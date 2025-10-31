import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { QueryProvider } from '@/providers/query-provider';
import { useAuthStore } from '@/store/auth';

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inDashboard = segments[0] === '(dashboard)';

    if (!isAuthenticated && inDashboard) {
      router.replace('/');
    } else if (isAuthenticated && !inAuthGroup && !inDashboard) {
      router.replace('/(dashboard)/home');
    }
  }, [isAuthenticated, isLoading, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <QueryProvider>
      <NavigationGuard>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(dashboard)" />
        </Stack>
        <StatusBar style="auto" />
      </NavigationGuard>
    </QueryProvider>
  );
}
