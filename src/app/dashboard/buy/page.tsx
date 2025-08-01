'use client'

import { useMutation } from '@tanstack/react-query'
import { Button } from 'components/common/buttons/Button'
import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { SearchInput } from 'components/common/inputs/SearchInput'
import LoadingState from 'components/common/LoadingState'
import { PropertyCard } from 'components/common/PropertyCard'
import { PropertyListViewItem } from 'components/common/PropertyListViewItem'
import {
  deleteProperty,
  useAllBuyerAgentProperties
} from 'hooks/usePropertyOffer'
import { IFormattedProperty } from 'interfaces/formattedProperty'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { showToast } from 'utils/toastHelper'
import { EmptyPlaceholder } from 'components/common/EmptyPlaceholder'
import Modal from 'components/common/Modal'
import RemoveProperty from 'components/dashboard/sell/RemoveProperty'
import { useAtom } from 'jotai'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { usePropertyServiceAPI } from 'lib/api/property'
import { EngagedPropertyInterface } from '../sell/page'
import AgentPropertyCard from 'components/common/property.card'
import { ArrowLeft } from 'lucide-react'
import { Pagination } from '@mantine/core' // Import Mantine Pagination component
import Breadcrumb from 'components/common/Breadcrumb'

interface propertyInterface {
  id: string
  propertyAddress?: string
  propertyId?: string
  propertyImage?: string
  status?: string
  userId?: string
  propertyProgress: string
}

const Buy = () => {
  const router = useRouter()
  const [agentData] = useAtom(agentReadWriteAtom)
  const { data, error, isLoading } = useAllBuyerAgentProperties(agentData)
  const [currentView, setCurrentView] = useState<'list' | 'grid'>('grid')
  const [selectedProperty, setSelectedProperty] =
    useState<IFormattedProperty | null>(null)
  const [removePropertyModal, setRemovePropertyModal] = useState(false)
  const { getEngagedPropertyByAgentId } = usePropertyServiceAPI()
  const [propertyData, setPropertyData] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const propertiesPerPage = 3

  const handlePropertyClick = (property: any) => {
    router.push(`/dashboard/buy/${property.id}`)
  }

  const handlePropertyEdit = (property: any) => {
    router.push(`/property/${property.id}`)
  }

  const handleModal = () => {
    setRemovePropertyModal(!removePropertyModal)
  }

  const useDeleteProperty = () => {
    const mutation = useMutation({
      mutationFn: deleteProperty,
      mutationKey: ['DELETE_PROPERTY'],
      onSuccess: (data) => {
        showToast('success', data.message)
        setRemovePropertyModal(false)
      },
      onError: (error) => {
        showToast('error', 'Failed to delete the property')
      }
    })

    return mutation
  }

  const dummyProperties: any[] = [
    {
      _id: 'property1',
      listing: {
        customStatus: 'For Sale',
        title: 'Modern Apartment in Downtown',
        price: '$500,000',
        location: 'New York, NY',
        imageUrl: '/assets/images/properties/property1.jpg'
      }
    },
    {
      _id: 'property2',
      listing: {
        customStatus: 'Sold',
        title: 'Cozy Cottage by the Lake',
        price: '$350,000',
        location: 'Austin, TX',
        imageUrl: '/assets/images/properties/property2.jpg'
      }
    },
    {
      _id: 'property3',
      listing: {
        customStatus: 'For Rent',
        title: 'Luxury Condo with City View',
        price: '$2,500/month',
        location: 'Los Angeles, CA',
        imageUrl: '/assets/images/properties/property3.jpg'
      }
    }
  ]

  const {
    mutate: deletePropertyMutate,
    status: deleteStatus,
    data: deletePropertyData
  } = useDeleteProperty()

  const handleRemoveProperty = (property: any) => {
    setSelectedProperty(property)
    setRemovePropertyModal(true)
  }

  const confirmRemoveProperty = () => {
    if (selectedProperty) {
      deletePropertyMutate(selectedProperty._id)
    }
  }

  const filteredProperties = data?.filter((item) => !item.isDeleted) || []
  const hasProperties = filteredProperties.length > 0

  const getEngagedProperty = () => {
    setPropertyData([] as EngagedPropertyInterface[])
    setLoading(true)
    getEngagedPropertyByAgentId.mutate(agentData?.user?.id, {
      onSuccess: (response) => {
        setLoading(false)
        setPropertyData(response)
      },
      onError: (error) => {
        console.log('Error in mutation: ', error)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if(agentData?.user?.id){
      getEngagedProperty()
    }
  }, [agentData.user])

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings" } // current page, no href
  ]
  const indexOfLastProperty = page * propertiesPerPage
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage
  const currentProperties = propertyData.slice(indexOfFirstProperty, indexOfLastProperty)

  return (
    <section className="py-10 px-6 sm:px-10 lg:px-14 pt-24 sm:pt-32">
      {/* Top Controls */}
      {/* <Breadcrumb
      items={breadcrumbItems}
      /> */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16">
        <div
          className="flex cursor-pointer items-center gap-4 w-full sm:w-auto"
          onClick={(e) => {
            e.preventDefault()
            router.push("/partner-dashboard")
          }}>
          <ArrowLeft />
          <span className="text-gray-700 cursor-pointer">Back to overview</span>
        </div>
        <div className="w-full sm:w-1/3">
          <SearchInput placeholder="Search property" />
        </div>
        <div className="flex items-center gap-4">
          <Image
            onClick={() => setCurrentView('grid')}
            height={24}
            width={24}
            src="/assets/images/icons/gridIcon.svg"
            alt="Grid View"
            className={`cursor-pointer transition-transform transform ${currentView === 'grid' ? 'scale-110' : 'opacity-70'}`}
          />
          <Image
            onClick={() => setCurrentView('list')}
            height={24}
            width={24}
            src="/assets/images/icons/listIcon.svg"
            alt="List View"
            className={`cursor-pointer transition-transform transform ${currentView === 'list' ? 'scale-110' : 'opacity-70'}`}
          />
        </div>
      </section>

       {/* Pagination */}
       <Pagination
        value={page}
        onChange={setPage}
        total={Math.ceil(propertyData.length / propertiesPerPage)}
        color="orange"
        size='lg'
        boundaries={0}
        radius={'xl'}
        mb={24}
      />

      {/* Property Listing */}
      {loading ? (
        <LoadingState keyType="svg" />
      ) : currentProperties?.length ? (
        <>
          {currentView === 'grid' ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {currentProperties.sort((a, b) => { return b.engagement.createdAt.localeCompare(a.engagement.createdAt)}).map((property,idx) => (
                <AgentPropertyCard {...property?.engagement} engagedProperty={property} users={propertyData.user} key={idx} userId={property.userId || ''} />
              ))}
            </section>
          ) : (
            <section className="flex flex-col gap-6">
              {currentProperties.sort((a, b) => { return a.engagement.createdAt.localeCompare(b.engagement.createdAt)}).map((property) => (
                <div
                  key={property._id}
                  className="transition ease-in duration-500 hover:bg-gray-50 p-4 rounded-lg">
                  <PropertyListViewItem
                    openProperty={() => {}}
                    editProperty={() => {}}
                    deleteProperty={() => {}}
                    badgeStatus={property.currentStatus}
                    property={property}
                  />
                </div>
              ))}
            </section>
          )}
        </>
      ) : (
        <EmptyPlaceholder
          transactionImage=''
          EmptyPlaceHolderImage="/assets/images/icons/overview.svg"
          title="Properties"
          description="There are currently no properties available for sale."
        />
      )}

     
    </section>
  )
}

export default Buy
