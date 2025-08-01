import { useQuery } from '@tanstack/react-query'
import { Client } from 'lib/baseUrlClient'
import { pickErrorMessage, pickResult } from 'lib/client'

const fetchAllDocumentsOfAProperty = (id: string) => {
  return Client.get(`property-repo/all/property-documents/${id}`).then(
    pickResult,
    pickErrorMessage
  )
}

export const useAllDocumentsOfAProperty = (id: string) => {
  return useQuery({
    queryKey: ['GET_DOCUMENTS_OF_PROPERTY', id],
    queryFn: () => fetchAllDocumentsOfAProperty(id),
    enabled: !!id
  })
}

const getPorpertyAnalytics = (id: string) => {
  return Client.get(`property/analytics/${id}`).then(
    pickResult,
    pickErrorMessage
  )
}

export const usePropertyAnalytics = (id: string) => {
  return useQuery({
    queryKey: ['GET_ANALYTICS_OF_PROPERTY', id],
    queryFn: () => getPorpertyAnalytics(id),
    enabled: !!id
  })
}

export const deletePropertyDocument = async (id: string) => {
  return await Client.delete(
    `property-repo/delete/single/property-documents/${id}`,
    {
      headers: {
        role: 'seller'
      }
    }
  ).then(pickResult, pickErrorMessage)
}
