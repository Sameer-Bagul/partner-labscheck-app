'use client';

import { useEffect, useMemo, useState } from 'react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EditForm from './form';
import { useAddNewTests, useGetAllTestList } from '@/hooks/dashboard/use-tests';

import { debounce } from 'lodash';
import { DataTable } from '@/components/table/data-table';

export interface MyFormData {
  id: number;
  name: string;
  short_description: string;
  category?: string;
  avg_cost: string;
  cost?: number;
  laboratory?: string[];
}

export default function AllTestTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  // Extract sorting parameters
  const sortBy = sorting.length > 0 ? sorting[0].id : 'name';
  const sortOrder = sorting.length > 0 && sorting[0].desc ? 'desc' : 'asc';

  const { data: TestData,isPending } = useGetAllTestList({
    search: searchValue,
    page,
    limit,
    sortBy,
    sortOrder,
  });
  

  const { mutate: addNewTest, isPending: isPendingTest } = useAddNewTests();

  const [data, setData] = useState<MyFormData[]>(
    TestData?.available_tests || [],
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addingUser, setAddingUser] = useState<MyFormData | null>(null);

  useEffect(() => {
    if (TestData) {
      setData(TestData.available_tests);
    }
    // console.log("testdata",TestData);
  }, [TestData]);

  const handleAdd = (data: {
    test_id: number;
    cost: number;
    labs_id: number[];
  }) => {
    addNewTest(data);
    setIsDialogOpen(false);
  };

  const debouncedSearch = useMemo(
    () => debounce((value) => setSearchValue(value), 500),
    [setSearchValue],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Cleanup to avoid memory leaks
    };
  }, [debouncedSearch]);

  const columns: ColumnDef<MyFormData>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <p className='truncate w-full max-w-64 gap-2'>{row.original.name}</p>
      ),
    },
    {
      accessorKey: 'short_description',
      header: 'Description',
      enableSorting: false,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      enableSorting: false,
    },
    {
      accessorKey: 'avg_cost',
      header: 'Average Cost',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              setAddingUser(row.original);
              setIsDialogOpen(true);
            }}
          >
            Add
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className='container-fluid'>
      
      <DataTable
        columns={columns}
        searchValue={searchValue}
        onSearchChange={debouncedSearch}
        isPending={isPending}
        pagination={true}
        data={data || []}
        total={TestData?.total || 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onSortChange={setSorting}
        onLimitChange={setLimit}
        
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Test</DialogTitle>
            <DialogDescription>Modify the test details.</DialogDescription>
          </DialogHeader>
          {addingUser && (
            <EditForm
              initialData={addingUser}
              onSubmit={handleAdd}
              isPending={isPendingTest}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
