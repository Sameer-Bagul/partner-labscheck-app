'use client';


import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../../ui/button';



const Header = () => {

  return (
    <div className='flex justify-between w-full h-full items-center '>
        <div className='flex w-full max-w-52  items-center z-50'>
          <Link href='https://labscheck.com/'>
            <Image
              src='/logo.svg'
              alt='logo'
              width={200}
              height={50}
              priority
            />
          </Link>
        </div>
 
            <div className='flex items-center gap-2'>
              <Link href='/signup'>
                <Button
                className=' cursor-pointer'
                size='sm'
          
              >
                Sign up
              </Button>
              </Link>
              
            </div>
         
      
    </div>
  );
};

export default Header;
