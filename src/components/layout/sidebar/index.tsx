'use client';
import { Menu } from '@/components/layout/sidebar/menu';
import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  
  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen bg-white border-r border-purple-100 shadow-xl transition-all duration-300 ease-in-out z-30',
        'flex flex-col',
        !getOpenState() ? 'w-20' : 'w-64',
        settings.disabled && 'hidden',
        '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-center border-b border-purple-100 px-4 flex-shrink-0">
        <Link href='/laboratory' className='flex items-center gap-2 w-full justify-center'>
          {getOpenState() ? (
            <Image
              src='/logo.svg'
              alt='LabsCheck logo'
              width={140}
              height={40}
              priority
              className='transition-opacity duration-300'
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center text-white font-bold text-base shadow-lg">
              LC
            </div>
          )}
        </Link>
      </div>

      {/* Menu Section */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden py-4"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Menu isOpen={getOpenState()} />
      </div>

      {/* Toggle Button - Positioned outside sidebar */}
      <button
        onClick={toggleOpen}
        className={cn(
          "absolute -right-4 top-20 w-8 h-8 rounded-full",
          "bg-gradient-to-br from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700",
          "text-white shadow-lg hover:shadow-xl",
          "flex items-center justify-center",
          "transition-all duration-200",
          "border-2 border-white",
          "z-50",
          "invisible lg:visible"
        )}
      >
        <svg
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            !getOpenState() && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </aside>
  );
}
