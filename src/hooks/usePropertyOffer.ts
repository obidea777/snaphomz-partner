import { useQuery, useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { atomWithMutation } from 'jotai-tanstack-query'
import { Client } from 'lib/baseUrlClient'
import { pickErrorMessage, pickResult } from 'lib/client'
import {
  AGENTS_BACKEND_SERVICE,
  AGENT_PROPERTIES_KEY,
  SECURE_LOGIN_KEY
} from 'shared/constants/env'
import { showToast } from 'utils/toastHelper'
import queryClient from 'lib/querryClient'
import { getAuthToken, getStoredCookie, getUserDetail } from 'lib/storage'
import axios from 'axios'

const getAllAgentProperties = async (agent) => {
  try {
    const token = getAuthToken()

    const response = await axios.post(
      AGENTS_BACKEND_SERVICE,
      {
        query: `
query GetSellerAgentProperties($email: String!) {
  getSellerAgentProperties(email: $email) {
    _id
    listingId
    listing
    modificationTimestamp
  }
}
`,
        variables: {
          email: agent?.user?.email
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (response?.data?.errors) throw response?.data?.errors
    return response.data?.data?.getSellerAgentProperties
  } catch (error) {
    console.log(error)
    throw error // Rethrowing the error to handle it in the mutation
  }
}
export const useAllAgentProperties = (agent) => {
  return useQuery({
    queryKey: [AGENT_PROPERTIES_KEY],
    queryFn: () => getAllAgentProperties(agent)
  })
}

const getAllbuyerAgentproperties = async (agent) => {
  try {
    const user: any = getUserDetail()
    const response = await axios.post(
      AGENTS_BACKEND_SERVICE,
      {
        query: `
 query GetBuyerAgentProperties($email: String!) {
  getBuyerAgentProperties(email: $email) {
    _id
    listingId
    listing 
    modificationTimestamp
  }
}
`,
        variables: {
          email: agent?.user?.email
        }
      }
      // {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // }
    )
    if (response?.data?.errors) throw response?.data?.errors
    return response.data?.data?.getBuyerAgentProperties
  } catch (error) {
    console.log(error)
    throw error // Rethrowing the error to handle it in the mutation
  }
}
export const useAllBuyerAgentProperties = (agent) => {
  return useQuery({
    queryKey: ['BUYER_AGENT_PROPERTY'],
    queryFn: () => getAllbuyerAgentproperties(agent)
  })
}
const getAllPropertyOffers = (id: string) => {
  return Client.get(`property/all/property/offers/${id}`).then(
    pickResult,
    pickErrorMessage
  )
}

export const useAllPropertyOffers = (id: string) => {
  return useQuery({
    queryKey: ['GET_ALL_PROPERTY_OFFER', id],
    queryFn: () => getAllPropertyOffers(id),
    enabled: !!id
  })
}

const getSingleProperties = (id: string) => {
  return Client.get(`property/single/${id}`).then(pickResult, pickErrorMessage)
}

export const useSingleProperty = (id: string) => {
  return useQuery({
    queryKey: ['GET_SINGLE_PROPERTY', id],
    queryFn: () => getSingleProperties(id),
    enabled: !!id
  })
}

const getSinglePropertyOffers = (id: string) => {
  return Client.get(`property/single/offer/${id}`).then(
    pickResult,
    pickErrorMessage
  )
}

export const useSinglePropertyOffers = (id: string) => {
  return useQuery({
    queryKey: ['GET_SINGLE_PROPERTY_OFFER', id],
    queryFn: () => getSinglePropertyOffers(id),
    enabled: !!id
  })
}

export const deleteProperty = async (id: string) => {
  return await Client.delete(`property/delete/${id}`, {
    headers: {
      role: 'seller'
    }
  }).then(pickResult, pickErrorMessage)
}

const acceptPropertyOffer = async (body) => {
  return await Client.post(`property/seller/offer/response`, {
    body: JSON.stringify(body),
    headers: {
      role: 'seller'
    }
  }).then(pickResult, pickErrorMessage)
}

const postAcceptPropertyOffer = atomWithMutation(() => ({
  mutationKey: ['ACCEPT_PROPERTY_OFFER'],
  mutationFn: acceptPropertyOffer,
  onSuccess(data) {
    showToast('success', data.message)
  }
}))

export const useUpdatePropertyOffer = () => {
  const [{ mutate: mutateAcceptPropertyOffer, status, data }] = useAtom(
    postAcceptPropertyOffer
  )

  return [{ mutateAcceptPropertyOffer, status, data }]
}

const postPropertyOfferComment = async (body) => {
  return await Client.post(`property/offer/comment`, {
    body: JSON.stringify(body),
    headers: {
      role: 'seller'
    }
  }).then(pickResult, pickErrorMessage)
}

export const usePropertyOfferComment = (id) => {
  const mutation = useMutation({
    mutationFn: postPropertyOfferComment,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: ['GET_COMMENTS_OF_AN_OFFER', id],
        type: 'all'
      })
    }
  })

  return mutation
}

const getOfferComments = (id: string) => {
  return Client.get(`property/all/offer/comments/${id}`).then(
    pickResult,
    pickErrorMessage
  )
}

export const useOfferComments = (id: string) => {
  return useQuery({
    queryKey: ['GET_COMMENTS_OF_AN_OFFER', id],
    queryFn: () => getOfferComments(id),
    enabled: !!id
  })
}
