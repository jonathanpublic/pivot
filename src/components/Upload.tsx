"use client"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from 'lucide-react';
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"

interface JobProps {
  id: string;
  name: string;
  setSelectedJob: (job: any) => void; // Adjust the type as per your requirements
  selectedJob: any | null; // Adjust the type as per your requirements
}

interface UploadedFile {
  file: File;
  uploadTime: string;
  fileName: string; // Add name property
  fileSize: number; // Add size property
}

export function UploadFile({id, name, setSelectedJob, selectedJob, setPage}: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);



  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [alertTitle, setAlertTitle] = useState<string>('')
  const [showAlertReplaceFile, setShowAlertReplaceFile] = useState(false)

  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(13)
  
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`http://localhost:8080/lasFiles/${id}`);
        const data = await response.json()
        setUploadedFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    fetchFiles();
  }, []); 

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleShowCancelAlert = () => {
    setShowAlert(true);
    setAlertTitle('Hey you!')
    setAlertMessage("There is not getting out of submitting your data!")
  
    setTimeout(() => {
      setShowAlert(false); 
    }, 10000);
  };

  const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const format = event.target.value;
    setSelectedFormat(format);
  };

  const resetFormFields = () => {
    setSelectedFile(null);
    setSelectedFormat('');
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
      formData.append('name', selectedFile.name);
      formData.append('size', selectedFile.size.toString());
    } else {
      alert("failed to upload las")
      return;
    }
    // formData.append('format', selectedFormat);

    try {
      const response = await fetch(`http://localhost:8080/uploadLas/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 409) {
          setShowAlertReplaceFile(true)
          setAlertTitle("Las file already exists")
          setAlertMessage("Would you like to replace this file?")
        } else {
          throw new Error('Failed to upload file.');
        }
      } else {
        resetFormFields();
        addFileToUploadedFiles();
      }
      console.log('File uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading file:', error.message);
      resetFormFields();
    }
  };

  const addFileToUploadedFiles = () => {
    if (selectedFile) {
      const currentdate = new Date();
      const uploadtime = `${currentdate.toLocaleDateString()} ${currentdate.toLocaleTimeString()}`;
      const uploadedfile: UploadedFile = {
        file: selectedFile,
        uploadTime: uploadtime,
        fileName: selectedFile.name, 
        fileSize: selectedFile.size,
      };
      setUploadedFiles(prevfiles => [...prevfiles, uploadedfile]);
      setSelectedFile(null);
    }
  }

  const handleReplaceFile = async () => {
    setShowAlertReplaceFile(false);
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    } else {
      alert("failed to upload las")
      return;
    }
    try {
      const url = `http://localhost:8080/replaceLas/${id}`;
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to replace file.');
      } else {
        resetFormFields();
        const updatedFiles = [...uploadedFiles];
        const fileIndex = updatedFiles.findIndex(file => file.fileName === selectedFile.name);

        if (fileIndex !== -1) {
          // Replace the existing file metadata with new metadata
          const currentdate = new Date();
          const uploadtime = `${currentdate.toLocaleDateString()} ${currentdate.toLocaleTimeString()}`;
          updatedFiles[fileIndex] = {
            file: selectedFile,
            uploadTime: uploadtime,
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
          };

          setUploadedFiles(updatedFiles);
          console.log('File replaced successfully');
        } else {
          console.error('File to replace not found in state.');
        }
        console.log('File replaced successfully');
      }
    } catch (error: any) {
      console.error('Error replacing file:', error.message);
      resetFormFields();
    }
  };

  const handleCanceleFileReplacement = () => {
    setShowAlertReplaceFile(false)
    resetFormFields();
  }

  const handleDeleteFile = async (fileToDelete: UploadedFile) => {
    try {
      // Delete file from server
      const updatedFiles = uploadedFiles.filter(file => file.fileName !== fileToDelete.fileName);
      setUploadedFiles(updatedFiles);

      const response = await fetch(`http://localhost:8080/deleteFile/${id}/${fileToDelete.fileName}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file from server.');
      }

      console.log('File deleted successfully');
    } catch (error: any) {
      console.error('Error deleting file:', error.message);
    }
  };

  const bytesToGB = (bytes: number): number => {
    if (bytes === 0) return 0;
  
    const GB = 1 << 30; // 2^30 bytes = 1 GB
    return bytes / GB;
  };
  
	return (
    <div className="flex justify-center h-full">

      { showProgress ? (
        <>
          <div className='mb-4'>Please wait..</div>
          <Progress value={progress} className="w-[60%]" />
        </>
      ) : (
        <div className='flex flex-col items-center w-full gap-10'>
          {!showAlertReplaceFile && (
            <>
            <Table className="mt-4">
              <TableCaption>A list of your files for {name}.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedFiles && uploadedFiles.map((file, index) => (
                  <TableRow key={index} onClick={() => setSelectedJob(file)} onDoubleClick={() => setPage('poles')}
                    className={`hover:bg-primary hover:text-secondary cursor-pointer ${selectedJob === file ? 'bg-primary text-secondary' : ''}`}>
                    <TableCell className="font-medium">{file.fileName}</TableCell>
                    <TableCell>{bytesToGB(file.fileSize).toFixed(2)} GB</TableCell>
                    <TableCell>{file.uploadTime}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel className="border-b">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteFile(file)} className="cursor-pointer">Delete</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">More</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Card className="mt-20 w-[350px]">
              <CardHeader>
                <CardTitle>Upload File</CardTitle>
                <CardDescription>Start your project with one click.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5 ">
                      <Label htmlFor="file">File</Label>
                      <Input onChange={handleFileChange} id="file" type="file" className='cursor-pointer' placeholder=''/>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="framework">Format</Label>
                      <Select>
                        <SelectTrigger id="file-format">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem className="cursor-pointer border-b" value="las">.las</SelectItem>
                          <SelectItem className="cursor-pointer border-b" value="laz">.laz</SelectItem>
                          <SelectItem className="cursor-pointer border-b" value="pcd">.pcd</SelectItem>
                          <SelectItem value="ply">.ply</SelectItem>
                        </SelectContent>
                      </Select>
                      {
                        selectedFile && (
                          <div className='mt-4'>
                            <p>Selected file: {selectedFile.name}</p>
                            <p>File size: {selectedFile.size} bytes</p>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleShowCancelAlert}>Cancel</Button>
                  <Button type="submit">Upload</Button>
                </CardFooter>
              </form>
            </Card>
            </>
          )}
          {showAlert && (
            <Alert className='w-[350px]'>
              <Terminal className="h-4 w-4" />
              <AlertTitle>{alertTitle}</AlertTitle>
              <AlertDescription>
                {alertMessage}
              </AlertDescription>
            </Alert>
          )}

          {showAlertReplaceFile && (
            <Alert className='w-[350px]'>
              <Terminal className="h-4 w-4" />
              <AlertTitle>{alertTitle}</AlertTitle>
              <AlertDescription>
                {alertMessage}
              </AlertDescription>
              <div className='flex justify-between mt-4'>
                <Button variant="outline" className='hover:bg-primary hover:text-secondary' onClick={handleCanceleFileReplacement}>No</Button>
                <Button className='hover:bg-secondary hover:text-primary hover:border-black border border-black' onClick={handleReplaceFile} >Yes</Button>
              </div>
            </Alert>
          )}
        </div>
      )}
    </div>
	)
}