'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChangePasswordForm from './passchangeform';
import ProfileSidebar from './profileSidebar';
import ProfileForm from './profileForm';
import { Suspense } from 'react';
const tabs = [
  { value: 'profile', label: 'Profile', component: <ProfileForm /> },
  // { value: 'address', label: 'Address', component: <AddressForm /> },
  {
    value: 'change-password',
    label: 'Change Password',
    component: <ChangePasswordForm />,
  },
];

export default function ProfilePage() {
  // const [backgroundImage, setBackgroundImage] = useState<string | null>('');

  // const handleImageUpload = (
  //   setter: React.Dispatch<React.SetStateAction<string | null>>,
  // ) => {
  //   const fileInput = document.createElement('input');
  //   fileInput.type = 'file';
  //   fileInput.accept = 'image/*';
  //   fileInput.onchange = (e: Event) => {
  //     const file = (e.target as HTMLInputElement).files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         setter(reader.result as string);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };
  //   fileInput.click();
  // };

  return (
    <div className='w-full flex flex-col'>
      {/* <Card className="relative bg-gradient-to-bl from-gray-700 via-gray-900 to-black  rounded-lg overflow-hidden z-[1]">
        {
          backgroundImage && <Image
          alt="background"
          src={`${ backgroundImage || ""}`}
          width={700}
          height={700}
          className="w-full h-full  object-cover absolute top-0 left-0 z-[-1]"
        />
        }
        <div className="pt-6  h-72  ">
          <CardHeader className="p-6 pt-0">
            <CardTitle className="text-white dark:text-default">Card Title</CardTitle>
            <Button
              size="sm"
              onClick={() => handleImageUpload(setBackgroundImage)}
              className="text-xs px-3 absolute right-4  top-4 flex items-center gap-1 rounded-md bg-opacity-50 hover:bg-opacity-75"
            >
              <FaCameraRotate className="text-lg" />
              Background
            </Button>
          </CardHeader>
          <CardContent className="mt-4 sm:mt-6">
            <CardDescription className="text-base text-white dark:text-default mb-3">
              Card Description
            </CardDescription>
            <p className="text-sm text-white dark:text-default">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </CardContent>
          <CardFooter className="
          w-full  bottom-0 absolute h-10  backdrop-blur-md
          
          ">
          </CardFooter>
        </div>


      </Card> */}
      {/* Profile Form Section */}
      <div className=' w-full flex flex-col-reverse lg:grid lg:grid-cols-3 place-self-end'>
        <div className='col-span-2  z-[1]'>
          <Tabs defaultValue='profile'>
            <TabsList className='bg-transparent flex justify-start gap-4 '>
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className='relative bg-transparent group data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none shadow-none hover:bg-transparent
                text-muted
                font-bold
                hover:text-muted
                data-[state=active]:text-primary'
                >
                  {tab.label}
                  <span
                    className='absolute left-0 bottom-0 w-full h-[4px] scale-x-0 transition-transform duration-300 ease-in-out 
                group-data-[state=active]:scale-x-100 group-hover:scale-x-100
                rounded-lg bg-slate-300 group-hover:bg-slate-300 
                group-data-[state=active]:bg-primary
                '
                  />
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <Suspense fallback={<div>Loading users...</div>}>
                {tab.component}
                </Suspense>
         
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <ProfileSidebar />
      </div>

      {/* Sidebar Section */}
    </div>
  );
}
