'use client';

import Link from 'next/link';
import { Ellipsis } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { getMenuList } from '@/lib/menu-list';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CollapseMenuButton } from '@/components/layout/sidebar/collapse-menu-button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useAuth } from '@/providers/auth-Provider';
import { Home } from 'lucide-react';
import SignOutPage from '@/app/(auth)/signout/page';
import React from 'react';

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  const { user } = useAuth();

  return (
    <ScrollArea className='flex-1 [&>div>div[style]]:!block'>
      <nav className='h-full w-full'>
        <ul className='flex flex-col min-h-[calc(100vh-120px)] items-start space-y-1 px-2 pb-4'>
          {menuList.map(({ groupLabel, menus }, groupIdx) => (
            <li className={cn('w-full', groupLabel ? 'pt-5' : '')} key={groupIdx}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className='text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate'>
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className='w-full'>
                      <div className='w-full flex justify-center items-center'>
                        <Ellipsis className='h-5 w-5' />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side='right'>
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className='pb-2'></p>
              )}
              {menus.map((menu, menuIdx) => {
                // After Dashboard, insert Your Franchise if user is FranchisePartner
                const isDashboard = menu.label === 'Dashboard';
                return (
                  <React.Fragment key={menu.label + '-' + menuIdx}>
                    <div className='w-full'>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                (menu.active === undefined &&
                                  pathname.startsWith(menu.href)) ||
                                menu.active
                                  ? 'secondary'
                                  : 'ghost'
                              }
                              className={cn(
                                'w-full justify-start h-10 mb-1 transition-all duration-200',
                                ((menu.active === undefined && pathname.startsWith(menu.href)) || menu.active)
                                  ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 hover:from-purple-200 hover:to-violet-200'
                                  : 'hover:bg-purple-50 hover:text-purple-600'
                              )}
                              asChild
                            >
                              <Link href={menu.href}>
                                <span
                                  className={cn(isOpen === false ? '' : 'mr-4')}
                                >
                                  <menu.icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    'max-w-[200px] truncate font-medium',
                                    isOpen === false
                                      ? '-translate-x-96 opacity-0'
                                      : 'translate-x-0 opacity-100',
                                  )}
                                >
                                  {menu.label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side='right'>
                              {menu.label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {/* {isDashboard && user?.user_type === 'FranchisePartner' && (
                      <div className='w-full mt-6' key={menu.label + '-franchise-menu'}>
                        {isOpen ? (
                          <p className='text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate'>Your Franchise</p>
                        ) : (
                          <TooltipProvider>
                            <Tooltip delayDuration={100}>
                              <TooltipTrigger className='w-full'>
                                <div className='w-full flex justify-center items-center'>
                                  <Home className='h-5 w-5' />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side='right'>Your Franchise</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        <TooltipProvider disableHoverableContent>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Button
                                variant={pathname.startsWith('/franchise') ? 'secondary' : 'ghost'}
                                className='w-full justify-start h-10 mb-1'
                                asChild
                              >
                                <Link href='/franchise'>
                                  <span className={cn(isOpen === false ? '' : 'mr-4')}>
                                    <Home size={18} />
                                  </span>
                                  <p className={cn(
                                    'max-w-[200px] truncate',
                                    isOpen === false
                                      ? '-translate-x-96 opacity-0'
                                      : 'translate-x-0 opacity-100',
                                  )}>
                                    Your Franchise
                                  </p>
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            {isOpen === false && (
                              <TooltipContent side='right'>Your Franchise</TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )} */}
                  </React.Fragment>
                );
              })}
            </li>
          ))}

          <li className='w-full grow flex items-end'>
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full justify-center h-10 p-1 border-purple-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 transition-all duration-200'
                  >
                    <SignOutPage isOpen={isOpen}/>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side='right'>Sign out</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
