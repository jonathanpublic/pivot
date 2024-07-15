"use client"
import { useState, useEffect } from 'react';
import { database } from '@/firebase/firebase';
import { ref, push } from 'firebase/database';

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"


const CreateJobForm = () => {
  const [jobName, setJobName] = useState('');
  const [company, setCompany] = useState('');
  const [jobType, setJobType] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast()


  const openSheet = () => {
    setIsOpen(true);
  };

  const closeSheet = () => {
    setIsOpen(false);
  };

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        const jobsRef = ref(database, "/");
        push(jobsRef, {
          name: jobName,
          jobName: jobName,
          companyName: company,
          jobType: jobType,
          lidarUploaded: false,
          timestamp: Date.now(),
        }).then(() => {
            console.log('Job created successfully');
            setJobName('');
        }).catch((error) => {
            console.error('Error creating job:', error);
        });
        setJobName('');
        setCompany('');
        setJobType('');
        closeSheet();
    } catch (error) {
      console.error('Error creating job:', error);
    }
  }

  const formatDateDescription = () => {
    const timestamp = Date.now();
    const date = new Date(timestamp);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();
  
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? 0 + minutes : minutes;
  
    const formattedDescription = `${dayOfWeek}, ${month} ${dayOfMonth}, ${year} at ${hours}:${minutes} ${ampm}`;
    return formattedDescription;
  };

  return (
    <Sheet>
      <SheetTrigger onClick={openSheet} className='bg-secondary border text-primary right-0 ml-auto mr-12 mt-2 px-4 py-2 rounded-lg hover:bg-primary hover:text-secondary transition-colors duration-300 ease-in-out'>Create Job</SheetTrigger>
      { isOpen && (
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create New Job</SheetTitle>
            <SheetDescription>
              Fill out the form below to create a new job.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleCreateJob}>
            <div className="flex flex-col gap-4">
              <label htmlFor="jobName" className="font-semibold">Job Name</label>
              <input
                type="text"
                id="jobName"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
                required
              />

              <label htmlFor="company" className="font-semibold">Company</label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
                required
              />

              <label htmlFor="jobType" className="font-semibold">Job Type</label>
              <select
                id="jobType"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Job Type</option>
                <option value="vegetation">Vegetation</option>
                <option value="make-ready">Make-Ready</option>
                <option value="inspection">Inspection</option>
              </select>

              <Button onClick={() =>  {
                toast({
                  title: "Success: New job created",
                  description: `${formatDateDescription()}`,
                })
              }}
                type="submit" className="bg-primary text-secondary px-4 py-2 rounded-lg hover:bg-secondary hover:text-primary">
                Create Job
              </Button>
            </div>
          </form>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default CreateJobForm;
