// pages/app/map/[id].tsx
"use client"
import { useState, useEffect } from "react";
import Toolbar from "@/components/Toolbar";
import MapInstance from "@/components/Map";
import { DataTable } from "@/components/Datatable";
import { Input } from "@/components/ui/input"
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
  CircleUser,
} from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type Job = {
  id: string
  companyName: string
  name: string
  jobType: string
  // status: "pending" | "processing" | "success" | "failed"
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
  const [page, setPage] = useState<string>('jobs')
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);

  const renderComponent = () => {
    if (page === 'folder' && selectedRow) {
      return <UploadFile id={selectedRow.original.id}/>
    } else if (page === 'folder') {
      setPage('jobs')
    } 
    
    return <DataTable setSelectedRow={setSelectedRow} selectedRow={selectedRow}/>
  }
  useEffect(() => {
  console.log(selectedRow)
  }, [selectedRow])

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
    setPage('jobs')
    setSelectedRow(null)
  }
  
  return (
    <div className="flex min-h-screen min-w-screen">
      <div className="flex flex-col w-full">
        <div className="flex h-full">
          {/* <Sidebar /> */}
          <aside className="left-0 hidden w-14 flex-col border-r bg-primary text-secondary sm:flex">
            <nav className="flex flex-col items-center">
              <div
                onClick={handleBackToHome}
                className="flex h-12 w-full cursor-pointer items-center justify-center  text-primary rounded-l-md text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"

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
                      className="flex h-12 w-full cursor-pointer items-center justify-center bg-secondary text-primary rounded-l-md text-muted-foreground transition-colors hover:text-primary"
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
                      className="flex h-12 w-full cursor-pointer items-center justify-center text-primary rounded-l-md text-muted-foreground text-secondary transition-colors hover:bg-secondary hover:text-primary"
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
                      className="flex h-12 w-full cursor-pointer items-center justify-center text-primary rounded-l-md text-muted-foreground text-secondary transition-colors hover:bg-secondary hover:text-primary"
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
                      className="flex h-12 w-full cursor-pointer items-center justify-center text-primary rounded-l-md text-muted-foreground text-secondary transition-colors hover:bg-secondary hover:text-primary"
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
                      className="flex h-12 w-full cursor-pointer items-center justify-center text-primary rounded-l-md text-muted-foreground text-secondary transition-colors hover:bg-secondary hover:text-primary"
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
          <div className="flex flex-col w-1/2 border-r-2 border-black border-opacity-10">
            {selectedRow ? 
              (
                <Badge variant="outline" className="ml-4 mt-2 text-xl tracking-wide w-fit">{selectedRow.original.jobName}</Badge>
              ) : (
                <Badge variant="outline" className="ml-4 mt-2 text-xl tracking-wide w-fit"><span className="text-lg opacity-50 tracking-wide">No Job Selected</span></Badge>
              )
            }
            {renderComponent()}
            {/* <SelectComponent /> */}
            {/* <Tabs defaultValue="jobs" className="">
              <TabsList>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              <TabsContent value="jobs">{<DataTable />}</TabsContent>
              <TabsContent value="files">{<UploadFile id={id as string}/>}</TabsContent>
            </Tabs> */}
          </div>
          <div className="flex flex-col border-l-black w-full">
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
          <Toolbar />
        </div>
      </div>
    </div>
  )
}

