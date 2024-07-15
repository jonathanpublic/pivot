"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  SunMoon,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  Map,
  SquarePlus,
  Settings
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark'); // Add 'dark' class to <html>
    } else {
      htmlElement.classList.remove('dark'); // Remove 'dark' class from <html>
    }
  }, [isDarkMode]); 
  // const toggleDarkMode = () => {
  //   setIsDarkMode(prevMode => !prevMode);
  // };
  // document.documentElement.classList.toggle('dark', isDarkMode);
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode); // Toggle the state between true and false
  };
  return (
  
    <header className="flex h-24 items-center border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
     
        
    {/* Left section with search and settings */}
    {/* <div className="flex flex-1 items-center mr-30">
      <form className="relative w-full">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search jobs..."
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
          />
        </div>
      </form>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div> */}
    
    {/* Center section (empty flex-1 to distribute remaining space evenly) */}
    
  </header>

  //   <div className="flex flex-col w-full ml-10">
  //     <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        
  //       <div className="flex">
  //         <form>
  //           <div className="">
  //             <Search className="absolute left-2.5 top-2.5 h-4 w-24 text-muted-foreground" />
  //             <Input
  //               type="search"
  //               placeholder="Search jobs..."
  //               className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
  //             />
  //           </div>
  //         </form>
  //         <TooltipProvider>
  //         <Tooltip>
  //           <TooltipTrigger asChild>
  //             <Link
  //               href="#"
  //               className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
  //             >
  //               <Settings className="h-5 w-5" />
  //               <span className="sr-only">Settings</span>
  //             </Link>
  //           </TooltipTrigger>
  //           <TooltipContent side="right">Settings</TooltipContent>
  //         </Tooltip>
  //         </TooltipProvider>
  //       </div>
  //       <div className="w-full flex-1">
  //         <form>
  //           <div className="relative">
  //             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
  //             <Input
  //               type="search"
  //               placeholder="Search jobs..."
  //               className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
  //             />
  //           </div>
  //         </form>
          
  //       </div>
  //       <div>
        
  //       <SunMoon onClick={() => toggleDarkMode()} strokeWidth={1.25} className='cursor-pointer'/>
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="outline" size="icon" className="rounded-full">
  //             <CircleUser className="h-5 w-5" />
  //             <span className="sr-only">Toggle user menu</span>
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>My Account</DropdownMenuLabel>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>Settings</DropdownMenuItem>
  //           <DropdownMenuItem>Support</DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>Logout</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //       </div>
  //     </header>
  //   </div>
  )
}