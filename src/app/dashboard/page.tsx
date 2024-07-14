"use client"
import { useState, useEffect, useContext} from 'react';
import { ref, onValue } from 'firebase/database'
import { database}  from '@/firebase/firebase';
import CreateJobForm from '@/components/CreateJobForm';
import { useDarkMode } from '../DarkModeProvider';
import { CarouselPlugin } from '@/components/CarousolPlugin';
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

  return (
    <div className="mt-4 h-full pl-10 pr-10 w-full ">
       <div className="flex items-center mb-4">
         <CreateJobForm />
       </div>
       <Carousel
        opts={{
          align: "start",
          slidesToScroll: 10, // Number of slides to scroll per interaction
          loop: true, // Enable infinite loop
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 "
      >
        <CarouselContent>
          {jobs.map((job, index) => (
            <CarouselItem key={index} >
              <div onClick={handleGoToJob} className="cursor-pointer w-full max-w-xs rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold">{job.name}</h3>
                <p className="text-sm text-gray-500">{job.companyName}</p>
                <p className="text-sm text-gray-500">{job.jobType}</p>
                {/* Add more job details as needed */}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="right-0" />
        <CarouselPrevious className="left-0" />
      </Carousel>
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 10

        }}
        className="grid overflow-hidden"
      >
        <CarouselContent className="flex">
          {jobs.map((job, index) => (
            <CarouselItem key={index} className="flex  flex-1">
              <Card key={job.id} onClick={handleGoToJob} className="cursor-pointer rounded-lg shadow-md p-4">
                <CardHeader className="text-lg font-semibold">{job.name}</CardHeader>
                <CardContent className="text-sm text-gray-500">{job.companyName}</CardContent>
                <CardContent className="text-sm text-gray-500">{job.jobType}</CardContent>
                {/* Add more job details as needed */}
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />

      </Carousel>
    </div>
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