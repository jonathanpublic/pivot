"use client"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from 'lucide-react';
import { Progress } from "@/components/ui/progress"
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

interface jobId {
  id: string | null
}

export function UploadFile({id}: jobId) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('');

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [alertTitle, setAlertTitle] = useState<string>('')
  const [showAlertReplaceFile, setShowAlertReplaceFile] = useState(false)

  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(13)
  
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
      }
      console.log('File uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading file:', error.message);
      resetFormFields();
    }
  };

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
        console.log('File replaced successfully');
      }
    } catch (error: any) {
      console.error('Error replacing file:', error.message);
      resetFormFields();
    }
  };
	return (
    <div className="flex justify-center h-full mt-4">

      { showProgress ? (
        <>
          <div className='mb-4'>Please wait..</div>
          <Progress value={progress} className="w-[60%]" />
        </>
      ) : (
        <div className='flex flex-col gap-10'>
          {!showAlertReplaceFile && (
            <Card className="w-[350px]">
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
                <Button variant="outline" className='hover:bg-primary hover:text-secondary' onClick={() => setShowAlertReplaceFile(false)}>No</Button>
                <Button className='hover:bg-secondary hover:text-primary hover:border-black border border-black' onClick={handleReplaceFile} >Yes</Button>
              </div>
            </Alert>
          )}
        </div>
      )}
    </div>
	)
}