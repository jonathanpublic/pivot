"use client"
import { useState, useEffect, useContext} from 'react';
import { ref, onValue } from 'firebase/database'
import { database}  from '@/firebase/firebase';
import CreateJobForm from '@/components/CreateJobForm';
import { useDarkMode } from '../DarkModeProvider';
import { CarouselPlugin } from '@/components/CarousolPlugin';
import { ScrollArea } from "@/components/ui/scroll-area"
import SelectComponent from '@/components/SelectCompany';
// import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
 
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Job {
  id: string,
  name: string,
  companyName: string,
  jobType: string,
  timestamp: number,
}
  
export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [jobTypeFilter, setJobTypeFilter] = useState('all')
  const [companyFilter, setCompanyFilter] = useState('all');


  const [searchTerm, setSearchTerm] = useState('');
  const [showJobModal, setShowJobModal] = useState(false)
  const { isDarkMode } = useDarkMode(); // Access dark mode state


  console.log(isDarkMode)
  const handleGoToJob = () => {

  }

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

  const handleFilterJobs = () => {
    const lowercaseJobTypeFilter = jobTypeFilter.toLowerCase();
    const lowercaseCompanyFilter = companyFilter.toLowerCase();
  
    const filtered = jobs.filter(job => {
      const jobTypeMatch = lowercaseJobTypeFilter === 'all' || job.jobType.toLowerCase() === lowercaseJobTypeFilter;
      const companyMatch = lowercaseCompanyFilter === 'all' || job.companyName.toLowerCase() === lowercaseCompanyFilter;
      return jobTypeMatch && companyMatch;
    });
  
    setFilteredJobs(filtered);
  };
  
  useEffect(() => {
    handleFilterJobs();
  }, [jobTypeFilter, companyFilter, jobs]);

  return (
    <>
    <div className="flex items-center pl-10 pt-4">
    <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
      <SelectTrigger className="w-[180px] ml-6 bg-secondary text-primary">
        <SelectValue placeholder="Job type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          Show all
        </SelectItem>
        <SelectItem value="vegetation">
          Vegetation
        </SelectItem>
        <SelectItem value="make-ready">
          Make-ready
        </SelectItem>
        <SelectItem value="inspection">
          Inspection
        </SelectItem>
      </SelectContent>
    </Select>
    <SelectComponent jobs={jobs} companyFilter={companyFilter} setCompanyFilter={setCompanyFilter}/>
    <CreateJobForm />
    </div>
    <ScrollArea className='mt-2 h-[700px]'>
    <div className="mt-4 h-full pl-10 pr-10 w-full ">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 pl-10 pr-10 lg:grid-cols-3 xl:grid-cols-4">
      {filteredJobs.map((job, index) => (
        <Card key={job.id} onClick={handleGoToJob} className="cursor-pointer hover:bg-secondary rounded-lg shadow-md p-4">
          <CardHeader className="text-lg font-semibold">{job.name}</CardHeader>
          <CardContent className="text-sm text-gray-500">{job.companyName}</CardContent>
          <CardContent className="text-sm text-gray-500">{job.jobType}</CardContent>
          {/* Add more job details as needed */}
        </Card>
      ))}
      </div>
    </div></ScrollArea></>
  );
  // return (
  //   <main className="flex flex-col">
  //     <div className="flex items-center mb-4">
  //       <CreateJobForm />
  //     </div>
  //     <Carousel
  //       opts={{
  //         align: "start",
  //       }}
  //       className="w-full max-w-sm"
  //       >
  //     {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pl-10 pr-10 lg:grid-cols-3 xl:grid-cols-4"> */}
  //     <CarouselContent>
  //       {jobs.map((job) => (
  //         <Card  key={job.id} onClick={handleGoToJob} className="cursor-pointer rounded-lg shadow-md p-4">
  //           <CardHeader className="text-lg font-semibold">{job.name}</CardHeader>
  //           <CardContent className="text-sm text-gray-500">{job.companyName as string}</CardContent>
  //           <CardContent className="text-sm text-gray-500">{job.jobType}</CardContent>
  //           {/* Add more job details as needed */}
  //         </Card>
  //       ))}
  //     {/* </div> */}
  //     </CarouselContent>
  //     </Carousel>
  //     {/* Modal for adding/editing jobs */}
  //     {/* {showJobModal && <CreateJobForm onClose={() => setShowJobModal(false)} />} */}
  //   </main>
  // )
}