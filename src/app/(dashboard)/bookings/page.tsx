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
import FranchiseComponent from '@/components/dashboard/franchise/franchise';
import BookingComponent from '@/components/dashboard/bookings/bookings';

const BookingMainPage = () => {
    return (
        <ContentLayout title='All Posts'>
            <div className='flex justify-between'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href='/'>Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Bookings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {/* <Link href={'/laboratory/new'}>
          <Button>Add Labs</Button>
        </Link> */}
            </div>
            {/* <div className='mt-4'>
                <BookingComponent />
            </div> */}
                {/* <FranchiseComponent /> */}
            <PlaceholderContent>
            {/* <AllLabs /> */}
            <div className='mt-4'>
                <p className='text-gray-600'>No Bookings Available</p>
            </div>
            </PlaceholderContent>
        </ContentLayout>
    );
};

// export default PostsLaboratoryPage;

export default isAuth(BookingMainPage);
