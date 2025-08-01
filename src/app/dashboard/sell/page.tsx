'use client'

import { useMutation } from '@tanstack/react-query'
import { Button } from 'components/common/buttons/Button'
import { RoundedButton } from 'components/common/buttons/RoundedButton'
import LoadingState from 'components/common/LoadingState'
import { PropertyCard } from 'components/common/PropertyCard'
import RemoveProperty from 'components/dashboard/sell/RemoveProperty'
import { useAllAgentProperties, deleteProperty } from 'hooks/usePropertyOffer'
import { IFormattedProperty } from 'interfaces/formattedProperty'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { showToast } from 'utils/toastHelper'
import Modal from 'components/common/Modal'
import { useAtom } from 'jotai'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { EmptyPlaceholder } from 'components/common/EmptyPlaceholder'
import { usePropertyServiceAPI } from 'lib/api/property'
import { useGetSellerProperties } from 'lib/api/useAddProperty'
import { Pagination } from '@mantine/core'
import { propertyReadWriteAtom } from 'store/atoms/property'
import { claimedPropertyReadWriteAtom } from 'store/atoms/claimed-property'
import axios from 'axios'
import { error } from 'components/alert/notify'
import { PropertyListViewItem } from 'components/common/PropertyListViewItem'

export interface EngagedPropertyInterface {
  id?: string
  userId?: string
  propertyId?: string
  propertyName?: string
  propertyImage?: string
  propertyAddress?: string
  propertyProgress?: number
}

const Sell = () => {
  const router = useRouter()
  const [agentState, setAgentState] = useAtom(agentReadWriteAtom)
  const [_, setPropertyState] = useAtom(propertyReadWriteAtom);
  // const {
  //   data,
  //   error,
  //   isLoading,
  //   refetch: refetchAllProperties
  // } = useAllAgentProperties(agentState)
  const { getEngagedPropertyByAgentId } = usePropertyServiceAPI()
  const [claimedProperty, setClaimedProperty] = useAtom(claimedPropertyReadWriteAtom)
  const [currentView, setCurrentView] = useState<'list' | 'grid'>('grid')
  const [propertyData, setPropertyData] = useState([])
  const [page, setPage] = useState<number>(1)
  const [loading,setLoading] = useState<Boolean>(false)
  const propertiesPerPage = 3
  const [selectedProperty, setSelectedProperty] =
    useState<IFormattedProperty | null>(null)
  const [removePropertyModal, setRemovePropertyModal] = useState(false)
  const AI_SEARCH_ENDPOINT = process.env.NEXT_PUBLIC_AI_BACKEND_BASE_URI || "https://preprod-ai.snaphomz.com"
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

  const { data: sellerData, isPending } = useGetSellerProperties();

  const getSellerProperties = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${AI_SEARCH_ENDPOINT}/api/v2/get_agents_by_agent_id?agent_id=${agentState?.user?.id}`);
      setPropertyData(response?.data?.agents)
    } catch (err: any) {
      console.log("Error : ", err);
      error({ message: err?.response?.data?.message })
    }
    setLoading(false)
  }

  const handleModal = () => {
    setRemovePropertyModal(!removePropertyModal)
  }

  const handlePropertyClick = (property: any) => {
    console.log(property)
    setPropertyState({
      selectedProperty: {},
      engagedProperty: {}
    })
    setClaimedProperty(property)
    router.push(`/dashboard/sell/${property.id}/overview`)
  }

  const handlePropertyEdit = (property: any) => {
    router.push(`/property/${property.id}`)
  }

  // const useDeleteProperty = () => {
  //   const mutation = useMutation({
  //     mutationFn: deleteProperty,
  //     mutationKey: ['DELETE_PROPERTY'],
  //     onSuccess: (data) => {
  //       showToast('success', data.message)
  //       refetchAllProperties()
  //       setRemovePropertyModal(false)
  //     },
  //     onError: (error) => {
  //       showToast('error', 'Failed to delete the property')
  //     }
  //   })

  //   return mutation
  // }

  // const {
  //   mutate: deletePropertyMutate,
  //   data: deletePropertyData
  // } = useDeleteProperty()

  const handleRemoveProperty = (property: IFormattedProperty) => {
    setSelectedProperty(property)
    setRemovePropertyModal(true)
  }

  const confirmRemoveProperty = () => {
    // if (selectedProperty) {
    //   deletePropertyMutate(selectedProperty._id)
    // }
  }

  const getEngagedProperty = () => {
    // setPropertyData({} as EngagedPropertyInterface)
    setLoading(true)
    getEngagedPropertyByAgentId.mutate(
      agentState?.user?.id || 'e834755a-c6b7-494c-bf22-7f917e743f70',
      {
        onSuccess: (response) => {
          setLoading(false)
          setPropertyData(response.data?.data?.getUserEngagementsByPropertyId)
        },
        onError: (error) => {
          console.log('Error in mutation: ', error)
          setLoading(false)
        }
      }
    )
  }

  useEffect(() => {
    // getEngagedProperty()
    if(agentState?.user)
      getSellerProperties()
  }, [agentState])



  const indexOfLastProperty = page * propertiesPerPage
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage
  const currentProperties = sellerData?.slice(indexOfFirstProperty, indexOfLastProperty)
  return (
    <section className="py-10 px-14 pt-32">
      <section className="flex items-center gap-8 justify-end mb-2">
        <Button className="w-40 h-11" onClick={() => router.push('/listing')}>
          <p className="text-white text-base">Add New Listing</p>
        </Button>

        <section className="flex items-center gap-8">
          <Image
            onClick={() => setCurrentView('grid')}
            height={24}
            width={24}
            src="/assets/images/icons/gridIcon.svg"
            alt="Grid Icon"
            className="cursor-pointer object-contain"
          />
          <Image
            onClick={() => setCurrentView('list')}
            height={24}
            width={24}
            src="/assets/images/icons/listIcon.svg"
            alt="List Icon"
            className="cursor-pointer object-contain"
          />
        </section>
      </section>

      <p className="pb-2 border-b-4 text-xl font-bold border-orange-500 w-fit mb-8">
        Claimed Property
      </p>

      {/* Pagination */}
      {propertyData?.length>5?<Pagination
        value={page}
        onChange={setPage}
        total={Math.ceil(sellerData?.length / propertiesPerPage)}
        color="orange"
        size='lg'
        boundaries={0}
        radius={'xl'}
        mb={24}
      />:null}
      {loading ? (
        <LoadingState keyType="svg" />
      ) : propertyData?.length > 0 ? (
        <>
          {currentView === 'grid' ? (
            <section className="grid grid-cols-3 gap-4 place-items-center gap-y-14">
              {propertyData
                // .filter((item) => !item.isDeleted)
                .map((property) => (
                  <div
                    key={property?.id}
                    className="transition ease-in duration-700 w-[95%]">
                    <PropertyCard
                      badgeStatus={property.status||"Pending"}
                      property={property}
                      className="w-full">
                      <section className="flex items-center gap-4 mt-7">
                        <RoundedButton
                          label="Open"
                          onClick={() => handlePropertyClick(property)}
                          variant="primary"
                          className="w-[30%] py-2"
                        />
                        <RoundedButton
                          label="Edit"
                          onClick={() => handlePropertyEdit(property)}
                          variant="secondary"
                          className="w-[30%] py-2 border-white/[.34]"
                        />
                        <RoundedButton
                          label="Remove"
                          onClick={() => handleRemoveProperty(property)}
                          variant="secondary"
                          className="w-[30%] py-2"
                        />
                      </section>
                    </PropertyCard>
                  </div>
                ))}
              <Modal isOpen={removePropertyModal} closeModal={handleModal}>
                <RemoveProperty
                  closeModal={handleModal}
                  deleteProperty={confirmRemoveProperty}
                />
              </Modal>
            </section>
          ) : (
            <section className="flex flex-col gap-y-6">
              {propertyData
                ?.filter((item) => !item.isDeleted)
                ?.map((property) => (
                  <div
                    key={property?.id}
                    className="transition ease-in duration-700">
                    {/* {property?.id} */}
                    <PropertyListViewItem
                      openProperty={() => handlePropertyClick(property)}
                      editProperty={() => handlePropertyEdit(property)}
                      deleteProperty={() => handleRemoveProperty(property)}
                      badgeStatus={property?.currentStatus||"Pending"}
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
          description="There are currently no properties available for sale"
        />
      )}
    </section>
  )
}

export default Sell
