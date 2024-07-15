"use client"
import Image from "next/image"


import { useState, useEffect, useContext} from 'react';
import { ref, onValue, get } from 'firebase/database'
import { database}  from '@/firebase/firebase';
import CreateJobForm from '@/components/CreateJobForm';
import { ScrollArea } from "@/components/ui/scroll-area"
import SelectComponent from '@/components/SelectCompany';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, Upload, ChevronRight } from "lucide-react"
import MapInstance from '@/components/Map';
import Sidebar from "@/components/Sidebar";
import  { DataTable } from "@/components/Datatable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
 


interface Job {
  id: string,
  name: string,
  companyName: string,
  jobType: string,
  timestamp: number,
}
import Link from "next/link"
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"

import Navbar from "@/components/Navbar"

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [jobTypeFilter, setJobTypeFilter] = useState('all')
  const [companyFilter, setCompanyFilter] = useState('all');
  const [showAlert, setShowAlert] = useState(false);

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
              setFilteredJobs(jobsArray);
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
  return (
    <>
      <div className="flex h-full">
      <DataTable />
      {/* <div className="flex flex-col">  */}
        
        {/* <div className="flex items-center pl-10">
          {showAlert && (
            <Alert className='w-1/4'>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                Las file must first be uploaded before start the job!
              </AlertDescription>
            </Alert>
          )}
          <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
            <SelectTrigger className="w-[180px] ml-6 bg-secondary text-primary">
              <SelectValue placeholder="Job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                Show all
              </SelectItem>
              <SelectItem value="vegetation">
                Vegetation
              </SelectItem>
              <SelectItem value="make-ready">
                Make-ready
              </SelectItem>
              <SelectItem value="inspection">
                Inspection
              </SelectItem>
            </SelectContent>
          </Select>
          <SelectComponent jobs={jobs} companyFilter={companyFilter} setCompanyFilter={setCompanyFilter}/>
          <CreateJobForm />
        </div>
        <ScrollArea className='mt-2 h-[860px]'>
          <div className="mt-4 h-full pl-10 pr-10 w-full ">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 pl-10 pr-10 lg:grid-cols-3 xl:grid-cols-4">
            {filteredJobs.map((job, index) => (
              
              <Card key={job.id} className="cursor-pointer hover:bg-secondary rounded-lg shadow-md p-4">
                <Upload onClick={() => console.log("CLICK")}/>
                <Link
                // onClick={(event) => handleLinkClicked(event, job)}
                  key={index}
                  href={{
                    pathname: `/map/${job.id}`,
                    query: { id: job.id, name: job.name, companyName: job.companyName, jobType: job.jobType }
                  }}
                  passHref
                >
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                </Link>
                <CardHeader className="text-lg font-semibold">{job.name}</CardHeader>
                <CardContent className="text-sm text-gray-500">{job.companyName}</CardContent>
                <CardContent className="text-sm text-gray-500">{job.jobType}</CardContent>
                
              </Card>
            ))}
            </div>
          </div>
        </ScrollArea>
      </div> */}

<div className="flex flex-col w-full">
  <div className="h-14 flex justify-center items-center">
    <div className="w-1/3">
    <form className="">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search locations..."
          className="w-full appearance-none bg-background pl-8 shadow-none md:w-full lg:w-full"
        />
      </div>
    </form>
    </div>
  </div>
  <MapInstance />
</div>
    </div>

  </>

  )
}