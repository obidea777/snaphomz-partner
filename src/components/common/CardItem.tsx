import React, { useState } from 'react';
import { Modal, Button } from '@mantine/core';
import { useGetAllRepos, useRepoManagementApi } from 'lib/api/useRepoManagement';
import { OfferDocumentCard, } from './offer-document-card';
import { propertyReadWriteAtom } from 'store/atoms/property';
import { useAtom } from 'jotai';

interface CardItemProps {
  title: string;
  name: string;
  updatedDate: string;
  propertyId: string;
  fileUrl?: any
  preUploadFileChange: any;
}

const RectIcon = () => {
  return (
    <svg
      width='100'
      height='120'
      viewBox='0 0 112 128'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='0.25'
        y='0.25'
        width='111.5'
        height='127.5'
        fill='white'
        stroke='#707070'
        stroke-width='0.5'
      />
      <path
        d='M30 15V17H12V15H30ZM12 27H21V25H12V27ZM12 22H30V20H12V22Z'
        fill='#7A7A7A'
      />
      <path
        d='M84.875 51V49H12.125V51H84.875ZM12.125 39H48.5V41H12.125V39ZM12.125 44H84.875V46H12.125V44Z'
        fill='#7A7A7A'
      />
      <path
        d='M84.875 63V65H12.125V63H84.875ZM12.125 75H48.5V73H12.125V75ZM12.125 70H84.875V68H12.125V70Z'
        fill='#7A7A7A'
      />
      <path
        d='M84.875 90V92H12.125V90H84.875ZM12.125 102H48.5V100H12.125V102ZM12.125 97H84.875V95H12.125V97Z'
        fill='#7A7A7A'
      />
    </svg>
  );
};
const CardItem: React.FC<CardItemProps> = ({ title, updatedDate, name, propertyId, fileUrl, preUploadFileChange }) => {
  const [opened, setOpened] = useState(false); // State to control modal visibility

  const { data: repos = [], isLoading: reposLoading } = useGetAllRepos(propertyId, name, false);
  const [propertyData] = useAtom(propertyReadWriteAtom);
  const { useGrantAccess: { mutate, data, status } } = useRepoManagementApi()
  console.log("File ", fileUrl);

  const handleGrantAcess = async () => {
    try {
      const payload = {
        userId: propertyData?.engagedProperty?.user?.id,
        repoId: repos[0]?.id,
        accessType: 'OWNER'
      }
      await mutate(payload)
    } catch (error) {

    }
  }

  const handleModalOpen = () => {
    setOpened(true);
  };

  const handleModalClose = () => {
    setOpened(false);
  };

  const selectedUplaodedFile = (file) => {
    preUploadFileChange(file)
    handleGrantAcess()
    setOpened(false);
  }

  return (
    <div>

      <div
        className="flex items-center p-4 border rounded-lg shadow-sm bg-white cursor-pointer"
        onClick={handleModalOpen}
      >
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_1911_2096"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="36"
              height="36"
            >
              <rect width="36" height="36" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_1911_2096)">
              <path
                d="M7.5 31.5C6.675 31.5 5.96875 31.2063 5.38125 30.6188C4.79375 30.0312 4.5 29.325 4.5 28.5V7.5C4.5 6.675 4.79375 5.96875 5.38125 5.38125C5.96875 4.79375 6.675 4.5 7.5 4.5H24L31.5 12V28.5C31.5 29.325 31.2063 30.0312 30.6188 30.6188C30.0312 31.2063 29.325 31.5 28.5 31.5H7.5ZM7.5 28.5H28.5V13.5H22.5V7.5H7.5V28.5ZM10.5 25.5H25.5V22.5H10.5V25.5ZM10.5 13.5H18V10.5H10.5V13.5ZM10.5 19.5H25.5V16.5H10.5V19.5Z"
                fill="#1C1B1F"
              />
            </g>
          </svg>
        </div>
        <div className="ml-4">
          <p className="text-sm font-semibold text-black">{title}</p>
          <p className="text-xs text-gray-500">Updated {updatedDate}</p>
        </div>
      </div>

      {/* Modal */}
      <Modal opened={opened} size={'xl'} padding={14} onClose={handleModalClose} >
        <div >
          <div className=' flex justify-center'>

            <div className='pdf-viewer-container h-[80vh] w-full'>
              {fileUrl ? (
                <iframe
                  src={fileUrl}
                  width='100%'
                  height='100%'
                  style={{ border: 'none' }}
                />
              ) : (
                <p>Unsupported file format.</p>
              )}
            </div>
          </div>
          <Button onClick={handleModalClose} className='mt-4'>Close</Button>
        </div>
      </Modal>
    </div>
  );
};




export { CardItem };
