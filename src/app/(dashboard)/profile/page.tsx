'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner'; // ✅ import toast from sonner

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ContentLayout } from '@/components/layout/contentLayout';
import PlaceholderContent from '@/components/layout/placeholder';
import AllProfile from '@/components/dashboard/test_profile/allprofile';
import { Button } from '@/components/ui/button';
import { useAllLabList } from '@/hooks/dashboard/use-labs';

export default function CategoriesPage() {
  const [containTest, setContainTest] = useState(false);
  const [containLab, setContainLab] = useState(false);
  const { data: labsData = [] } = useAllLabList();

  useEffect(() => {
    if (Array.isArray(labsData) && labsData.length > 0) {
      setContainLab(true);
    } else {
      setContainLab(false);
    }
  }, [labsData]);

  const handleNoLab = () => {
    toast.error('Please add a Lab before adding Basic Tests'); // ✅ Sonner error toast
  };

  const handleNoTest = () => {
    toast.error('Please add at least 10 Test before creating a Package'); // ✅ Sonner error toast
  };

  return (
    <ContentLayout title='Offerings'>
      <div className='flex max-sm:flex-col gap-4 md:justify-between'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/'>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Your Offerings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ✅ Buttons */}
        <div className='flex gap-2'>
          {/* Add Basic Test */}
          {!containLab ? (
            <Button
              className="text-sm py-0 px-4 rounded-xl opacity-50"
              onClick={handleNoLab}
            >
              Add Basic Tests
            </Button>
          ) : (
            <Link href="/profile/addprofile">
              <Button className="text-sm py-0 px-4 rounded-xl">
                Add Basic Tests
              </Button>
            </Link>
          )}

          {/* Add Package */}
          {!containTest ? (
            <Button
              className="text-sm py-0 px-4 rounded-xl opacity-50"
              onClick={handleNoTest}
            >
              Add Package
            </Button>
          ) : (
            <Link href="/profile/addpackage">
              <Button className="text-sm py-0 px-4 rounded-xl">
                Add Package
              </Button>
            </Link>
          )}
        </div>
      </div>

      <PlaceholderContent>
        <AllProfile setContainTest={setContainTest} />
      </PlaceholderContent>
    </ContentLayout>
  );
}
