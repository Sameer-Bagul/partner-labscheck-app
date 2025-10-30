'use client';

import { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onMultiDelete?: (selectedItems: TData[]) => void;
  isPending?: boolean;
  pagination?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  sorting?: SortingState;
  onPageChange?: (newPage: number) => void;
  onSortChange?: (sorting: SortingState) => void;
  onLimitChange?: (newLimit: number) => void;

}

export function DataTable<TData>({
  data = [],
  columns,
  searchValue,
  onSearchChange,
  onMultiDelete,
  isPending,
  pagination,
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onSortChange,

}: DataTableProps<TData>) {


  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState(searchValue);

  // Debounce search input to reduce API calls
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearchChange(search);
      // console.log("searching find", search);
    }, 500); // Adjust debounce time as needed
    return () => clearTimeout(timeout);
  }, [search, onSearchChange]);


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    manualSorting: true, // Indicate that sorting is server-side
    manualPagination: true, // Indicate that pagination is server-side
  });

  // Handle sorting updates
  useEffect(() => {
    if (onSortChange) {
      onSortChange(sorting);
    }
  }, [sorting, onSortChange]);

  // Multi-delete handler
  const handleMultiDelete = () => {
    const selectedItems = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
    if (onMultiDelete) {
      onMultiDelete(selectedItems);
    }
  };

  const pageCount = total && limit ? Math.max(1, Math.ceil(total / limit)) : 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by name, category, or laboratory..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm border border-gray-200 rounded-lg px-2 placeholder:text-gray-600"
        />

        {onMultiDelete && Object.keys(rowSelection).length > 0 && (
          <Button onClick={handleMultiDelete} variant="destructive">
            Delete Selected ({Object.keys(rowSelection).length})
          </Button>
        )}
      </div>

      {isPending ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </div>
      ) : (
        <Table className='border-none'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='border-b'>
                {onMultiDelete && (
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={table.getIsAllPageRowsSelected()}
                      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {/* Sorting buttons removed as per request */}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {onMultiDelete && (
                    <TableCell className="w-[50px]">
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="max-w-sm truncate">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      )}

      {pagination && (
        <div className='sticky bottom-0 z-10 bg-white border-t p-2 w-full'>
          <Pagination className="w-full flex flex-col justify-end">
            <PaginationContent className="w-full flex justify-end">
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange && onPageChange(page - 1)}
                  disabled={page <= 1}
                  className='px-2 bg-slate-50 text-sm text-primary'
                />
              </PaginationItem>

              {/* Dynamic Pagination Logic */}
              {pageCount > 4 ? (
                <>
                  {/* First Page */}
                  <PaginationItem>
                    <Button
                      variant={page === 1 ? 'default' : 'outline'}
                      onClick={() => onPageChange && onPageChange(1)}
                    >
                      1
                    </Button>
                  </PaginationItem>

                  {/* Ellipsis before the current page block */}
                  {page > 3 && <span className="px-2">...</span>}

                  {/* Show current page ±1 */}
                  {[...Array(3)].map((_, idx) => {
                    const pageNumber = page - 1 + idx;
                    if (pageNumber > 1 && pageNumber < pageCount) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <Button
                            variant={page === pageNumber ? 'default' : 'outline'}
                            onClick={() => onPageChange && onPageChange(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  {/* Ellipsis before the last page */}
                  {page < pageCount - 2 && <span className="px-2">...</span>}

                  {/* Last Page */}
                  <PaginationItem>
                    <Button
                      variant={page === pageCount ? 'default' : 'outline'}
                      onClick={() => onPageChange && onPageChange(pageCount)}
                    >
                      {pageCount}
                    </Button>
                  </PaginationItem>
                </>
              ) : (
                // For fewer than 4 pages, show all pages directly
                [...Array(pageCount)].map((_, idx) => (
                  <PaginationItem key={idx}>
                    <Button
                      variant={page === idx + 1 ? 'default' : 'outline'}
                      onClick={() => onPageChange && onPageChange(idx + 1)}
                    >
                      {idx + 1}
                    </Button>
                  </PaginationItem>
                ))
              )}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange && onPageChange(page + 1)}
                  disabled={page >= pageCount}
                />
              </PaginationItem>
            </PaginationContent>
            <span className="w-full flex justify-end text-xs p-2">
              Page {page} of {pageCount}
            </span>
          </Pagination>
        </div>
      )}
    </div>
  );
}
