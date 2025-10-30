"use client";

import { useEffect, useMemo, useState } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import testdata from '@/data/addtestdata/testdata.json';
import { useDeleteOfferingsTests, useGetAllTestList } from "@/hooks/dashboard/use-tests";

import { debounce } from "lodash";
import { DataTable } from "@/components/table/data-table";
import { FiEdit } from "react-icons/fi";
import { MdDeleteSweep } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Swal from "sweetalert2";

export interface MyFormData {
  id: number;
  name: string;
  cost?: number;
  parameter?: {
    parameter: string;
    label: string;
  }[];
  city?: {
    name: string;
    state: string;
  }[];
}

type Test = {
  id: number;
  name: string;
  approvalStatus: string;
  city: City[];
  fastingTime: number;
  inclusion_names: string[];
  cost: number;
  parameter: Parameter[];
};

type Package = {
  name: string;
  cost: number;
  approvalStatus: string;
  isFastingRequired: Boolean;
  fastingTime: number;
  inclusion_names: String[];
  providerCity: String[];
  instructions: string;
  id: number;
};

/**
 *  {
      "name": "Liver Function Extended Panel",
      "cost": 599,
      "isFastingRequired": true,
      "fastingTime": 0,
      "inclusions": [
        22,
        2
      ],
      "providerCity": [
        "All"
      ],
      "instructions": null,
      "id": 5634,
      "createdDate": "2025-07-14T12:56:11.684577+00:00",
      "lastModifiedDate": "2025-07-14T12:56:11.684577+00:00",
      "createdBy": "system",
      "lastModifiedBy": "system",
      "inclusion_names": [
        "Lactate Dehydrogenase (LDH), Serum",
        "Liver Function Test (LFT)"
      ]
    },
 */
type City = {
  id: string;
  name: string;
  state: string;
};
type Parameter = {
  id: string;
  label: string;
};
type AllProfileTablesProps = {
  setContainTest: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AllProfile({ setContainTest }: AllProfileTablesProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setpageSize] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState([]);
  const [offeringType, setofferingType] = useState("test_basic");
  const router = useRouter();
   // Reset page to 1 when switching tabs (offeringType)
  useEffect(() => {
    setPage(1);
  }, [offeringType]);

  
  const [isEditing, setIsEditing] = useState(false);
  const sortBy = sorting.length > 0 ? sorting[0].id : "name";
  const sortOrder = sorting.length > 0 && sorting[0].desc ? "desc" : "asc";

  const { data: TestData, isFetching } = useGetAllTestList({
    name: searchValue,
    page,
    pageSize,
    sortBy,
    sortOrder,
    offering_type: offeringType,
  });
  // console.log("✅ TestData pending:", isFetching);

  const { mutate: deleteOfferingsTests } = useDeleteOfferingsTests();

  // console.log("TestData : ", TestData);

  const TestDataa = TestData?.offerings;
  // console.log("TestDataa : ", TestDataa);

  const total = TestData?.total || 0;

  useEffect(() => {
    if (total > 10) {
      setContainTest(true);
    }
  }, [total]);

  // const { mutate: addNewTest, isPending: isPendingTest } = useAddNewTests();

  // const [isDialogOpen, setIsDialogOpen] = useState(false);  for build
  // const [addingUser, setAddingUser] = useState<MyFormData | null>(null);     for build

  // const handleAdd = (data: {
  //   test_id: number;
  //   cost: number;
  //   labs_id: number[];
  // }) => {
  //   addNewTest(data);
  //   // setIsDialogOpen(false);
  // };      for build

  const debouncedSearch = useMemo(
    () => debounce((value) => setSearchValue(value), 500),
    [setSearchValue]
  );

  useEffect(() => {
    setData(TestDataa);
    // console.log("incoming data", TestDataa);
    // const handleAdd = (data: {
  }, [TestDataa]);


  const handleDeleteOfferings = (test: any) => {
    if (!test?.id) {
      console.error("Invalid test object:", test);
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${test.name}"?`
    );
    if (!confirmed) return;

    // console.log("Deleting test:", test.id);
    deleteOfferingsTests([test.id], {
      onSuccess: () => {
        // console.log("Test deleted successfully");
        toast.success(`Offering "${test.name}" deleted successfully.`);
      },
      onError: (err) => {
        console.error("Failed to delete test:", err);
      },
    });
  };

  const handleEditTest = (test: Test) => {
    if (test.approvalStatus === "Active") {
      Swal.fire({
        title: "Are you sure?",
        html: `<b>"${test.name}"</b> is approved.<br/>Editing it require re-approval from LabsCheck and will not be visible on website until approved.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#489e85",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, edit it!",
        width: "400px",
        customClass: { popup: "small-swal" },
      }).then((result) => {
        if (result.isConfirmed) {
          setIsEditing(true);
          router.push(`/profile/${test.id}`);
        }
      });
    } else {
      setIsEditing(true);
      router.push(`/profile/${test.id}`);
    }
  };

  const handleEditPackage = (packageItem: Package) => {
    if (packageItem.approvalStatus === "Active") {
      Swal.fire({
        title: "Are you sure?",
        html: `<b>"${packageItem.name}"</b> is approved.<br/>Editing it require re-approval from LabsCheck and will not be visible on website until approved.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#489e85",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, edit it!",
        width: "400px",
        customClass: { popup: "small-swal" },
      }).then((result) => {
        if (result.isConfirmed) {
          setIsEditing(true);
          router.push(`/profile/packages/${packageItem.id}`);
        }
      });
    } else {
      setIsEditing(true);
      router.push(`/profile/packages/${packageItem.id}`);
    }
  };

  const testColumns: ColumnDef<Test>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="truncate max-w-[200px] font-medium text-sm">
          {row.original.name}
        </div>
      ),
      enableSorting: true, // Enable sorting for this column
    },
    {
      accessorKey: "approvalStatus",
      header: "Status",
      cell: ({ row }) => (
        <div className="truncate max-w-[200px] font-medium text-sm">
          {row.original.approvalStatus}
        </div>
      ),
      enableSorting: true, // Enable sorting for this column
    },
    {
      accessorKey: "inclusion_names",
      header: "Inclusions",
      cell: ({ row }) => {
        const parameters = row.original.inclusion_names;
        if (!Array.isArray(parameters) || parameters.length === 0) {
          return <div className="text-gray-400 italic">No inclusions</div>; // ✅ Show a fallback or leave it blank
        }

        return (
          <div className="space-y-1 text-sm text-muted-foreground">
            {row.original.inclusion_names?.map((name, i) => (
              <div key={i}>{name}</div>
            ))}
          </div>
        );
      },
      enableSorting: true, // Enable sorting for this column
    },
    // {
    //   accessorKey: 'city',
    //   header: 'City',
    //   cell: ({ row }) => {
    //     const city = row.original.city;
    //     if (!Array.isArray(city)) return null;

    //     return (
    //       <div className='space-y-1 text-sm text-muted-foreground'>
    //         {city.map((c, i) => (
    //           <div key={i}>{`${c.name}, ${c.state}`}</div>
    //         ))}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: 'fastingTime',
    //   header: 'FastingTime',
    //   cell: ({ row }) => (
    //     <div className='text-sm font-semibold text-primary'>
    //       {row.original.fastingTime || 'N/A'}
    //     </div>
    //   ),
    // },
    {
      accessorKey: "cost",
      header: "Test Cost",
      cell: ({ row }) => (
        <div className="text-sm font-semibold text-primary">
          ₹{row.original.cost || "N/A"}
        </div>
      ),
      enableSorting: true, // Enable sorting for this column
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditTest(row.original)}
          >
            <FiEdit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteOfferings(row.original)}
          >
            <MdDeleteSweep className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableSorting: true, // Enable sorting for this column
    },
  ];

  /**
   * type Package = {
  name: string;
  cost : number;
  isFastingRequired: Boolean;
  fastingTime: number;
  inclusion_names: String[];
  providerCity: String[];
  instructions: string;
  id: number;
}
   */

  const packageColumns: ColumnDef<Package>[] = [
    {
      accessorKey: "name",
      header: "Package Name",
      cell: ({ row }) => (
        <div className="truncate max-w-[200px] font-medium text-sm">
          {row.original.name || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "approvalStatus",
      header: "Status",
      cell: ({ row }) => (
        <div className="truncate max-w-[200px] font-medium text-sm">
          {row.original.approvalStatus}
        </div>
      ),
    },
    {
      accessorKey: "inclusion_names",
      header: "Inclusion",
      cell: ({ row }) => {
        const parameters = row.original.inclusion_names;
        if (!Array.isArray(parameters) || parameters.length === 0) {
          return <div className="text-gray-400 italic">No inclusions</div>; // ✅ Show a fallback or leave it blank
        }

        return (
          <div className="space-y-1 text-sm text-muted-foreground">
            {row.original.inclusion_names?.map((name, i) => (
              <div key={i}>{name}</div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "cost",
      header: "Package Cost",
      cell: ({ row }) => (
        <div className="text-sm font-semibold text-primary">
          ₹{row.original.cost || "N/A"}
        </div>
      ),
    },
    // {
    //   accessorKey: 'isFastingRequired',
    //   header: "Fasting Required",
    //   cell: ({ row }) => (
    //     <div className="text-sm font-semibold text-primary">
    //       {row.original.isFastingRequired ? "Yes" : "No"}
    //     </div>
    //   )
    // },
    // {
    //   accessorKey: 'fastingTime',
    //   header: "Fasting Time",
    //   cell: ({ row }) => (
    //     <div className="text-sm font-semibold text-primary">
    //       {row.original.fastingTime} hrs
    //     </div>
    //   )
    // },

    // {
    //   accessorKey: 'providerCity',
    //   header: "Operable Cities",
    //   cell: ({ row }) => {
    //     const parameters = row.original.providerCity;
    //     if (!Array.isArray(parameters) || parameters.length === 0) {
    //       return <div className="text-gray-400 italic">N/A</div>; // ✅ Show a fallback or leave it blank
    //     }

    //     return (
    //       <div className="space-y-1 text-sm text-muted-foreground">
    //         {parameters.map((name, i) => (
    //           <div key={i}>{name}</div>
    //         ))}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: 'instructions',
    //   header: 'Instructions',
    //   cell: ({row}) => (
    //     <div className="text-sm font-semibold text-primary">
    //       {row.original.instructions || "N/A"}
    //     </div>
    //   )
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditPackage(row.original)}
          >
            <FiEdit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteOfferings(row.original)}
          >
            <MdDeleteSweep className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  {
    isEditing && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Tabs
        defaultValue="test_basic"
        onValueChange={(value) => setofferingType(value)}
      >
        {/* Tabs Header */}
        <div className="rounded-t-md">
          <TabsList className="flex w-full space-x-0 bg-transparent p-0 border-b border-gray-200">
            <TabsTrigger
              value="test_basic"
              className="flex-1 rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors
      data-[state=active]:border-b-primary
      data-[state=active]:text-primary
      data-[state=active]:bg-purple-50
      data-[state=inactive]:bg-white 
      data-[state=inactive]:text-gray-600
      hover:bg-slate-200"
            >
              Tests
            </TabsTrigger>
            <TabsTrigger
              value="test_package"
              className="flex-1 rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors
      data-[state=active]:border-b-primary
      data-[state=active]:text-primary
      data-[state=active]:bg-purple-50
      data-[state=inactive]:bg-white 
      data-[state=inactive]:text-gray-600
      hover:bg-slate-200"
            >
              Packages
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tabs Content */}
        <div className="border-muted bg-white px-4 py-4 rounded-b-md shadow-sm">
          <TabsContent value="test_basic">
            <DataTable<Test>
              columns={testColumns}
              searchValue={searchValue}
              onSearchChange={debouncedSearch}
              isPending={isFetching}
              pagination={true}
              data={data || []}
              total={total}
              page={page}
              limit={pageSize}
              onPageChange={(newpage) => setPage(newpage)}
              onSortChange={setSorting}
              onLimitChange={(newlimit) => {
                setpageSize(newlimit);
                setPage(1);
              }}
            />
          </TabsContent>

          <TabsContent value="test_package">
            <DataTable<Package>
              columns={packageColumns}
              searchValue={searchValue}
              onSearchChange={debouncedSearch}
              isPending={isFetching}
              pagination={true}
              data={data || []}
              total={total}
              page={page}
              limit={pageSize}
              onPageChange={(newpage) => setPage(newpage)}
              onSortChange={setSorting}
              onLimitChange={(newlimit) => {
                setpageSize(newlimit);
                setPage(1);
              }}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* <DataTable
        columns={columns}
        searchValue={searchValue}
        onSearchChange={debouncedSearch}
        isPending={isFetching}
        pagination={true}
        data={data || []}
        total={total}
        page={page}
        limit={pageSize}
        onPageChange={(newpage) => setPage(newpage)}
        onSortChange={setSorting}
        onLimitChange={(newlimit) => {
          setpageSize(newlimit);
          setPage(1);
        }}
      /> */}
    </div>
  );
}
