import { Spinner } from '@/components/ui/spinner';

import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Forgot Password - LabsCheck',
  description: 'Reset your LabsCheck password to regain access to booking affordable medical labs tests and finding nearby labs with trusted ratings.',
  keywords: [
    'LabsCheck forgot password',
    'reset LabsCheck password',
    'recover LabsCheck account',
    'password reset labs tests',
    'LabsCheck account recovery',
  ],
  robots: 'noindex, nofollow', // Prevent indexing
  alternates: {
    canonical: 'https://www.labscheck.com/forgotpassword',
  },
};


export default function ForgetPasswordLayout({ children }: { children: React.ReactNode }) {
    return <Suspense fallback={<div className="w-full h-screen flex justify-center items-center"><Spinner /></div>}>{children}</Suspense>;
  }