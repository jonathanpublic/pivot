"use client"

import { useRouter } from 'next/router';
import Link from 'next/link';

import { useState, useEffect } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
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
  name: string
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
    accessorKey: "name",
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
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
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


export function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  
  const [data, setJobs] = useState<Job[]>([]);

  // const handleLinkClicked = async (event: any, job: any) => {
  //   event.preventDefault();
  //   console.log(job.original)
  //   const jobRef = ref(database, `/${job.id}`);
  //   try {
  //     const snapshot = await get(jobRef);
  //     const jobDetails = snapshot.val();
  
  //     console.log("Lidar has been uploaded, navigating to job details");
  
  //     // const router = useRouter();
  //     // router.push(`/map/${job.id}`);
  //   } catch (error) {
  //     console.error('Error fetching job details:', error);
  //   }
  // }

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

  
  // const handleLinkClicked = async(event: any, job: any) => {
  //   event.preventDefault();
  //   const jobRef = ref(database, `/${job.id}`);
  //   try {
  //     const snapshot = await get(jobRef);
  //     const jobDetails = snapshot.val();
  
  //     // if (!jobDetails.lidarUploaded) {
  //     //   console.log("Lidar has not been uploaded for this job");

  //     //   setShowAlert(true); // Set showAlert state to true to display the alert
  //     //   setTimeout(() => {
  //     //     setShowAlert(false);
  //     //   }, 3000); 
  //     //   console.log(showAlert)
  //     //   return;
  //     // }
  
  //     console.log("Lidar has been uploaded, navigating to job details");
  
  //     const router = useRouter();
  //     router.push(`/map/${job.id}`);
  //   } catch (error) {
  //     console.error('Error fetching job details:', error);
  //   }
  // }

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



  return (
    <div className="h-full p-4 w-1/2">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter jobs..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
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
                <Link
               
                    key={row.id}
                    href={{
                      pathname: `/map/${row.original.id}`,
                      query: { id: row.original.id, name: row.original.name, companyName: row.original.companyName, jobType: row.original.jobType }
                    }}
                    passHref
                  >
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-primary text-primary hover:text-secondary bg-secondary"
                  data-state={row.getIsSelected() && "selected"}
                >
                  
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                 
                </TableRow>
                </Link>
                
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
