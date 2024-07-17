
"use client"
import { useState, useEffect } from "react";
import MapInstance from "@/components/Map";
import { DataTable } from "@/components/Datatable";
import { Input } from "@/components/ui/input"
import { PolesData } from "@/components/PolesData";
import { UploadFile } from "@/components/Upload";
import { Badge } from "@/components/ui/badge"
import Toolbar from "@/components/Toolbar";
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
import { render } from "react-dom";


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


export default function App({params, searchParams}: any) {
  const {id, name, companyName, jobType} = searchParams
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [page, setPage] = useState('')
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const renderComponent = () => {
    if (page === 'poles') {
      return <PolesData />
    }

    return <UploadFile id={id} name={name}/>
  }
return (
  <div className="flex min-h-screen min-w-screen">
    <div className="flex flex-col w-full">
      <div className="flex h-full">
        {/* <Sidebar /> */}
        <aside className="left-0 hidden w-14 flex-col border-r bg-primary-foreground text-secondary sm:flex">
          <nav className="flex flex-col items-center">
            <Link
              href='/'
              // onClick={handleBackToHome}
              className={`flex h-12 w-14 cursor-pointer items-center justify-center text-primary text-muted-foreground transition-colors`}
            >
              <LandPlot strokeWidth={1.55} className='text-blue-500'/>
            </Link>
            <TooltipProvider
              delayDuration={300} skipDelayDuration={0}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => setPage('folder')}
                    className={`flex h-12 w-14 cursor-pointer items-center justify-center text-primary text-muted-foreground transition-colors`}
                  >
                    <FolderOpen strokeWidth={2} className="h-5 w-5"/>
                  </div>
                </TooltipTrigger>
                {/* {selectedRow ? (
                  <TooltipContent side="right">Folder</TooltipContent>
                ) : (
                  <TooltipContent side="right">Select job</TooltipContent>
                )} */}
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider
              delayDuration={300} skipDelayDuration={0}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex h-12 w-14 cursor-pointer items-center justify-center text-primary text-muted-foreground transition-colors`}
                  >
                    <UtilityPole strokeWidth={1.5} className='h-5 w-5' />
                  </div>
                </TooltipTrigger>
                {/* {selectedRow ? (
                  <TooltipContent side="right">Pole list</TooltipContent>
                ) : (
                  <TooltipContent side="right">Select job</TooltipContent>
                )} */}
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider
              delayDuration={300} skipDelayDuration={0}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className={`flex h-12 w-14 cursor-pointer items-center justify-center text-primary text-muted-foreground transition-colors`}
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
                    className={`flex h-12 w-14 cursor-pointer items-center justify-center text-primary text-muted-foreground transition-colors`}
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
                    className={`flex h-12 w-14 cursor-pointer items-center justify-center text-primary text-muted-foreground transition-colors`}
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
                    className={`flex h-12 w-14 cursor-pointer items-center justify-center text-primary text-muted-foreground transition-colors`}
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
          {/* {selectedRow ? (
            <>
              <Badge variant="outline" className="ml-4 mt-2 text-xl tracking-wide w-fit">{selectedRow.original.jobName}</Badge>
                {selectedJob && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-600">Selected File:</p>
                    <p className="text-lg">{selectedJob.fileName}</p>
                    {/* Add any additional file details as needed */}
                  {/* </div>
                )}
            </>
            ) : (
              <Badge variant="outline" className="ml-4 mt-2 text-xl tracking-wide w-fit"><span className="text-lg opacity-50 tracking-wide">No Job Selected</span></Badge>
            )
          } */} 
          {renderComponent()}
        </div>
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
        <Toolbar />
      </div>
    </div>
  </div>
)

}