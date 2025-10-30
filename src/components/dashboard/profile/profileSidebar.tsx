import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';
import { FaCameraRotate } from 'react-icons/fa6';
import { Badge } from '@/components/ui/badge';
export default function ProfileSidebar() {
  const [profileImage, setProfileImage] = useState<string | null>('');


  const handleImageUpload = (
    setter: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setter(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };
  return (
    <Card className='w-full flex flex-col sm:flex-row lg:flex-col lg:max-w-sm lg:mx-auto shadow-md border border-gray-200 relative dark:border-gray-700 rounded-lg '>
      <CardHeader className='w-full flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-6'>
      <div className=' bg-gray-100  w-full h-24 flex justify-center'>
        <div
          className='absolute top-0
               transform -translate-y-1/2 w-48 sm:w- aspect-square rounded-full
      bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] 
      from-indigo-200 via-slate-600 to-indigo-200 flex items-center justify-center
      border-4 border-primary
      z-10
      
      '
        >
          {profileImage && (
            <Image
              src={profileImage || '/placeholder.webp'}
              alt='Profile'
              width={700}
              height={700}
              className='w-full h-full object-cover rounded-full'
            />
          )}
          <Button
          size='sm'
          onClick={() => handleImageUpload(setProfileImage)}
          className='absolute bottom-2 right-2 flex items-center gap-1 
      rounded-md bg-transparent p-1 text-white hover:bg-opacity-75'
        >
          <FaCameraRotate className='text-2xl text-primary' />
        </Button>
        </div>

        
      </div>

        <h2 className='text-lg font-semibold mt-1 text-gray-900 dark:text-white'>
         Demo Partner
        </h2>
        <Badge className='mt-2 px-4 py-1 bg-green-500 text-white rounded-full text-xs'>
          Verified
        </Badge>
      </CardHeader>

      <CardContent className='w-full px-6 py-4'>
        <div className='space-y-4 text-gray-700 dark:text-gray-300'>
          {[
            { label: 'Date Join', value: '23 Aug, 2023' },
            { label: 'Status', value: 'Active' },
            { label: 'Phone', value: '+232 90 9904 8059' },
            { label: 'Email', value: 'user@email.com' },
            { label: 'DoB', value: '09 Sept, 1990' },
            // { label: 'Gender', value: 'F' },
          ].map((item, index) => (
            <div
              key={index}
              className='flex justify-between text-sm border-b last:border-none pb-2'
            >
              <span className='font-medium'>{item.label}</span>
              <span className='text-gray-600 dark:text-gray-400'>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
