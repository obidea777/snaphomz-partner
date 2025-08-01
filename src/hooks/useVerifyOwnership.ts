import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { urlAtom, useGetPresignedUrl } from './useGetPresignedUrl'
import { atomWithMutation } from 'jotai-tanstack-query'
import { Client } from 'lib/baseUrlClient'
import { pickErrorMessage, pickResult } from 'lib/client'
import { useAtom } from 'jotai'
import { showToast } from 'utils/toastHelper'
import { useParams, useRouter } from 'next/navigation'
import { useSellerPropertyApi } from 'lib/api/useAddProperty'
import { useRepoManagementApi } from 'lib/api/useRepoManagement'
import { usePropertyServiceAPI } from 'lib/api/property'
import { claimPropertyAtom } from './claimPropertyAtom'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { useSellerAPI } from 'lib/api/seller'
import axios from 'axios'
import { error } from 'components/alert/notify'

interface CoOwner {
  name?: string
  email?: string
}
type IApiFormat = {
  propertyOwnershipDetails: {
    firstName: string
    lastName:string
    email: string
    coOwners: CoOwner[]
  }
  proofOfOwnership: {
    name: string
    url: string
    thumbNail: string
    documentType: string
  }[]
  additionalDocuments: {
    name: string
    url: string
    thumbNail: string
    documentType: string
  }[]
  propertyId: string
}

const verifyOwnership = atomWithMutation(() => ({
  mutationKey: ['verify-ownership'],
  mutationFn: async (value: IApiFormat) => {
    return await Client.post(
      `property/verify/property/ownership/${value.propertyId}`,
      {
        body: JSON.stringify(value)
      }
    ).then(pickResult, pickErrorMessage)
  }
}))

// Validation schema
const coOwnerSchema = yup.object().shape({
  name: yup
    .string(),
  email: yup
    .string()
})
const schema = yup.object().shape({
  firstName: yup
    .string()
    .min(3, 'The name is too short.')
    .max(55, 'The name is too long.')
    .matches(/^[a-zA-Z\s-]+$/, 'The name contains special characters.')
    .required('The name is required.'),
    lastName: yup
    .string()
    .min(3, 'The name is too short.')
    .max(55, 'The name is too long.')
    .matches(/^[a-zA-Z\s-]+$/, 'The name contains special characters.')
    .required('The name is required.'),
  email: yup
    .string()
    .email('The email must be a valid email address.')
    .required('The email is required.'),
  coOwners: yup.array().of(coOwnerSchema).notRequired().default([])
})

// Define the form values type
type IOwnershipDetailsProps = {
   firstName: string
   lastName:string
  email: string
  coOwners: CoOwner[]
}

export const useVerifyOwnership = (id: string) => {
  const router = useRouter()
  const AI_SEARCH_ENDPOINT = process.env.NEXT_PUBLIC_AI_SEARCH_ENDPOINT || "https://preprod-ai.snaphomz.com";
  const [_, seturlAtom] = useAtom(urlAtom)
  const [currentProperty] = useAtom(claimPropertyAtom)
  const [agentState,] = useAtom(agentReadWriteAtom)
  const [{ mutateAsync, data, isPending }] = useAtom(verifyOwnership)
  const { createUserByEmailMutation } = useSellerAPI();
  const {
    presignedUrls,
    loading,
    presignedUrlStatus,
    uploadUrlStatus,
    uploadedUrls,
    getURLs,
    uploadToPresignedUrl
  } = useGetPresignedUrl()
  const [files, setFiles] = useState<File[] | null>([])
  const [keys, setKeys] = useState<string[] | null>([])
  const { createRepoWithUploadedFile: { mutate, status } } = useRepoManagementApi()
  const { uploadNewFile } = usePropertyServiceAPI()
  const params = useParams()
  const sellerPropertyId = params?.propertyClaimId
  const { createRepoWithUploadedFile }= useRepoManagementApi()

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName:'',
      email: '',
      coOwners: [{ name: '', email: '' }]
    },
    mode: 'onSubmit',
  })

  console.log(files, currentProperty, agentState?.user?.id)
  const fileNames = files.map((file) => file.name)

  // const onSubmit = async (data: IOwnershipDetailsProps) => {


  //   try {
  //     console.log('Files:', files);

  //     console.log(data)

  //     const payload =  {
  //       sellerPropertyId,  // Replace with the actual property ID
  //       updateSellerPropertyInput: {
  //        ...data

  //       },
  //     };

  //     console.log(payload)
  //     await updateSellerPropertyMutation.mutateAsync(payload)
  //     router.push('/listing/pending-verification')

  //   } catch (error:any) {
  //     console.log(error?.message)
  //   }

  // }

  const getPresignedURLs = async (files) => {
    const uploadedFilesKeys = [];

    try {
      for (const file of files) {
        try {
          const { key } = await uploadNewFile(file, agentState.user.id, currentProperty?.id);

          const payload = {
            uploadedFile: {
              fileName: file?.name,
              fileSize: file?.size,
              fileUrl: key,
              fileType: file?.type
            },
            createRepoManagementInput: {
              name: 'proof-document',
              url: '/proof-document',
              propertyId: currentProperty?.id,
              createdBy: agentState.user.id,
              parentFolderName: 'proof-document',
              isArchived: false
            }
          };

          await mutate(payload);
          uploadedFilesKeys.push(key);
        } catch (fileError) {
          console.error(`Error uploading file ${file?.name}:`, fileError);
        }
      }

      return uploadedFilesKeys;
    } catch (err) {
      console.error("Unexpected error in getPresignedURLs:", err);
      throw err; // Rethrow if you want the calling function to handle it
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const { key } = await uploadNewFile(file, agentState?.user.id, currentProperty?.propertyId);
      const payload = {
        uploadedFile: {
          fileName: file?.name,
          fileSize: file?.size,
          fileUrl: key,
          fileType: file?.type
        },
        createRepoManagementInput: {
          name: 'proof-document',
          url: '/proof-document',
          propertyId: currentProperty?.propertyId,
          createdBy: agentState?.user.id,
          parentFolderName: 'proof-document',
          isArchived: false
        }
      };
      createRepoWithUploadedFile?.mutate(payload, {
        onSuccess: (data) => { 
          console.log(data)
        },
        onError: (err) => {
          error({ message: err?.message || 'Upload failed' });
        },
      });
      return key;
    } catch (err: any) {
      console.error("File upload failed:", err);
      throw new Error('File upload failed');
    }
  };


  const onSubmit = async (data: IOwnershipDetailsProps) => {
    try {
      console.log('Files:', files);
      console.log(data);
      let user: any = null;
      await createUserByEmailMutation.mutateAsync({email:data?.email,accountType:"SELLER"}, {
        onSuccess: async (response: any) => {
          console.log("Response : ", response);
          user = response;
          const uploadedFiles: string[] = [];
          const claimData = {
            owner: {
              owner_id: user?.id || "",
              email: data?.email,
              firstname: data.firstName || "",
              lastname: data.lastName || "",
              doc_urls:[]
            },
            listingId: parseInt(currentProperty?.listingId),
            propertyId: parseInt(currentProperty?.propertyId),
            agent_id: agentState.user.id,
            coowners: data?.coOwners || []
          }
          console.log(files)
          if (!files?.[0]) {
            throw new Error("No file selected for upload.");
          }
      
          // Handle file uploads in parallel
          const uploadPromises = files.map((file) => handleFileUpload(file));
          const fileUrls = await Promise.all(uploadPromises);
          uploadedFiles.push(...fileUrls);
          
          // Update the doc_urls in ownerData with uploaded file URLs
          claimData.owner.doc_urls = uploadedFiles;
      
          const agentInvitationData = {
            firstname: agentState?.user?.firstName,
            lastname: agentState?.user?.lastName,
            email: agentState?.user?.email,
            id: parseInt(currentProperty?.propertyId),
            listingid: parseInt(currentProperty?.listingId),
            agent_id: agentState?.user?.id,
            owner_id: user?.id
          }
          await Promise.all([
            axios.post(`${AI_SEARCH_ENDPOINT}/api/selling_agent`, agentInvitationData),
            axios.post(`${AI_SEARCH_ENDPOINT}/api/v2/ownership`, claimData)
          ])
          router.push('/listing/pending-verification');
        },
        onError: (err: any) => {
          console.log(err?.message);

        }
      })

      

      // Call the mutation to update the property
      // await updateSellerPropertyMutation.mutateAsync(payload);

      // Redirect to the verification page
    } catch (error: any) {
      console.log(error?.message);
    }
  }

  const verify = async () => {
    if (presignedUrls?.data && files.length > 0) {

      for (const file of files) {
        const presignedFile = presignedUrls.data.successfullFiles.find(
          (f) => f.filename === file.name
        )
        if (presignedFile && presignedFile.uploadUrl) {
          await uploadToPresignedUrl({
            file,
            presignedUrl: presignedFile.uploadUrl
          })
          setKeys((prev) => [...prev, presignedFile.key])
        }
      }

      const proofOfOwnership =
        files.map((file: File) => {
          return {
            name: file.name,
            url: URL.createObjectURL(file),
            thumbNail: '',
            documentType: file.type
          }
        }) || []

      const additionalDocuments =
        files.map((file: File) => {
          return {
            name: file.name,
            url: URL.createObjectURL(file),
            thumbNail: '',
            documentType: file.type
          }
        }) || []

      // mutateAsync({
      //   propertyOwnershipDetails: {
      //     nameOnProperty: getValues('firstName'),
      //     email: getValues('email'),
      //     coOwners: getValues('coOwners')
      //   },
      //   proofOfOwnership,
      //   additionalDocuments,
      //   propertyId: id
      // })
    }
  }

  useEffect(() => {
    verify()
  }, [presignedUrls])

  useEffect(() => {
    if (data) {
      showToast('success', data.message, {
        className: 'bg-green-500'
      })

      router.push('/listing/pending-verification')
      reset()
    }
  }, [data])

  return {
    handleSubmit: handleSubmit(onSubmit),
    control,
    errors,
    isValid,
    setFiles,
    files,
    presignedUrls,
    isLoading: loading || isPending,
    presignedUrlStatus,
    uploadUrlStatus,
    uploadedUrls,
    getURLs,
    fileNames
  }
}
