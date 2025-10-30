import { Spinner } from '@/components/ui/spinner';

import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {

  title: 'Sign Up for LabsCheck - Book Affordable Labs Tests',
  description: 'Sign up for LabsCheck to start booking affordable medical labs tests, comparing prices, and finding nearby labs with trusted ratings.',
  keywords: [
    'LabsCheck sign up',
    'create LabsCheck account',
    'join LabsCheck',
    'book labs tests sign up',
    'affordable labs tests sign up',
    'medical labs registration',
  ],
  robots: 'noindex, nofollow', // Prevent indexing
  alternates: {
    canonical: 'https://www.labscheck.com/signup',
  },
};



export default function SignUpLayout({ children }: { children: React.ReactNode }) {
    return <Suspense fallback={<div className="w-full h-screen flex justify-center items-center"><Spinner /></div>}>{children}</Suspense>;
  }