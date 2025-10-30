import { Spinner } from '@/components/ui/spinner';

import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sign In to LabsCheck - Access Affordable Labs Tests',
  description: 'Sign in to LabsCheck to book affordable medical labs tests, compare prices, and find nearby labs with trusted ratings.',
  keywords: [
    'LabsCheck login',
    'sign in LabsCheck',
    'book labs tests login',
    'access medical labs',
    'affordable labs tests sign in',
  ],
  robots: 'noindex, nofollow', // Prevent indexing
  alternates: {
    canonical: 'https://www.labscheck.com/signin',
  },

};


export default function SignInLayout({ children }: { children: React.ReactNode }) {
    return <Suspense fallback={<div className="w-full h-screen flex justify-center items-center"><Spinner /></div>}>{children}</Suspense>;
  }