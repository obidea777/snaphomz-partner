"use client"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { error } from 'components/alert/notify'
import { DocCard } from 'components/common/DocCard'
import { DocumentCard } from 'components/common/DocumentCard'
import { EmptyPlaceholder } from 'components/common/EmptyPlaceholder'
import LoadingState from 'components/common/LoadingState'
import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { RoundedButtonFileUpload } from 'components/common/inputs/RoundedButtonFileUpload'
import { SearchInput } from 'components/common/inputs/SearchInput'
import { PropertyTransactionItem } from 'components/overview/PropertyTransactionItem'
import { Button } from 'components/ui/button'
import { useAllDocumentsOfAProperty } from 'hooks/usePropertyDocuments'
import { useUpdatePropertyDocument } from 'hooks/useUpdateProperty'
import { useAtom } from 'jotai'
import { useAuthApi } from 'lib/api/auth'
import { usePropertyServiceAPI } from 'lib/api/property'
import { useCheckUserAccess, useGetAllRepos, useRepoManagementApi, useViewUploadedFileUrl } from 'lib/api/useRepoManagement'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { propertyReadWriteAtom } from 'store/atoms/property'
import { formatDate } from 'utils/dateutilities'
import { downloadDocument } from 'utils/downloadFunction'

function Main() {
  
  const params = useParams()
  const queryClient = useQueryClient()
  const id = params?.id  as string
  const [agentState, ] = useAtom(agentReadWriteAtom)
  const { uploadNewFile } = usePropertyServiceAPI()                           
  const [allRepos , setAllRepos] = useState<any>([])
  const [propertyData] = useAtom(propertyReadWriteAtom);
  const propertyId = propertyData?.selectedProperty?.propertyId ?? null;
  const { createRepoWithUploadedFile:{mutate,data ,status}}= useRepoManagementApi()
  const { data: repos = [], isLoading: reposLoading } = useGetAllRepos(propertyId);
  const [fileUploading , setfileUploading  ] = useState(false)

  const { data: hasAccess, isLoading: accessCheckLoading } = useCheckUserAccess({
    repoId: repos?.[0]?.id,
    requiredAccessType: 'VIEW',
    enabled: !!repos?.[0]?.id && !!agentState?.user?.id,
  });
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)

  const handleModal = () => {
    setIsOpen(!isOpen)
  }
  const {requestRepoAccess}  = useRepoManagementApi()

  const { data: propertyDocuments, isLoading } = useAllDocumentsOfAProperty(
    id as string
  )
  const result = propertyDocuments?.data?.result

  const handleDocumentClick = (document) => {
    setSelectedDocument(document)
  }

  const handleDocumentDelete = (document) => {
    setSelectedDocument(document)
    // deletePropertyDocumentMutate(document?._id)
  }

  const { setFile, postUpdateLoading } = useUpdatePropertyDocument(propertyId as string)


  console.log(repos , hasAccess , propertyData)
 

  const handleFileChange = async (file: File) => {
    setfileUploading(true)
    setFile(file)
     console.log(file)
    if (file && file.type === "application/pdf") {
      const {key}= await uploadNewFile(file, agentState.user.id, propertyId)
     
      const payload = {
        uploadedFile: { // ✅ Must match GraphQL variable name
          fileName: file?.name,
          fileSize: file?.size,
          fileUrl: key,
          fileType: file?.type
        },
        createRepoManagementInput: {
          name: 'shared-repo',
          url: '/shared-repo',
          propertyId,
          createdBy: agentState.user.id,
          parentFolderName: 'shared-repo' ,
          isArchived: false
        }
      };

       mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['getAllRepos', propertyId] });
          queryClient.invalidateQueries({ queryKey: ['getAccessRequests', agentState.user.id] });
          // ✅ re-fetch repo data
        },
        onError: (err) => {
          error({ message: err?.message || 'Upload failed' });
        },
      });

      setfileUploading(false)
     
    } else {
      console.error({ message: "Only PDF files are supported" })
      setfileUploading(true)
    }
  }

  const handleRequestAccess = () => {
    requestRepoAccess.mutate({
      repoId:repos[0]?.id,
      userId:agentState?.user?.id,
      propertyId
    });
  };
  const loading = isLoading || postUpdateLoading
  const [activeDocument, setActiveDocument] = useState<string | null>(null)
 

  return (
    <section className="pb-6">
    <PropertyTransactionItem />

  
     
        <>
        <section className="flex items-center justify-between mt-6">
          <section className="w-2/5">
            <SearchInput />
          </section>
        </section>
        <section className="flex items-center justify-between mb-2">
        
          <section className="w-full flex items-center justify-end my-10 gap-7">
            <RoundedButtonFileUpload setFile={handleFileChange} isLoading={fileUploading} />
  
            {/* <RoundedButton
              label="DocuSign"
              onClick={() => {}}
              variant="primary"
              className="bg-black text-white py-2 text-sm"
            /> */}
          </section>
        </section>
        {loading ? ( <LoadingState keyType="svg" />) 
        : (
          <section className="flex flex-wrap items-center gap-10">
            {repos[0]?.uploadedFiles != null && hasAccess && repos[0]?.uploadedFiles?.length > 0 ?
             (
              repos[0]?.uploadedFiles?.map((propertyDocument) => {
                const { month, day, year, time } = formatDate( propertyDocument.uploadedAt)
                const isSelected =selectedDocument?.id === propertyDocument?.id
               
                return (
                  <DocCard
                    className={isSelected ? 'bg-white' : 'bg-inherit'}
                    key={propertyDocument?._id}
                    url={propertyDocument.fileUrl}
                    title={propertyDocument.fileName}
                    updatedDate={`Updated ${month} ${day}, ${year} ${time}`}
                    onClick={() => {
                      handleDocumentClick(propertyDocument)
                    }}
                    handleDocumentDelete={() =>
                      handleDocumentDelete(propertyDocument)
                    }
                    documentUrl={propertyDocument.fileUrl}
                    isOpen={activeDocument === propertyDocument._id}
                    setActiveDocument={() =>
                      setActiveDocument(
                        activeDocument === propertyDocument._id
                          ? null
                          : propertyDocument._id
                      )
                    }
                  />
                )
              })
            ) :

            !repos.length  ?
            (
              <EmptyPlaceholder
              transactionImage=''
                EmptyPlaceHolderImage="/assets/images/icons/documents.svg"
                title="Documents"
                description="No Documents yet"
              />
            )
            :
            <section className="w-full h-[40vh] flex items-center justify-center bg-gray-100 rounded-xl shadow-inner ">
            <div className="text-center px-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
            You don&apos;t have access to view this section
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Please request access to collaborate and upload or view documents for this property.
              </p>
              <button
                onClick={handleRequestAccess}
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300 text-sm sm:text-base"
              >
                Request Access
              </button>
            </div>
          </section>
          
          }
          </section>
        )
        }
      </>
     

    
   
  
  </section>
  )
}

export default Main