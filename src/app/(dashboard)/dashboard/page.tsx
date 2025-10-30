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
import { TooltipProvider } from '@/components/ui/tooltip';

import isAuth from '@/components/auth/isAuth';
import { ContentLayout } from '@/components/layout/contentLayout';
import { useStore } from '@/hooks/use-store';
import { useSidebar } from '@/hooks/use-sidebar';
import AnalyticsComponent from '@/components/dashboard/analytics/analytics';
import PlaceholderContent from '@/components/layout/placeholder';

const DashboardPage = () => {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;

  return (
    <ContentLayout title='Dashboard'>
      {/* Breadcrumb */}
      <div className='mb-6'>
        <Breadcrumb className='bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-purple-100 inline-flex'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/' className='text-gray-600 hover:text-purple-600 transition-colors'>
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-purple-700 font-semibold'>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <TooltipProvider>
        <PlaceholderContent>
          <AnalyticsComponent />
        </PlaceholderContent>
      </TooltipProvider>
    </ContentLayout>
  );
};

export default isAuth(DashboardPage);
