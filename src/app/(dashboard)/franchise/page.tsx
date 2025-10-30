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

const FranchiseMainPage = () => {
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
                            <BreadcrumbPage>Franchise</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {/* <Link href={'/laboratory/new'}>
          <Button>Add Labs</Button>
        </Link> */}
            </div>
            <div className='mt-4'>
                <FranchiseComponent />
            </div>
            {/* <PlaceholderContent> */}
            {/* <AllLabs /> */}
            {/* </PlaceholderContent> */}
        </ContentLayout>
    );
};

// export default PostsLaboratoryPage;

export default isAuth(FranchiseMainPage);
