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