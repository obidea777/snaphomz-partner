import React, { useEffect, useState } from 'react'
import { RoundedButton } from '../buttons/RoundedButton'
import { cn } from 'utils/styleUtilities'
import { FileUp } from 'lucide-react'
import { Loader } from '@mantine/core'

export interface FileUploadProps {
  label?: React.ReactNode
  setFile: (file: File | null) => void
  className?: string
  initialFiles?: FileList
  inputClassName?: string
  isLoading?:boolean
}

export const RoundedButtonFileUpload: React.FC<FileUploadProps> = ({
  label,
  setFile,
  className,
  initialFiles,
  inputClassName,
  isLoading=false
}) => {
  const [localFile, setLocalFile] = useState<File | null>(null)

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      // Ensure there's at least one file
      setLocalFile(initialFiles[0]) // Set the first file from initialFiles
    }
  }, [initialFiles])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0] // Take the first file
      setLocalFile(selectedFile) // Update state with the single selected file
      setFile(selectedFile) // Assuming setFile is another state or prop function for handling the file
    }
  }

  return (
    <div
      className={cn(
        'flex justify-center py-2  w-fit flex gap-2 items-center text-md px-6 font-medium bg-white text-black rounded-full  disabled:opacity-75 cursor-pointer border border-orange-500',
        className
      )}>
      {label ? label : null}
      {isLoading ? <Loader size={30} color='orange' /> : <FileUp strokeWidth={1.25} />}

      <div className="mt-1">
        <label className="inline-block">
         
          <input
            type="file"
            multiple
            disabled={isLoading}
            onChange={handleFileChange}
            className="hidden"
          />
        
          <div >Upload</div>
        </label>
      </div>
    </div>
  )
}
