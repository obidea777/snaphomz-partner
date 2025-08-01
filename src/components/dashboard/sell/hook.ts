'use client'

import { getCookie } from 'cookies-next'
import { useSingleProperty } from 'hooks/usePropertyOffer'
import { useAtom } from 'jotai'
import { useParams } from 'next/navigation'
import { AUTH_ROLE } from 'shared/constants/env'
import { claimedPropertyReadWriteAtom } from 'store/atoms/claimed-property'
import { propertyReadWriteAtom } from 'store/atoms/property'

export type SideNavItemProps = {
  Title: string
  Icon: string
  alt: string
  link: string
  subItems?: SideNavItemProps[] // Optional subitems array
}

export const useSideNavItems = ({
  type, pId
}:any) => {
  const params = useParams()
  const propertyId = params?.id as string
  const id = params?.id
  const {
    data: singlePropertyData,
    isLoading: singlePropertyLoading,
    refetch: refetchSinglePropertyData
  } = useSingleProperty(id as string)
  const selectedProperty = singlePropertyData?.data?.property
  const [propertyData, setPropertyData] = useAtom(propertyReadWriteAtom)  

  const [claimedPropertyData] = useAtom(claimedPropertyReadWriteAtom)  
  console.log(claimedPropertyData)
  const currentAgentType = getCookie(AUTH_ROLE)
  console.log('agentType' ,currentAgentType)
  console.log(claimedPropertyData,type)

  const sideNavItems: SideNavItemProps[] = [
    {
      Title: 'Overview',
      Icon: '/assets/images/icons/overview.svg',
      alt: 'overview image',
      link: `/dashboard/${type}/${pId || selectedProperty?.id || propertyData?.selectedProperty?.id }/overview?type=${type}` 
    },
    {
      Title: 'Transaction',
      Icon: '/assets/images/icons/transaction.svg',
      alt: 'transaction image',
      link: `/dashboard/${type}/${type === 'sell' ? claimedPropertyData?.id  :propertyData?.selectedProperty?.id}/transaction?type=${type}`
    },
    {
      Title: 'Analytics',
      Icon: '/assets/images/icons/analytics.svg',
      alt: 'analytics image',
      link: `/dashboard/${type}/${type === 'sell' ? claimedPropertyData?.id  :propertyData?.selectedProperty?.id}/analytics?type=${type}`
    },
    {
      Title: 'Agreements',
      Icon: '/assets/images/icons/agreements.svg',
      alt: 'agreements image',
      link: `/dashboard/${type}/${type === 'sell' ? claimedPropertyData?.id  :propertyData?.selectedProperty?.id}/agreement?type=${type}`
    },
    {
      Title: 'Documents',
      Icon: '/assets/images/icons/documents.svg',
      alt: 'documents image',
      link: '#', // Placeholder link for the parent item
      subItems: [
        {
          Title: 'All',
          Icon: '/assets/images/icons/documents.svg',
          alt: 'all documents image',
          link: `/dashboard/${type}/${type === 'sell' ? claimedPropertyData?.id  :propertyData?.selectedProperty?.id}/documents/all?type=${type}`
        },
        {
          Title: 'Shared',
          Icon: '/assets/images/icons/waypoints.svg',
          alt: 'shared documents image',
          link: `/dashboard/${type}/${type === 'sell' ? claimedPropertyData?.id  :propertyData?.selectedProperty?.id}/documents/shared?type=${type}`
        }
      ]
    },
    // {
    //   Title: 'Shared Repo',
    //   Icon: '/assets/images/icons/waypoints.svg',
    //   alt: 'shared repo image',
    //   link: `/dashboard/buy/${propertyData?.selectedProperty?.id}/shared-repo`
    // },
    {
      Title: 'Offers',
      Icon: '/assets/images/icons/offers.svg',
      alt: 'offer image',
      link: `/dashboard/${type}/${type === 'sell' ? claimedPropertyData?.id
  :propertyData?.selectedProperty?.id}/offers?type=${type}`
    },
    ...(type === 'sell' ? [{
      Title: 'Counter Offers',
      Icon: '/assets/images/icons/offers.svg',
      alt: 'offer image',
      link: `/dashboard/${type}/${claimedPropertyData?.id}/counter-offers?type=${type}`
    }] : []),
    {
      Title: 'Conversation',
      Icon: '/assets/images/icons/conversation.svg',
      alt: 'conversation image',
      link: `/dashboard/chat`
    },
  ]

  return sideNavItems
}
