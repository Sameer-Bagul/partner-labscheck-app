'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useAuth } from '@/providers/auth-Provider';

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const { setupOAuthSession } = useAuth();
  const [message, setMessage] = useState('Setting up your session...');

  useEffect(() => {
    const handle = async () => {
      const redirectUrl = searchParams.get('redirectUrl') || '/';

      if (status === 'loading') return;

      if (status === 'authenticated' && session?.user?.id_token) {
        const success = await setupOAuthSession();

        if (success) {
          setMessage('Login successful. Redirecting...');
          window.location.replace(redirectUrl); // ✅ reloads full app
        } else {
          await signOut({ redirect: false });
          window.location.replace('/signin?error=oauth_failed');
        }
      } else {
        setMessage('Session missing. Redirecting...');
        window.location.replace('/signin?error=session_invalid');
      }
    };

    handle();
  }, [status, session, searchParams, setupOAuthSession]);

  return (
    <div className="flex items-center justify-center h-screen text-gray-700 text-lg">
      {message}
    </div>
  );
}
