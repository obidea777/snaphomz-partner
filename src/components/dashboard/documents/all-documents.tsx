"use client"
import { useState } from "react";
import { SharedFolder } from "./shared-folder";

const repos = [
  {
    label: 'Disclosure',
    subTitle: 'disclosure shared documents',
    content: <SharedFolder folderName='disclosure-document' folderUrl='/disclosure-document' />,
  },
  {
    label: 'Agreements',
    subTitle: 'agreement shared documents',
    content: <SharedFolder folderName='agreement-document' folderUrl='/disclosure-document'  />,
  },
  {
    label: 'Proof',
    subTitle: 'shared proof documents',
    content: <SharedFolder folderName='proof-document' folderUrl='/proof-document' />,
  },
];

function AllDocument() {
  const [activeTab, setActiveTab] = useState<number>(0); // Store the index of active tab
  
  const handleButtonClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="mt-10">
      <div className='button-group gap-2 flex'>
        {repos.map((repo, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(index)}
            className={`p-2 px-4 rounded-xl ${activeTab === index ? 'bg-orange-500 text-white' : 'bg-[#F7F2EB]'}`}
          >
            {repo.label}
          </button>
        ))}
      </div>

      <div className='component-display'>
        <div>{repos[activeTab]?.content}</div> {/* Dynamically render the content */}
      </div>
    </div>
  );
}

export default AllDocument;
