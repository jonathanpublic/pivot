import React, {useState, useEffect} from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Job {
  id: string,
  name: string,
  companyName: string,
  jobType: string,
  timestamp: number,
}
  
interface SelectComponentProps {
  jobs: Job[];
  companyFilter: string;
  setCompanyFilter: React.Dispatch<React.SetStateAction<string>>;
}

const SelectComponent: React.FC<SelectComponentProps> = ({ jobs, companyFilter, setCompanyFilter}) => {
  const [companys, setCompany] = useState<string[]>([]);

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    const formattedCompanies = jobs.map(job => capitalizeFirstLetter(job.companyName.toLowerCase()));
    const uniqueCompanies = Array.from(new Set(formattedCompanies));
    setCompany(uniqueCompanies);
  },[jobs])

  return (
    <Select value={companyFilter} onValueChange={setCompanyFilter}>
      <SelectTrigger className="w-[180px] ml-10 bg-secondary text-primary">
        <SelectValue placeholder="Company" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>Show all</SelectItem>
        {companys.map((jobName, index) => (
            <SelectItem key={index} value={jobName}>
              {jobName}
            </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
