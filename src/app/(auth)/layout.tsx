'use client';

import SiteHeader from '@/components/layout/header/site-header';

interface AuthLayoutProps {
  readonly children: React.ReactNode;
}

export default function AuthPagesLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <SiteHeader />
      <div className="page-bg-light no-overflow-x">
        {children}
      </div>
    </>
  );
}


