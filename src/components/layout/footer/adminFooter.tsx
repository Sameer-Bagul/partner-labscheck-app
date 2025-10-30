import Link from 'next/link';
import { FaRegCopyright } from 'react-icons/fa6';

export function Footer() {
  return (
    <div className='z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-4 md:mx-8 flex h-14 items-center'>
        <p className='text-xs md:text-sm flex items-center leading-loose text-muted-foreground'>
          <FaRegCopyright className='mr-1' />2025 {' '}
          <Link
            href='https://www.wysetree.com'
            target='_blank'
            rel='noopener noreferrer'
            className='font-medium underline underline-offset-4 mx-1'
          >
            WyseTree
          </Link>.
           All rights reserved.
        </p>
      </div>
    </div>
  );
}
