'use client';

import isAuth from '@/components/auth/isAuth';
import { Spinner } from '@/components/ui/spinner';
import { Suspense } from 'react';

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className='w-full h-screen flex justify-center items-center'>
          <Spinner />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

// export default ProfileLayout;
export default isAuth(ProfileLayout);