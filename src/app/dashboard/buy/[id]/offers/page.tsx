'use client'

import { BuyerOfferCard } from 'components/common/BuyerOfferCard'
import { SearchInput } from 'components/common/inputs/SearchInput'
import { PropertyTransactionItem } from 'components/overview/PropertyTransactionItem'
import {
  useAllPropertyOffers
} from 'hooks/usePropertyOffer'
import { IBuyer } from 'interfaces/buyerOffer'
import { useAtom } from 'jotai'
import React, { useContext, useEffect, useState } from 'react'
import { propertyOfferAtom } from 'store/atoms/atoms'
import { useParams, useRouter } from 'next/navigation'
import { Drawer } from 'components/common/Drawer'
import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { MessageItem } from 'components/messages/MessageItem'
import { EmptyPlaceholder } from 'components/common/EmptyPlaceholder'
import { getCookie } from 'cookies-next'
import { AUTH_ROLE } from 'shared/constants/env'
import { usePropertyServiceAPI } from 'lib/api/property'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { SocketContext } from 'providers/socket.context'

const Offers = () => {
  const router = useRouter()
  const params = useParams()
  const { socket, state, setState } = useContext(SocketContext)
  const id = params?.id as string
  const [currentAgent] = useAtom(agentReadWriteAtom);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [offer, setOffer] = useState(null)
  const { data, isLoading, error } = useAllPropertyOffers(id as string)
  const [loading, setLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useAtom(propertyOfferAtom)
  const currentAgentType = getCookie(AUTH_ROLE)
  const { getOffersPropertyByEngagementId, useUpdatePropertyOffer,finalizeOffer } = usePropertyServiceAPI()

  const handleOfferClick = (offer: IBuyer) => {
    console.log(offer)
    setSelectedOffer(offer)
    router.push(`/offers/${offer.id}`)
  }

  const getEngagedProperty = () => {
    setLoading(true)
    getOffersPropertyByEngagementId.mutate(id, {
      onSuccess: (response) => {
        setLoading(false)
        // console.log(response?.data)
        setOffer(response?.data?.data?.getPropertyOfferByEngagementId)
        // setPropertyData(response.data?.data?.getBuyerAgentEngagementsByAgentId)
      },
      onError: (error) => {
        console.log('Error in mutation: ', error)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    getEngagedProperty()
  }, [])

  console.log(offer)

  const offerStatusHandler = async (offerId: string, status: string) => {
    const input = { offerId, status }
    useUpdatePropertyOffer.mutate(input)

  }

  const offerFinalization = async (offerId: string, status: string) => {
    const input = { offerId, status }
    finalizeOffer.mutate({
      id:offerId,
      finalizeType:"isBuyer"
    })
  }

  return (
    <>
      <section className="pb-24">
        <PropertyTransactionItem />
        {offer?.length > 0 ? (
          <>
            <h2 className="text-xl font-bold my-6">Offers</h2>
            <section className="bg-white rounded-md px-4 py-6">
              <section className="w-2/5 mb-5">
                <SearchInput />
              </section>

              <section className="grid grid-cols-3 flex-wrap gap-5 items-center">
                {offer?.map((offer, index) => (
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
                    offerFinalization={offerFinalization}
                    offerStatusHandler={offerStatusHandler}
                    isCounterOffer={offer?.createdBy?.id != currentAgent?.user?.id}
                    isFinalized={offer?.createdBy?.id != currentAgent?.user?.id && offer?.isBuyer}
                  />
                ))}
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
