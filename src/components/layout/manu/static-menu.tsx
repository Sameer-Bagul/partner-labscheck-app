'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars } from 'react-icons/fa';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SignOutPage from '@/app/(auth)/signout/page';


import { useAuth } from '@/providers/auth-Provider';



function getInitials(fullName: string | undefined) {
  if (!fullName) return '';
  const names = fullName.trim().split(/\s+/);
  const first = names[0]?.[0]?.toUpperCase() || '';
  const last = names[names.length - 1]?.[0]?.toUpperCase() || '';
  return first + last;
}
const StaticMenu = () => {


  const { user } = useAuth();
  const userInitials = getInitials(user?.name);
  const headerLinks = [
    {
      href: '/users/account',
      icon: null,
      label: 'Account',
      authOnly: true,
      mobileOnly: false,
    },
    {
      href: '/about',
      icon: null,
      label: 'About Us',
      authOnly: false,
      mobileOnly: false,
    },
    {
      href: '/contact',
      icon: null,
      label: 'Contact Us',
      authOnly: false,
      mobileOnly: false,
    },
  ];

  const filteredHeaderLinks = headerLinks.filter(
    (link) => !link.authOnly 
    // || (link.authOnly && user)
  );

  return (
    <div>
      <div className='hidden md:flex items-center justify-center space-x-4'>
        {filteredHeaderLinks.map((links) => {
          return (
            <div
              key={`${links.href}${links.label}`}
              className={`list-none ${
                links.authOnly ? 'block sm:hidden' : 'block'
              }`}
            >
              <Link
                href={links.href}
                className='relative font-normal text-primary flex items-center transition duration-200 no-underline hover:text-secondary focus:text-primary group cursor-pointer text-nowrap'
              >
                {links.label}
                <span className='absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full group-focus:w-full' />
              </Link>
            </div>
          );
        })}
      </div>

      <Sheet>
        <SheetTrigger className='md:hidden flex justify-center items-center  rounded'>
          <FaBars className='h-7 w-7 text-primary' />
        </SheetTrigger>
        {/* Move SheetHeader inside SheetContent */}
        <SheetContent side='left' className=' backdrop-blur-3xl'>
          <SheetHeader className='sr-only'>
            <SheetTitle>Mobile Menu</SheetTitle>
            <SheetDescription>Navigate through the menu</SheetDescription>
          </SheetHeader>

          <div className='flex  flex-col mb-8 items-start gap-4 z-50'>
            <Link href='/' className='w-full max-w-48 flex justify-start '>
              <Image
                src='/logo.svg'
                alt='logo'
                priority
                width={180}
                height={50}
              />
            </Link>
            <div className='w-full flex sm:hidden   justify-start shrink-0 gap-4 items-center '>
              {!user ? (
                <>
                  <Link href='/partner'>
                    <Button variant='outline' className='text-xs  py-0 h-8 ' size='sm'>
                      Become Partner
                    </Button>
                  </Link>
                  <Link href='/signin'>
                    <Button size='sm' className='text-xs py-0 h-8 '>Sign In</Button>
                  </Link>
                </>
              ) : (
                <div className='w-full space-y-4 border-b border-b-primary pb-4'>
                  <Link
                    href='/users/account'
                    className='relative h-8 w-8 rounded-full border-1 border-primary'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src='#' alt='Avatar' />
                      <AvatarFallback className='bg-transparent'>
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      {user?.name}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {user?.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <ul className='w-full flex flex-col space-y-4 pb-4'>
            {filteredHeaderLinks.map((links) => {
            
              return (
                <li
                  key={`${links.href}${links.label}`}
                  className={`list-none ${
                   links.authOnly ? 'block' : ''
                  }`}
                >
                  <Link
                    href={links.href}
                    className='relative font-normal text-primary flex items-center transition duration-200 no-underline hover:text-secondary-foreground focus:text-primary group'
                  >
                    {links.label}
                    <span className='absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full group-focus:w-full' />
                  </Link>
                </li>
              );
            })}
          </ul>

          {user && (
            <div className=' absolute bottom-5 right-5 '>
              <Button size='sm'>
                <SignOutPage className='w-full text-white ' />
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default StaticMenu;
