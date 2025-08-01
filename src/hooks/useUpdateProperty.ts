'use client'

import { useEffect, useState } from 'react'
import { urlAtom, useGetPresignedUrl } from './useGetPresignedUrl'
import { useAtom } from 'jotai'
import { useMutation } from '@tanstack/react-query'
import { Client } from 'lib/baseUrlClient'
import { pickErrorMessage, pickResult } from 'lib/client'
import { showToast } from 'utils/toastHelper'
import Router from 'next/router'
import { useAllDocumentsOfAProperty } from './usePropertyDocuments'

// Hook for uploading the document to the main endpoint
const useUploadPropertyDocument = (id: string) => {
  return useMutation({
    mutationKey: ['upload_property_document'],
    mutationFn: async (value: any) => {
      return await Client.post(`property-repo/add/property-documents/${id}`, {
        body: JSON.stringify(value)
      }).then(pickResult, pickErrorMessage)
    },
    onSuccess: (data) => {
      showToast('success', data.message)
    }
  })
}

export const useUpdatePropertyDocument = (id: string) => {
  const {
    mutate: uploadPropertyDocument,
    data,
    isPending
  } = useUploadPropertyDocument(id)
  const { refetch: refetchPropertyDocument, isLoading: postUpdateLoading } =
    useAllDocumentsOfAProperty(id)
  const {
    presignedUrls,
    loading,
    presignedUrlStatus,
    uploadUrlStatus,
    uploadedUrls,
    getURLs,
    uploadToPresignedUrl
  } = useGetPresignedUrl()
  const [file, setFile] = useState<File | null>(null)
  const [key, setKey] = useState<string | null>(null)
  const [_, seturlAtom] = useAtom(urlAtom)

  const verify = async () => {
    if (presignedUrls?.data && file) {
      const presignedFile = presignedUrls.data.successfullFiles.find(
        (f) => f.filename === file.name
      )

      if (presignedFile && presignedFile.uploadUrl) {
        await uploadToPresignedUrl({
          file,
          presignedUrl: presignedFile.uploadUrl
        })
        setKey(presignedFile.key)

        const uploadURL = presignedFile.uploadUrl
        const decodedURL = decodeURIComponent(uploadURL)
        const propertyDocument = {
          name: file.name,
          url: decodedURL,
          thumbNail: decodedURL,
          documentType: file.type
        }
        // Uploading document to the main endpoint
        await uploadPropertyDocument(propertyDocument)
        await refetchPropertyDocument()
      }
    }
  }
  const onSubmit = async () => {
    if (file) {
      seturlAtom([file.name])
      await getURLs()
    }
  }
  useEffect(() => {
    onSubmit()
  }, [file])

  useEffect(() => {
    verify()
  }, [presignedUrls])

  return {
    onSubmit,
    postUpdateLoading,
    isPending,
    data,
    loading,
    file,
    setFile
  }
}
