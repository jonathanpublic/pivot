"use client"
import { useState } from 'react';
import Link from 'next/link';

import {
  Home,
  LandPlot,
  LineChart,
  Package,
  Package2,
  Map,
  Settings,
  SquarePlus,
} from "lucide-react"

export default function Sidebar () {
  const [showJobCreateTool, setShowJobCreateTool] = useState(false);

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full min-w-72 max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <LandPlot strokeWidth={1.55} className='text-blue-500'/>
            {/* <Package2 className="h-6 w-6 text-blue-700" /> */}
            <span className="spacing-2">Pivot</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              onClick={() => setShowJobCreateTool(true)}
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/map"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Map className="h-4 w-4" />
              Map 
            </Link>
            <Link
              href="/jobs"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Package className="h-4 w-4" />
              Jobs
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}