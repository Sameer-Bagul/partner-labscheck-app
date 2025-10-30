"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/components/layout/contentLayout";
import PlaceholderContent from "@/components/layout/placeholder";

// import demodata from '@/data/addtestdata/testdata.json';
import { AddProfile } from "@/components/dashboard/test_profile/addtest/addprofile";
import { useGetAllTestList } from "@/hooks/dashboard/use-tests";
import AddProfileStepper from "@/components/dashboard/test_profile/steps/addprofilestepper";

export default function LaboratoryPage() {
  const { id } = useParams();
  const testId = id ? Number(id) : null; // Convert ID safely

  // console.log('Id in layout: ', testId);

  const isEditing = Boolean(testId);
  const { data: demodata, isPending } = useGetAllTestList({
    offering_id: testId || undefined,
    offering_type: "test_basic",
  });

  console.log("demodata from API in id component:", demodata);

  return (
    <ContentLayout title={isEditing ? "Edit Offerings" : "Add New Test"}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/profile">Your Offerings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="">
                {isEditing ? "Edit Test" : "Add Tests"}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {demodata && (
            <BreadcrumbItem>
              <BreadcrumbPage>
                {Array.isArray(demodata.offerings)
                  ? demodata.offerings
                      .map((offering) => offering.name)
                      .join(" / ")
                  : demodata.offerings?.name || "No Test"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <PlaceholderContent>
        {
          // isLoading ? (
          //   <p>Loading...</p>
          // ) :
          demodata ? (
            // <AddProfile testData={demodata} />
            <AddProfileStepper testData={demodata.offerings} />
          ) : (
            <p className="text-red-500">Labs not found.</p> // ✅ Show error if 404
          )
        }
      </PlaceholderContent>
    </ContentLayout>
  );
}
