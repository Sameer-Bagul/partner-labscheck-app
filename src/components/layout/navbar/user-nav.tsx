'use client';

import Link from 'next/link';
import { LayoutGrid, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


import SignOutPage from '@/app/(auth)/signout/page';
import { useAuth } from '@/providers/auth-Provider';



function getInitials(fullName) {
  if (!fullName) return '';
  const names = fullName.trim().split(/\s+/);
  if (names.length === 1) {
    return names[0][0].toUpperCase();
  }
  const firstInitial = names[0][0].toUpperCase();
  const lastInitial = names[names.length - 1][0].toUpperCase();
  return firstInitial + lastInitial;
}

export function UserNav() {
  
    const {user} = useAuth()

    const userInitials = getInitials(user?.name);
  return (
    <DropdownMenu>
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='relative h-8 w-8 rounded-full'
            >
              <Avatar className='h-8 w-8'>
                <AvatarImage src='#' alt='Avatar' />
                <AvatarFallback className='bg-transparent'>
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Profile</TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <DropdownMenuContent className='w-56' align='end' forceMount>
      <DropdownMenuLabel className='font-normal'>
        <div className='flex flex-col space-y-1'>
          <p className='text-sm font-medium leading-none'>
            {user?.name}
          </p>
          <p className='text-xs text-muted-foreground'>
            {user?.email}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {/* <DropdownMenuItem asChild> */}
          {/* <Link href='/dashboard' className='flex items-center'>
            <LayoutGrid className='w-4 h-4 mr-3 text-muted-foreground' />
            Dashboard
          </Link> */}
        {/* </DropdownMenuItem> */}
        <DropdownMenuItem asChild>
          <Link href='/account' className='flex items-center'>
            <User className='w-4 h-4 mr-3 text-muted-foreground' />
            Account
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem >
       <SignOutPage/>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  );
}
