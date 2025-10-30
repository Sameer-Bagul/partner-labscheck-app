'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import { Footer } from '../footer/adminFooter';

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminPanelLayout({ children }: AdminLayoutProps) {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;

  const { getOpenState, settings } = sidebar;

  return (
    <div className='min-h-screen bg-gradient-to-br from-violet-50/40 via-purple-50/30 to-white'>
      <Sidebar />
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300 ease-in-out',
          'lg:ml-20',
          getOpenState() && !settings.disabled && 'lg:ml-64',
        )}
      >
        <div className="h-full">
          {children}
        </div>
      </main>
      <footer
        className={cn(
          'transition-all duration-300 ease-in-out',
          'lg:ml-20',
          getOpenState() && !settings.disabled && 'lg:ml-64',
        )}
      >
        <Footer />
      </footer>
    </div>
  );
}
