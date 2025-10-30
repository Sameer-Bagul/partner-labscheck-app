'use client';
import Link from 'next/link';
import { ContentLayout } from '@/components/layout/contentLayout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import PlaceholderContent from '@/components/layout/placeholder';
import AllLabs from '@/components/dashboard/labs/allLabs';
import { Button } from '@/components/ui/button';
import isAuth from '@/components/auth/isAuth';
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import { useState } from "react"
import SubscriptionsPage from '@/components/dashboard/subscriptions/subscription';
const PostsLaboratoryPage = () => {
  const [visible, setVisible] = useState(true)


  return (
    <ContentLayout title='Subscription'>
      <div className='flex justify-between'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/'>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {/* <BreadcrumbSeparator /> */}
            {/* <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/dashboard'>Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem> */}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Subscription</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* <Link href={'/laboratory/new'}>
          <Button>Add New Lab</Button>
        </Link> */}
      </div>
      <PlaceholderContent>
        {/* <AllLabs /> */}
        <SubscriptionsPage />
      </PlaceholderContent>
    </ContentLayout>
  );
};

// export default PostsLaboratoryPage;

export default isAuth(PostsLaboratoryPage);
