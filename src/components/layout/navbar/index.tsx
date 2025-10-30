'use client';

import { SheetMenu } from '@/components/layout/sidebar/sheet-menu';
import { UserNav } from './user-nav';
import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const sidebar = useStore(useSidebar, (x) => x);
  const sidebarOpen = sidebar?.getOpenState() ?? false;
  const sidebarDisabled = sidebar?.settings.disabled ?? false;

  return (
    <header 
      className={cn(
        'fixed top-0 right-0 h-16 bg-white border-b border-purple-100 shadow-sm transition-all duration-300 ease-in-out z-40',
        'left-0 lg:left-20',
        sidebarOpen && !sidebarDisabled && 'lg:left-64'
      )}
    >
      <div className='h-full px-4 sm:px-6 lg:px-8 flex items-center gap-4'>
        <div className='flex items-center gap-2 lg:hidden flex-shrink-0'>
          <SheetMenu />
        </div>
        <div className='flex-1 flex items-center gap-4 min-w-0'>
          <h1 className='font-bold text-lg sm:text-xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent truncate'>
            {title}
          </h1>
        </div>
        <div className='flex-shrink-0'>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
