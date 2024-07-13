"use client"
import { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { ref, onValue } from 'firebase/database'
import { database}  from '@/firebase/firebase';
import CreateJobForm from '@/components/CreateJobForm';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Job {
  id: string,
  name: string,
  company: string,
  timestamp: number,
}
  
export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showJobModal, setShowJobModal] = useState(false)


  useEffect(() => {
    const fetchJobNames = async () => {
      try {
        const jobsRef = ref(database);
        console.log(jobsRef)
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
            } else {
              console.log("HERE")
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
    <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <CreateJobForm /> 
          </div>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
          >
            {/* <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no products
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start selling as soon as you add a product.
              </p>
              <Button onClick={() => setShowJobModal(true)} className="mt-4">Add Product</Button>
            </div> */}
          </div>
        </main>
    </div>
  )
}