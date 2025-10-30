'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-Provider';
import { PhoneNumberModal } from './phone-number-modal';
import { updatePhoneNumber } from '@/app/api/user/route';
import { usePathname } from 'next/navigation';

const DASHBOARD_ROUTES = ['/laboratory', '/dashboard', '/analytics']; // add your routes here

export function PhoneNumberChecker() {
  const { user, isAuthenticated, isLoading, fetchUser } = useAuth();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const isDashboardRoute = DASHBOARD_ROUTES.includes(pathname);

    if(!user) return;

    if (isDashboardRoute && !isLoading && isAuthenticated && user?.phoneNo === null ) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [user, isAuthenticated, isLoading, pathname]);

  const handleSave = async (phone: string) => {
    if (!user?.id) return;
    await updatePhoneNumber({ partnerId: user.id, phoneNo: phone });
    await fetchUser(); // refresh user data
  };

  return (
    <PhoneNumberModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSave={handleSave}
      title="Please provide your phone number"
    />
  );
}
