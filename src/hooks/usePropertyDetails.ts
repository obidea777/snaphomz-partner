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
import { useRouter } from 'next/navigation'
import { propertyDetailsAtom } from 'store/atoms/atoms'
import { applyChanges } from 'utils/modelUtilities'
type IApiFormat = {
  numBedroom: string
  price: { amount: number }
  numBathroom: string
  lotSizeValue: string
  propertyType: string
  propertyDescription: string
  propertyId: string
  propertyStatus: string
}
const updateProperty = atomWithMutation(() => ({
  mutationKey: ['update_property_details'],
  mutationFn: async (value: IApiFormat) => {
    return await Client.put(`property/update/${value.propertyId}`, {
      body: JSON.stringify(value)
    }).then(pickResult, pickErrorMessage)
  }
}))
// Validation schema
const schema = yup.object().shape({
  numBedroom: yup.string(),
  amount: yup.number(),
  numBathroom: yup.string(),
  lotSizeValue: yup.string(),
  propertyType: yup
    .string()
    .min(3, 'The name is too short.')
    .max(55, 'The name is too long.')
    .matches(/^[a-zA-Z\s-]+$/, 'The name contains special characters.'),
  propertyDescription: yup.string().min(3, 'The name is too short.'),
  propertyStatus: yup.string()
})
// Define the form values type
type IupdateDetailsProps = {
  numBedroom: string
  amount: number
  numBathroom: string
  lotSizeValue: string
  propertyType: string
  propertyDescription: string
  propertyStatus: string
  images: []
}
export const useUpdateProperty = (id: string, selectedProperty) => {
  const router = useRouter()
  const [_, seturlAtom] = useAtom(urlAtom)
  const [{ mutateAsync, data, isPending }] = useAtom(updateProperty)
  const {
    presignedUrls,
    loading,
    presignedUrlStatus,
    uploadUrlStatus,
    uploadedUrls,
    getURLs,
    uploadToPresignedUrl
  } = useGetPresignedUrl()
  const [videos, setVideos] = useState<File[] | null>([])
  const [images, setImages] = useState<File[] | null>([])
  const [keys, setKeys] = useState<string[] | null>([])
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      numBedroom: selectedProperty?.numBedroom,
      amount: selectedProperty?.price?.amount,
      numBathroom: selectedProperty?.numBathroom,
      lotSizeValue: selectedProperty?.lotSizeValue,
      propertyType: selectedProperty?.propertyType,
      propertyDescription: selectedProperty?.propertyDescription,
      propertyStatus: selectedProperty?.propertyStatus
    },
    mode: 'onBlur'
  })
  const videFileNames = videos.map((file) => file.name)
  const imageFileNames = images.map((file) => file.name)
  const onSubmit = async (data: IupdateDetailsProps) => {
    // merge the file names in a way that we can differentiate between images and videos
    const fileNames = videFileNames.concat(imageFileNames)
    if (fileNames.length > 0) {
      seturlAtom(fileNames)
      await getURLs()
      // await update()
    } else {
      await update()
    }
  }
  const onErrors = (errors) => {
    console.log(errors)
  }
  const uploadFiles = async () => {
    const uploadedImages = []
    const uploadedVideos = []
    for (const file of [...videos, ...images]) {
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
    presignedUrls.data.successfullFiles.forEach((file) => {
      if (imageFileNames.includes(file.filename)) {
        uploadedImages.push({
          url: file.uploadUrl,
          thumbnail: file.uploadUrl
        })
      } else if (videFileNames.includes(file.filename)) {
        uploadedVideos.push({
          url: file.uploadUrl,
          thumbnail: file.uploadUrl
        })
      }
    })
    return {
      uploadedImages,
      uploadedVideos
    }
  }
  const update = async () => {
    const uploadedImages = []
    const uploadedVideos = []
    const updatedValues = {
      price: {
        amount: Number(getValues('amount'))
      },
      numBedroom: getValues('numBedroom'),
      numBathroom: getValues('numBathroom'),
      lotSizeValue: getValues('lotSizeValue'),
      propertyType: getValues('propertyType'),
      propertyDescription: getValues('propertyDescription'),
      propertyStatus: getValues('propertyStatus'),
      propertyId: id,
      images: selectedProperty.images,
      videos: selectedProperty.videos,
      ...(images.length > 0 && { images }),
      ...(videos.length > 0 && { videos })
    }
    if (presignedUrls?.data && (videos.length > 0 || images.length > 0)) {
      const { uploadedImages: uploadedImages, uploadedVideos: uploadedVideos } =
        await uploadFiles()
      if (images.length > 0) {
        updatedValues.images = [...selectedProperty.images, ...uploadedImages]
      }
      if (videos.length > 0) {
        updatedValues.videos = [...selectedProperty.videos, ...uploadedVideos]
      }
    }
    const modifiedChanges = applyChanges(updatedValues, selectedProperty)
    mutateAsync(modifiedChanges)
  }

  useEffect(() => {
    if (presignedUrls) {
      update()
    }
  }, [presignedUrls])

  return {
    data,
    handleSubmit: handleSubmit(onSubmit, onErrors),
    control,
    errors,
    isValid,
    setVideos,
    videos,
    setImages,
    images,
    presignedUrls,
    isLoading: loading || isPending,
    presignedUrlStatus,
    selectedProperty,
    uploadUrlStatus,
    uploadedUrls,
    getURLs,
    fileNames: videFileNames,
    setValue,
    update
  }
}
