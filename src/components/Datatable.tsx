"use client"

import { useRouter } from 'next/router';
import Link from 'next/link';
import CreateJobForm from './CreateJobForm';

import { Download, Upload, ChevronRight, Settings } from "lucide-react"
import React, { useState, useEffect } from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ref, onValue, get } from 'firebase/database'
import { database}  from '@/firebase/firebase';


export type Job = {
  id: string
  companyName: string
  jobName: string
  jobType: string
  // status: "pending" | "processing" | "success" | "failed"
}

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "companyName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("companyName")}</div>,
  },
  {
    accessorKey: "jobName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("jobName")}</div>,
  },
  {
    accessorKey: "jobType",
    header: () => <div>Type</div>,
    cell: ({ row }) => <div className="capitalize">{row.getValue("jobType")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


// interface DataTableProps {
//   setSelectedRow: React.Dispatch<React.SetStateAction<string>>;
//   selectedRow: string;
// }

export function DataTable({ setSelectedRow, selectedRow }: any) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [data, setJobs] = useState<Job[]>([]);

  useEffect(() => {
      const fetchJobNames = async () => {
        try {
          const jobsRef = ref(database);
          onValue(jobsRef,(snapshot) => {
            if (snapshot.exists()) {
              const jobData = snapshot.val();
              if (jobData) {
                const jobsArray: Job[] = Object.entries(jobData).map(([jobId, job]) => ({
                  id: jobId,
                  ...jobData[jobId],
                }));
                jobsArray.sort((a, b) => b.timestamp - a.timestamp);
                setJobs(jobsArray);
                console.log(jobsArray)
              //   setFilteredJobs(jobsArray);
              } else {
                console.log("No jobs data")
              }
            } else {
              console.log('No jobs found');
            }
          })
        } catch (error) {
          console.error('Error fetching job names:', error);
        }
      };
      fetchJobNames();
  }, [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleJobSelected = (row: any) => {
    setSelectedRow(row)
  }

  return (
    <div className="h-full pl-4 pr-4">
      <div className="flex pt-4 pb-4 justify-between items-center">
        <Input
          placeholder="Filter jobs..."
          value={(table.getColumn("jobName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <CreateJobForm />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Settings className='cursor-pointer w-10'></Settings>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleJobSelected(row)}
                  className={`${
                    selectedRow && selectedRow.id === row.id ? 'bg-primary text-secondary' : ''
                  } hover:bg-primary hover:text-secondary cursor-pointer transition duration-300`}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                    {/* <Link
                      key={row.id}
                      href={{
                        pathname: `/map/${row.original.id}`,
                        query: { id: row.original.id, name: row.original.name, companyName: row.original.companyName, jobType: row.original.jobType }
                      }}
                      passHref
                    >
                    <ChevronRight />
                    </Link> */}
                </TableRow>
                
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
