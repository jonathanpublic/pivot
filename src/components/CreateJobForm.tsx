"use client"
import { useState } from 'react';
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

const CreateJobForm = () => {
  const [jobName, setJobName] = useState('');
  const [company, setCompany] = useState('');
  const [jobType, setJobType] = useState('');

  const handleCreateJob = async (e: any) => {
      e.preventDefault()
      try {
        const jobsRef = ref(database, "/");
        push(jobsRef, {
            name: jobName,
            jobName: jobName,
            companyName: company,
            jobType: jobType,
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
    } catch (error) {
      console.error('Error creating job:', error);
    }
  }

  return (
    <Sheet>
      <SheetTrigger className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'>Create Job</SheetTrigger>
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

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Create Job
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateJobForm;
