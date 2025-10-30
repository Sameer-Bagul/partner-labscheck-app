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
import {
  useDeleteTests,
  useGetUserAddedTests,
  useUpdateTests,
} from '@/hooks/dashboard/use-tests';
import { FiEdit } from 'react-icons/fi';
import { MdDeleteSweep } from 'react-icons/md';
import { debounce } from 'lodash';
import { toast } from 'sonner';
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

export default function AddedTestTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const sortBy = sorting.length > 0 ? sorting[0].id : 'name';
  const sortOrder = sorting.length > 0 && sorting[0].desc ? 'desc' : 'asc';
  const [data, setData] = useState<MyFormData[]>([]);
  const { data: AddTestData,refetch, isPending,  } = useGetUserAddedTests({
    search: searchValue,
    page,
    limit,
    sortBy,
    sortOrder,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MyFormData | null>(null);

  useEffect(() => {
    if (AddTestData) {
      setData(AddTestData.tests);
    }
    // console.log("list.......",AddTestData);
    refetch();
  }, [AddTestData,refetch]);

  const { mutate: updateTest, isPending: isPendingUpdate } = useUpdateTests();
  const handleUpdate = (data: {
    test_id: number;
    cost: number;
    labs_id: number[];
  }) => {
    const newUpdate = {
      testId: data.test_id as number, // ✅ Use correct property names
      cost: data.cost, // ✅ Use correct property names
      labIds: data.labs_id ?? [], // ✅ Ensure this is an array
    };

    if (isPendingUpdate) {
      toast.loading('Updating Test...');
    }
    updateTest(newUpdate);

    setIsDialogOpen(false);
  };

  const { mutate: deleteTest, isPending: isPendingDelete } = useDeleteTests();

  const handleDelete = (user: MyFormData) => {
    // ✅ Expect a single object
    const newDelete = {
      testId: user.id, // ✅ Use correct property names
      labIds: user.laboratory ?? [], // ✅ Ensure this is an array
    };

    deleteTest(newDelete);
    if (isPendingDelete) {
      toast.loading('Deleting Test...');
    }
  };

  // const handleMultiDelete = (users: MyFormData[]) => {
  //   const userIds = new Set(users.map((record) => record.id));
  //   setData((prev) => prev.filter((record) => !userIds.has(record.id)));
  // };

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
        <div className='truncate w-full max-w-44' title={row.original.name}>
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: 'short_description',
      header: 'Description',
      cell: ({ row }) => (
        <div
          className='truncate w-full max-w-52'
          title={row.original.short_description}
        >
          {row.original.short_description}
        </div>
      ),
    },
    { accessorKey: 'category', header: 'Category' },
    {
      accessorKey: 'avg_cost',
      header: 'Avg Cost',
      size: 100,
      minSize: 80,
      maxSize: 120,
    },
    {
      accessorKey: 'cost',
      header: 'Your Cost',
      size: 100,
      minSize: 80,
      maxSize: 120,
    },
    {
      accessorKey: 'laboratory',
      header: 'Laboratory',
      size: 180,
      cell: ({ row }) => (
        <div
          className='truncate w-full max-w-44'
          title={row.original.laboratory?.join(', ')}
        >
          <ul className='list-inside list-disc'>
            {row.original.laboratory?.map((labs, index) => (
              <li key={index} className='truncate'>
                {labs}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => {
              setEditingUser(row.original);
              setIsDialogOpen(true);
            }}
          >
            <FiEdit className='w-6 h-6' />
          </Button>
          <Button
            size='sm'
            variant='ghost'
            className='hover:bg-destructive group'
            onClick={() => handleDelete(row.original)}
          >
            <MdDeleteSweep className='w-6 text-destructive h-6 group-hover:text-muted' />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className='container mx-auto'>
      <DataTable
        columns={columns}
        searchValue={searchValue}
        onSearchChange={debouncedSearch}
        isPending={isPending}
        pagination={true}
        data={data || []}
        total={AddTestData?.total || 0}
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
          {editingUser && (
            <EditForm
              initialData={editingUser}
              onSubmit={handleUpdate}
              isPending={isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
