import React from 'react'

const CustomFileInput = ({ handleFile }) => {
  const handleFileChange = (event: any) => {
    const file = event.target.files[0]
    console.log(file)
    handleFile([file])
  }

  return (
    <div className="w-full h-full bg-white rounded-lg border-2 border-black gap-3 grid border-solid cursor-pointer">
      <div className="flex items-center justify-center">
        <label className="flex items-center justify-center w-full h-full">
          <input type="file" hidden onChange={handleFileChange} />
          <svg
            width="27"
            height="27"
            viewBox="0 0 47 47"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M23.5724 0.694336C21.6583 0.694336 20.1068 2.24584 20.1068 4.15999V20.1019H4.16484C2.25072 20.1019 0.699219 21.6535 0.699219 23.5676C0.699219 25.4818 2.25072 27.0332 4.16484 27.0332H20.1068V42.9752C20.1068 44.8894 21.6583 46.4408 23.5724 46.4408C25.4866 46.4408 27.0381 44.8894 27.0381 42.9752V27.0332H42.98C44.8942 27.0332 46.4457 25.4818 46.4457 23.5676C46.4457 21.6535 44.8942 20.1019 42.98 20.1019H27.0381V4.15999C27.0381 2.24584 25.4866 0.694336 23.5724 0.694336Z"
              fill="black"
            />
          </svg>
        </label>
      </div>
    </div>
  )
}

export { CustomFileInput }
