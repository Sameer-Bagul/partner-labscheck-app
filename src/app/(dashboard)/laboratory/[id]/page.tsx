'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useGetLabById } from '@/hooks/dashboard/use-labs';
import { ContentLayout } from '@/components/layout/contentLayout';
import PlaceholderContent from '@/components/layout/placeholder';
import LabForm from '@/components/dashboard/labs/laboratory';

export default function LaboratoryPage() {
  const { id } = useParams();
  const labId = id ? Number(id) : null; // Convert ID safely

  const isEditing = Boolean(labId);
  // console.log("isediting",isEditing);
  
  const { data: labData, isLoading } = useGetLabById(labId ?? 0, {
    enabled: !!labId,
  });
  // console.log("incoming lobdata",labData);
  
  return (
    <ContentLayout title={isEditing ? 'Edit Laboratory' : 'Add New Laboratory'}>
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
            <BreadcrumbLink asChild>
              <Link href='/laboratory'>Laboratory</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {labData && (
            <BreadcrumbItem>
              <BreadcrumbPage>{labData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>



<PlaceholderContent>
  {isLoading ? (
 
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
 
  ) : labData ? (
    <LabForm labData={labData} />
  ) : (
    <p className="text-red-500">Labs not found.</p>
  )}
</PlaceholderContent>

    </ContentLayout>
  );
}
