'use client'

import { BuyerOfferCard } from 'components/common/BuyerOfferCard'
import { SearchInput } from 'components/common/inputs/SearchInput'
import { PropertyTransactionItem } from 'components/overview/PropertyTransactionItem'
import {
  useUpdatePropertyOffer,
  useAllPropertyOffers
} from 'hooks/usePropertyOffer'
import { IBuyer } from 'interfaces/buyerOffer'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { propertyOfferAtom } from 'store/atoms/atoms'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Drawer } from 'components/common/Drawer'
import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { MessageItem } from 'components/messages/MessageItem'
import { EmptyPlaceholder } from 'components/common/EmptyPlaceholder'
import { propertyReadWriteAtom } from 'store/atoms/property'
import { getCookie } from 'cookies-next'
import { AUTH_ROLE } from 'shared/constants/env'
import { useFetchPropertyCounterOffers, useGetPropertyOffersByProperty, usePropertyServiceAPI } from 'lib/api/property'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { claimedPropertyReadWriteAtom } from 'store/atoms/claimed-property'
import { SellerPropertyTransactionItem } from 'components/overview/SellerPropertyTransactionItem'

const Offers = () => {
  const router = useRouter()
  const params = useParams()
  const search = useSearchParams()
  const type = search.get('type')
  const id = params?.id as string
  const [currentAgent] = useAtom(agentReadWriteAtom);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [offer, setOffer] = useState(null)
  // const { data, isLoading, error } = useAllPropertyOffers(id as string)
  const [loading, setLoading] = useState(false);
  const [_, setSelectedOffer] = useAtom(propertyOfferAtom)
  const [claimedProperty, setClaimedProperty] = useAtom(claimedPropertyReadWriteAtom)

  const { useUpdatePropertyOffer , useUpdatePropertyCounterOffer } = usePropertyServiceAPI()
  const { data: propertyOffers, isLoading: offerLoading, error } = useGetPropertyOffersByProperty(claimedProperty?.id?.toString(), claimedProperty?.listingid?.toString());
  const handleOfferClick = (offer: IBuyer) => {
    setSelectedOffer(offer)
    router.push(`/offers/${offer.id}?type=offer`)
  }
  const { data: propertyCounterOffers, isLoading: counterOfferLoading } = useFetchPropertyCounterOffers(claimedProperty?.id?.toString(), claimedProperty?.listingid?.toString());
  
  const offerStatusHandler = async (offerId: string, status: string) => {
    const input = { offerId, status }
    await useUpdatePropertyOffer.mutate(input)
  }

  const counterOfferStatusHandler = async (offerId: string, status: string) => {
    const input = { offerId, status }
    await useUpdatePropertyCounterOffer.mutate(input)
  }
  const viewCounerOfferDetail = (offer) => {

    router.push(`/counter-offer/${offer.id}/view?type=counter-offer`)
  }

  console.log(propertyCounterOffers)
  return (
    <>
      <section className="pb-24">
        <SellerPropertyTransactionItem />
        {propertyOffers?.length > 0 ? (
          <>
            <h2 className="text-xl font-bold my-6">Offers</h2>
            <section className="bg-white rounded-md px-4 py-6">
              <section className="w-2/5 mb-5">
                <SearchInput />
              </section>

              <section className="flex flex-wrap gap-5 items-center">
                {propertyOffers?.map((offer, index) => {
                
                  return (
                    <BuyerOfferCard
                      onClick={() => handleOfferClick(offer)}
                 
                      key={offer.id + index.toString()}
                      openComment={() => {
                        setIsDrawerOpen((prev) => !prev)
                        setOffer(offer)
                      }}
                      offerId={offer?.id}
                      buyer={offer.buyer}
                      userId={offer?.createdBy?.id}
                      offerPrice={offer}
                      financeType={offer.financeType}
                      downPayment={offer.downPayment}
                      loading={status === 'pending'}
                      stauts={offer?.status}
                      offerStatusHandler={offerStatusHandler}
                      isCounterOffer={false}
                    
                    />
                  )

                })}
              </section>
            </section>
          </>
        ) : (
          <EmptyPlaceholder
            transactionImage=''
            EmptyPlaceHolderImage="/assets/images/icons/offers.svg"
            title="Offer"
            description="No offers yet."
          />
        )}
      </section>
      <Drawer
        buyerName={offer?.buyer?.fullname}
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        bottom={
          <section className="absolute bg-white h-30 w-full z-30 bottom-0 pb-5 overflow-hidden ">
            <section className="rounded-sm  h-full">
              <section className="w-full">
                <textarea
                  name=""
                  className="resize-none w-full bg-transparent px-4 py-2 placeholder-shown:border-transparent disabled:border-0 disabled:bg-transparent border-none border-transparent focus:border-transparent focus:ring-0 focus:outline-none"
                />
              </section>
              <section className="flex justify-end items-center">
                <RoundedButton
                  label="Send"
                  onClick={() => { }}
                  variant="primary"
                  className="py-2 px-7 bg-black text-white"
                />
              </section>
            </section>
          </section>
        }>
        <MessageItem
          text="right now, if you can"
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={false}
          parentStyle="rounded-md"
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text="right now, if you can"
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={false}
          parentStyle="rounded-md"
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />{' '}
        <MessageItem
          text="right now, if you can"
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={false}
          parentStyle="rounded-md"
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text="right now, if you can"
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={false}
          parentStyle="rounded-md"
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />{' '}
        <MessageItem
          text="right now, if you can"
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={false}
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text="right now, if you can"
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={false}
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text="right now, if you can"
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={false}
        />
        <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
      </Drawer>
    </>
  )
}

export default Offers
