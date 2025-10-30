'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import API from '@/lib/axios-client';
import { User } from '@/types/auth';
import { checkUserAuth } from '@/app/api/auth/route';
import { log } from 'console';

interface OAuthPartner {
  id: number;
  name: string;
  email: string;
  user_type: string;
}

interface OAuthResponse {
  needs_phone: boolean;
  partner: OAuthPartner;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchUser: () => Promise<User | null>;
  setupOAuthSession: () => Promise<OAuthResponse | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  fetchUser: async () => null,
  setupOAuthSession: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';

  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasValidatedRef = useRef(false);

  // Exchange Google id_token with backend
  const setupOAuthSession = useCallback(async () => {
    if (!session?.user?.id_token) {
      return null;
    }
    try {
      const res = await API.post(
        '/auth/Oauth_login',
        { id_token: session.user.id_token, provider: 'google', role: "partner" },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error('[AuthProvider] OAuth login failed:', err);
      await signOut({ callbackUrl: '/signin?error=google_login_failed' });
      return null;
    }
  }, [session]);

  // Fetch user data from backend
  const fetchUser = useCallback(async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      const res = await checkUserAuth();
      if (res.isAuthenticated && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      // ✅ Log user info here
      console.log('[AuthProvider] Authenticated user:', res.user);
        return res.user;
      }
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } catch (err) {
      console.error('[AuthProvider] Fetch user failed:', err);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial session validation
  useEffect(() => {
    // Log callbackUrl only when effect runs
    console.log('AuthProvider: callbackUrl:', callbackUrl);
    let isMounted = true;
    if (hasValidatedRef.current) return;
    const validate = async () => {
      if (!isMounted) return;
      if (status === 'loading') return;
      // Handle OAuth for authenticated sessions
      if (status === 'authenticated' && session?.user?.id_token) {
        const oauthSuccess = await setupOAuthSession();
        if (!oauthSuccess || !isMounted) {
          hasValidatedRef.current = true;
          return;
        }
      }
      // Fetch user data
      const fetchedUser = await fetchUser();
      if (!isMounted) return;
      hasValidatedRef.current = true;
      // Redirect if necessary
      if (fetchedUser && pathname === '/signin') {
        router.push('/laboratory');
      }
    };
    validate();
    return () => {
      isMounted = false;
    };
  }, [status, session, fetchUser]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, fetchUser, setupOAuthSession }}>
      {children}
    </AuthContext.Provider>
  );
}