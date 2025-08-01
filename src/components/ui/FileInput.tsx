import React from 'react';

type CustomFile = {
  name: string;
  url: string;
  thumbNail: string;
  documentType: string;
};

type FileInputProps = {
  label: string;
  file: File | CustomFile | null;
  onFileChange: (file: File) => void;
};

export const FileInput: React.FC<FileInputProps> = ({
  label,
  file,
  onFileChange,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileChange(event.target.files[0]);
    }
  };

  return (
    <label className='mb-8 block'>
      <span className='mb-3 block text-xl font-medium text-[#020202]'>
        {label}
      </span>
      <section className='flex h-[5.25rem] cursor-pointer items-center overflow-hidden rounded-[1.875rem]'>
        <input type='file' hidden onChange={handleFileChange} />
        <input
          value={(file as File)?.name || ''}
          disabled={!file}
          type='text'
          name='file-name'
          className='mt-1 flex h-[4.75rem] w-[12.18rem] items-center justify-center border border-[#707070] bg-black px-3 py-2 text-center text-[1.5rem] placeholder-white focus:border-[#707070] focus:outline-none focus:ring-[#707070]'
          placeholder='Choose file'
        />
        <div className='flex h-[4.52rem] w-[45.8rem] items-center rounded-r-[1.875rem] border border-grey-850 bg-white pl-20'>
          <p className='text-[1.5rem] text-[#B8B8B8]'>
            {file
              ? (file as File)?.name || (file as CustomFile)?.name
              : 'no file selected'}
          </p>
        </div>
      </section>
    </label>
  );
};
