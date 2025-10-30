'use client';
import { useParams } from 'next/navigation';
import { useGetAllTestList } from '@/hooks/dashboard/use-tests';
import AddPackage from '@/components/dashboard/package/addpackage';
import { ContentLayout } from '@/components/layout/contentLayout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';

export default function PackageEditPage() {
  const { id } = useParams();
  const packageId = Number(id);

  // 1. Fetch the package details using the correct hook
  const { data, isLoading } = useGetAllTestList({
    offering_type: 'test_package',
    offering_id: packageId,
    page: 1,
    pageSize: 1,
  });

  // 2. Extract the package object from the API response
  const fetchedPackage = data?.offerings?.[0];

  // 3. Transform the payload to match the AddPackage component's expected props
  const transformPackageData = (pkg: any) => {
    if (!pkg) return null;

    // The form expects `reportTime` to be an object, not null
    const reportTime = pkg.report_turnaround_time || { value: '', unit: 'hrs' };

    // The form expects `reportDelivery` to be an array, not null
    const reportDelivery = pkg.report_delivery || [
      { name: 'Email', selected: false },
      { name: 'WhatsApp', selected: false },
      { name: 'Physical Copy', selected: false },
    ];

    // Map the API response to match PackageType interface
    return {
      id: pkg.id,
      name: pkg.name || '',
      basic_tests: pkg.basic_tests || [],
      homeCollection: pkg.home_collection ? 'yes' : 'no',
      precautions: pkg.precautions || [{ name: 'Fasting', selected: false, value: '' }],
      reportTime: {
        value: reportTime.value?.toString() || '',
        unit: reportTime.unit || 'hrs',
      },
      reportDelivery,
      cost: pkg.cost?.toString() || '',
      consultations: pkg.consultations || [],
      selected: true, // Since this is an existing package being edited
    };
  };

  const packageDataForForm = transformPackageData(fetchedPackage);
  // console.log("Original API data:", fetchedPackage);
  // console.log("Transformed Data for Form:", packageDataForForm);

  // Show loader until data is fetched
  if (isLoading || !packageDataForForm) {
    return (
      <ContentLayout title="Edit Package">
        <div className='flex flex-col items-center justify-center mt-20'>
          <Spinner />
          <p className='text-gray-600 mt-4'>Loading package data...</p>
        </div>
      </ContentLayout>
    );
  }


  return (
    <ContentLayout title="Edit Package">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/'>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/profile'>Offerings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Package</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{packageDataForForm?.name || 'Edit'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <AddPackage packageData={packageDataForForm} />
    </ContentLayout>
  );
}
