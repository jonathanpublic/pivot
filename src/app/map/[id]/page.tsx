// pages/app/map/[id].tsx
import Toolbar from "@/components/Toolbar";
import MapInstance from "@/components/Map";

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
    <div className="flex w-full h-full">
    <MapInstance />
    <Toolbar />
    </div>
  )
}
