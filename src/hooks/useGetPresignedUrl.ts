// import { useQuery } from '@tanstack/react-query'
// import axios from 'axios'
// import { atom, useAtom } from 'jotai'
// import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query'
// import { Client } from 'lib/baseUrlClient'
// import { pickErrorMessage, pickResult } from 'lib/client'

// export const urlAtom = atom([''])

// const presignedUrlAtom = atomWithQuery((get) => ({
//   queryKey: ['presigned-image-url', get(urlAtom)],
//   queryFn: async ({ queryKey: [, fileNames] }) => {
//     return await Client.get(
//       `file/upload-url?files=${fileNames.toString()}`
//     ).then(pickResult, pickErrorMessage)
//   },
//   enabled: false
// }))

// const uploadToPresignedUrlAtom = atomWithMutation(() => ({
//   mutationKey: ['upload-presigned-url'],
//   mutationFn: async ({
//     file,
//     presignedUrl
//   }: {
//     file: File
//     presignedUrl: string
//   }) => {
//     const response = await axios.put(presignedUrl, file, {
//       headers: {
//         'Content-Type': file.type
//       }
//     })

//     return response.data
//   }
// }))

// export const useGetPresignedUrl = () => {
//   const [
//     { data: presignedUrls, status: presignedUrlStatus, refetch: getURLs }
//   ] = useAtom(presignedUrlAtom)

//   const [
//     {
//       data: uploadedUrls,
//       status: uploadUrlStatus,
//       isPending: isUploadPending,
//       mutateAsync: uploadToPresignedUrl
//     }
//   ] = useAtom(uploadToPresignedUrlAtom)

//   return {
//     presignedUrls,
//     presignedUrlStatus,
//     uploadUrlStatus,
//     uploadedUrls,
//     getURLs,
//     uploadToPresignedUrl,
//     loading: isUploadPending
//   }
// }

{
  /* 


 const uploadToPresignedUrl = async (
    file: File, 
    presignedUrl: string,
    key: string
  ) => {
    try {
      const data = await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          )
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: percentCompleted,
          }))
        },
      })

      if (data.status === 200) {
        setFileKeys((prev) => [...prev, key])
        setUploadResults((prev) => ({ ...prev, [file.name]: 'Success' }))
      }
    } catch (error: any) {
      setUploadResults((prev) => ({
        ...prev,
        [file.name]: `Failed: ${error.message}`,
      }))
    }
  }

*/
}


import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { atom, useAtom } from 'jotai'
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query'
import { Client } from 'lib/baseUrlClient'
import { pickErrorMessage, pickResult } from 'lib/client'

export const urlAtom = atom([''])

const presignedUrlAtom = atomWithQuery((get) => ({
  queryKey: ['presigned-image-url', get(urlAtom)],
  queryFn: async ({ queryKey: [, fileNames] }) => {
    return await Client.get(
      `file/upload-url?files=${fileNames.toString()}`
    ).then(pickResult, pickErrorMessage)
  },
  enabled: false
}))

const uploadToPresignedUrlAtom = atomWithMutation(() => ({
  mutationKey: ['upload-presigned-url'],
  mutationFn: async ({
    file,
    presignedUrl
  }: {
    file: File
    presignedUrl: string
  }) => {
    const response = await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type
      }
    })

    return response.data
  }
}))

// New function to handle the file upload, including presigned URL fetching and file upload
const uploadNewFile = async (
  file: File,
  userId: string,
  propertyId: string
) => {
  try {
    // Validate inputs
    if (!file || !userId || !propertyId) {
      throw new Error('File, userId, and propertyId are required.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)
    formData.append('propertyId', propertyId)

    // Fetch presigned URL for the file upload
    const presignedUrlResponse = await Client.get(
      `file/upload-url?files=${file.name}`
    ).then(pickResult, pickErrorMessage)

    const presignedUrl = presignedUrlResponse.url // Assuming the response includes a URL field

    // Upload the file to the presigned URL
    const uploadResponse = await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type
      }
    })

    return uploadResponse.data
  } catch (error: any) {
    console.error('Error uploading file:', error.message)

    // Handle HTTP errors gracefully
    if (error.response) {
      console.error('Server responded with status:', error.response.status)
      console.error('Response data:', error.response.data)
    } else if (error.request) {
      console.error('No response received:', error.request)
    } else {
      console.error('Request setup error:', error.message)
    }

    return null // Return null or some custom error response
  }
}

export const useGetPresignedUrl = () => {
  const [
    { data: presignedUrls, status: presignedUrlStatus, refetch: getURLs }
  ] = useAtom(presignedUrlAtom)

  const [
    {
      data: uploadedUrls,
      status: uploadUrlStatus,
      isPending: isUploadPending,
      mutateAsync: uploadToPresignedUrl
    }
  ] = useAtom(uploadToPresignedUrlAtom)

  const uploadFileWithPresignedUrl = async (file: File, userId: string, propertyId: string) => {
    // Use the updated uploadNewFile logic
    return uploadNewFile(file, userId, propertyId)
  }

  return {
    presignedUrls,
    presignedUrlStatus,
    uploadUrlStatus,
    uploadedUrls,
    getURLs,
    uploadToPresignedUrl,
    uploadFileWithPresignedUrl, // Add this to call the file upload function
    loading: isUploadPending
  }
}
