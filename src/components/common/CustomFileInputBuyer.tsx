import React from 'react'

const CustomFileInputBuyer = ({ handleFile }) => {
  const handleFileChange = (event: any) => {
    const file = event.target.files[0]
    console.log(file)
    handleFile([file])
  }

  return (
    <div className="w-full h-32 p-8 bg-transparent border border-[#707070] border-dashed cursor-pointer flex items-center justify-center">
      <div className="flex items-center justify-center h-full w-full">
        <label className="flex items-center justify-center w-full h-full">
          <input type="file" hidden onChange={handleFileChange} />
          <p className="text-sm text-[#707070]">
            Upload a Pdf, JPEG or PNG file here
          </p>
        </label>
      </div>
    </div>
  )
}

export { CustomFileInputBuyer }
