// pages/app/map/[id].tsx
import Toolbar from "@/components/Toolbar";
import MapInstance from "@/components/Map";
import { DataTable } from "@/components/Datatable";
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import {
  Search,
} from "lucide-react"

interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
export default function page({params, searchParams}: PageProps) {
  const { id, name, companyName, jobType } = searchParams;


  return (
    <div className="flex h-full">
      <div className="flex w-full">
    <div className="h-full fixed bg-red-500 z-50">
    sdfsdfdsfds
  </div>
    <DataTable /></div>
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
  )
}
