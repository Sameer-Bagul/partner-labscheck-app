'use client';
import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentLayout } from '@/components/layout/contentLayout';
import PlaceholderContent from '@/components/layout/placeholder';
import { AddProfile } from '@/components/dashboard/test_profile/addtest/addprofile';
import AddProfileStepper from '@/components/dashboard/test_profile/steps/addprofilestepper';
import API from '@/lib/axios-client';
import AddPackage from '@/components/dashboard/package/addpackage';
import isAuth from '@/components/auth/isAuth';
import TestSuccessPreview from '@/components/dashboard/test_profile/steps/confirmation';

const AddPackages = () => {

  //   const fetchTestDetails = async() => {
  //       try {
  //         const response = await API.post(`${process.env.NEXT_PUBLIC_API_URL}/partners/get-basic-tests-suggestions`)
  //       } catch (error) {

  //       }
  //   }

  return (
    <ContentLayout title='Add Package'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/'>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {/* <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/dashboard'>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem> */}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/profile'> Your Offerings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Package</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PlaceholderContent>
       
          <AddPackage />
     
      </PlaceholderContent>
    </ContentLayout>
  );
}

export default isAuth(AddPackages);