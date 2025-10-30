import Link from 'next/link';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Menu } from '@/components/layout/sidebar/menu';
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden' asChild>
        <Button className='h-9 w-9 hover:bg-purple-50' variant='ghost' size='icon'>
          <MenuIcon size={20} className="text-purple-600" />
        </Button>
      </SheetTrigger>
      <SheetContent className='sm:w-72 px-3 h-full flex flex-col bg-white/95 backdrop-blur-xl border-r border-purple-100' side='left'>
        <SheetHeader>
          <Button
            className='flex justify-center items-center pb-2 pt-1 hover:bg-purple-50'
            variant='link'
            asChild
          >
            <Link href='/laboratory' className='flex items-center gap-2'>
              <SheetTitle className="sr-only">LabsCheck Navigation</SheetTitle>
              <Image
                src='/logo.svg'
                alt='LabsCheck logo'
                width={120}
                height={40}
                priority
              />
            </Link>
          </Button>
          <SheetDescription className='sr-only'>
            Navigate through the dashboard menu.
          </SheetDescription>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
