import { useQueryClient } from "@tanstack/react-query";
import { error } from "components/alert/notify";
import { RoundedButtonFileUpload } from "components/common/inputs/RoundedButtonFileUpload";
import { OfferDocumentCard } from "components/common/offer-document-card";
import { useAtom } from "jotai";
import { usePropertyServiceAPI } from "lib/api/property";
import { useGetAllRepos, useRepoManagementApi } from "lib/api/useRepoManagement";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { agentReadWriteAtom } from "store/atoms/agent-atom";
import { propertyReadWriteAtom } from "store/atoms/property";


type Props = {
  folderName: string;
  folderUrl: string;
  shared?:boolean;
  type?:string;
};

export function SharedFolder({ folderName, folderUrl, shared  }: Props) {

  const [agentState, ] = useAtom(agentReadWriteAtom)
  const queryClient = useQueryClient()
  const params = useParams();
  const search =  useSearchParams()
  console.log("PARMA" , )
  const type = search?.get('type')
  const id = params?.id  as string
  const [propertyData] = useAtom(propertyReadWriteAtom);
  const propertyId = type === 'buy' ? propertyData?.selectedProperty?.propertyId :  type === 'sell' ? id : null ;
  const { data: repos = [], isLoading: reposLoading , refetch } = useGetAllRepos(propertyId , folderName , shared);
  const { createRepoWithUploadedFile:{mutate,data ,status}}= useRepoManagementApi()
  const { uploadNewFile } = usePropertyServiceAPI()   
  const [fileUploading , setfileUploading  ] = useState(false)

  const handleFileChange = async (file: File) => {
    setfileUploading(true)
    // setFile(file)
     console.log(file)
    if (file && file.type === "application/pdf") {
      const {key}= await uploadNewFile(file, agentState.user.id, propertyId)
     
      const payload = {
        uploadedFile: {
          fileName: file?.name,
          fileSize: file?.size,
          fileUrl: key,
          fileType: file?.type
        },
        createRepoManagementInput: {
          name: folderName ||  'shared-repo',
          url: folderUrl || '/shared-repo',
          propertyId,
          createdBy: agentState.user.id,
          parentFolderName: 'shared-repo' ,
          isArchived: false
        }
      };

       mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['getAllRepos', propertyId] });
       
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

  const { removeUploadedFile } = useRepoManagementApi();

  const handleDelete = async (id: string) => {
    try {
      await removeUploadedFile.mutateAsync(id);
      refetch();
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  return (
    <section className="py-4">
     <div className="flex justify-between">
     {/* <p>{folderName?.toUpperCase()}</p> */}
     <RoundedButtonFileUpload setFile={handleFileChange} isLoading={fileUploading} />
     </div>
      <div className="my-10 f">
        {/* <SharedRepoDocumentUpload
          userId={user?.id}
          propertyId={propertyId}
          url={folderUrl}
          repo={folderName}
        /> */}
    

        <section className="my-8 grid grid-cols-2 gap-8">
          {repos?.[0]?.uploadedFiles?.length === 0 ? (
            <p>No documents found in this folder.</p> // Display message when no documents are found
          ) : (
            repos?.[0]?.uploadedFiles?.map((doc: any, idx: number) => {
              console.log(doc)
              return (
                <OfferDocumentCard
                key={doc.id}
                fileName={doc?.fileName}
                fileUrl={doc?.fileUrl}
                fileKey={doc?.fileUrl}
                uploadedAt={doc?.uploadedAt}
                share={shared}
                docId={doc?.id}
                idx={idx}
                repoId={repos?.[0]?.id}
                onDelete={handleDelete}
                buyer={propertyData?.engagedProperty?.user}
                />
              );
            })
          )}
        </section>
      </div>
    </section>
  );
}
