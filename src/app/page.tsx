// pages/app/map/[id].tsx
"use client"
import { useState, useEffect } from "react";
import Toolbar from "@/components/Toolbar";
import MapInstance from "@/components/Map";
import { DataTable } from "@/components/Datatable";
import { Input } from "@/components/ui/input"
import { PolesData } from "@/components/PolesData";
import { UploadFile } from "@/components/Upload";
import { Badge } from "@/components/ui/badge"
import Link from 'next/link';
import {
  UtilityPole,
  FolderOpen,
  LineChart,
  Package,
  Users2,
  LandPlot,
  SunMoon,
  Search,
  Terminal,
  CircleUser,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


export type Job = {
  fileSize: string
  fileName: string
  uploadTime: string
}

interface Row {
  id: string;
  original: {
    id: string;
    companyName: string;
    jobName: string;
    jobType: string;
    name: string;
  };
}

export default function page() {
  const [page, setPage] = useState<string | null>('home')
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    if (selectedRow !== null) {
      localStorage.setItem('selectedRow', JSON.stringify(selectedRow));
    } else {
      localStorage.removeItem('selectedRow');
    }
  }, [selectedRow]);

  useEffect(() => {
    const storedRow = localStorage.getItem('selectedRow');
    if (storedRow) {
      const parsedRow = JSON.parse(storedRow);
      setSelectedRow(parsedRow);
    }
  }, []);


  useEffect(() => {
    if (page !== null) {
      localStorage.setItem('currentPage', page);
    }
  }, [page])

  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    console.log(savedPage)
    setPage(savedPage || 'home');
  }, []); 


  const renderComponent = () => {
    if (page === 'home') {
      return <></>
    }

    if (page === 'folder' && selectedRow) {
      return <UploadFile id={selectedRow.original.id} name={selectedRow.original.jobName} setSelectedJob={setSelectedJob} selectedJob={selectedJob} setPage={setPage}/>
    } else if (page === 'folder') {
      setPage('home')
    } 

    if (page === 'poles') {
      return <PolesData />
    }
    
    return <DataTable setSelectedRow={setSelectedRow} selectedRow={selectedRow} setPage={setPage}/>
  }

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [isDarkMode]); 

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleBackToHome = () => {
    // do clean up
    setSelectedRow(null)
    setPage('home')
  }
  
  return (
    <div className="flex min-h-screen min-w-screen">
      <div className="flex flex-col w-full">
        <div className="flex h-full">
          {/* <Sidebar /> */}
          <aside className="left-0 hidden w-14 flex-col border-r bg-primary-foreground text-secondary sm:flex">
            <nav className="flex flex-col items-center">
              <div
                onClick={handleBackToHome}
                className={`flex h-12 w-14 cursor-pointer items-center justify-center text-primary text-muted-foreground transition-colors ${page === 'home' ? 'bg-primary hover:text-secondary' : 'hover:bg-primary hover:text-secondary'}`}
              >
                <LandPlot strokeWidth={1.55} className='text-blue-500'/>
              </div>
              <TooltipProvider
                delayDuration={300} skipDelayDuration={0}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => setPage('jobs')}
                      className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-l-md text-muted-foreground transition-colors ${page === 'jobs' ? 'bg-primary text-secondary hover:text-secondary' : 'hover:text-primary'}`}
                    >
                      <Package className="h-5 w-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">Jobs</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider
                delayDuration={300} skipDelayDuration={0}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => setPage('folder')}
                      className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-l-md text-muted-foreground transition-colors ${page === 'folder' ? 'bg-primary text-secondary hover:text-secondary' : 'hover:text-primary'}`}
                    >
                      <FolderOpen strokeWidth={2} className="h-5 w-5"/>
                    </div>
                  </TooltipTrigger>
                  {selectedRow ? (
                    <TooltipContent side="right">Folder</TooltipContent>
                  ) : (
                    <TooltipContent side="right">Select job</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider
                delayDuration={300} skipDelayDuration={0}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => setPage('poles')}
                      className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-l-md text-muted-foreground transition-colors ${page === 'poles' ? 'bg-primary text-secondary hover:text-secondary' : 'hover:text-primary'}`}
                    >
                      <UtilityPole strokeWidth={1.5} className='h-5 w-5' />
                    </div>
                  </TooltipTrigger>
                  {selectedRow ? (
                    <TooltipContent side="right">Pole list</TooltipContent>
                  ) : (
                    <TooltipContent side="right">Select job</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider
                delayDuration={300} skipDelayDuration={0}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="#"
                      className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-l-md text-muted-foreground transition-colors ${page === 'customers' ? 'bg-primary text-secondary hover:text-secondary' : 'hover:text-primary'}`}
                    >
                      <Users2 className="h-5 w-5" />
                      <span className="sr-only">Customers</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Customers</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider
                delayDuration={300} skipDelayDuration={0}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="#"
                      className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-l-md text-muted-foreground transition-colors ${page === 'analytics' ? 'bg-primary text-secondary hover:text-secondary' : 'hover:text-primary'}`}
                    >
                      <LineChart className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Analytics</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
              <TooltipProvider
                delayDuration={300} skipDelayDuration={0}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="#"
                      className="flex h-9 w-full cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary md:h-8 md:w-8"
                    >
                      <SunMoon onClick={() => toggleDarkMode()} strokeWidth={1.25} className='cursor-pointer'/>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Theme</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider
                delayDuration={300} skipDelayDuration={0}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="#"
                      className="flex h-9 w-full cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary md:h-8 md:w-8"
                    >
                        <Button variant="outline" size="icon" className="rounded-full">
                    <CircleUser className="h-5 w-5" />
                        </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
          </aside>
          {page !== 'home' && (
            <div className="flex flex-col w-1/2 border-r-2 border-black border-opacity-10">
              {selectedRow ? (
                <div className="flex">
                  <div className="ml-4 flex items-center">
                    <p className="text-sm font-medium text-gray-600">Selected job:</p>
                  <Badge variant="outline" className="ml-4 mt-2 text-xl tracking-wide w-fit">{selectedRow.original.jobName}</Badge>
                  </div>
                    {selectedJob && (
                      <div className="ml-4 flex items-center">
                        <p className="text-sm font-medium text-gray-600">Selected File:</p>
                        <Badge variant="outline" className="ml-4 mt-2 text-xl tracking-wide w-fit">{selectedJob.fileName}</Badge>
                        {/* Add any additional file details as needed */}
                      </div>
                    )}
                </div>
                ) : (
                  <Badge variant="outline" className="ml-4 mt-2 text-xl tracking-wide w-fit"><span className="text-lg opacity-50 tracking-wide">No Job Selected</span></Badge>
                )
              }
              {renderComponent()}
            </div>
          )}
          <div className="flex flex-col border-l-black w-full">
            <div className="h-12 flex justify-center items-center">
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
          {selectedJob && (
            <Toolbar />
          )}
        </div>
      </div>
    </div>
  )
}

