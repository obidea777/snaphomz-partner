'use client'

import { BuyerOfferCard } from 'components/common/BuyerOfferCard'
import { SearchInput } from 'components/common/inputs/SearchInput'
import { UpcomingTourCard } from 'components/common/UpcomingTourCard'
import { StatisticsSection } from 'components/dashboard/StatisticsSection'
import { PropertyDetailsItem } from 'components/overview/PropertyDetailsItem'
import {
  useUpdatePropertyOffer,
  useAllPropertyOffers,
  useOfferComments,
  usePropertyOfferComment
} from 'hooks/usePropertyOffer'
import { useFetchFutureTours } from 'hooks/useTours'
import { useAtom } from 'jotai'
import { propertyOfferAtom } from 'store/atoms/atoms'
import { IBuyer } from 'interfaces/buyerOffer'
import { useRouter, useParams } from 'next/navigation'
import { shortenAddress } from 'utils/stringsUtilities'
import { formatDate } from 'utils/dateutilities'
import { useEffect, useState } from 'react'
import { Drawer } from 'components/common/Drawer'
import { MessageItem } from 'components/messages/MessageItem'
import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { SellerPropertyDetailsItem } from 'components/overview/SellerPropertyDetailsItem'
import { SellerPropertyTransactionItem } from 'components/overview/SellerPropertyTransactionItem'

type IPropertyInformationProps = {
  params: { slug: string }
}

const PropertyInformation: React.FC<IPropertyInformationProps> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [curentOffer, setCurrentOffer] = useState(null)

  const router = useRouter()

  const params = useParams()
  const id = params?.id
  const { data, isLoading, error } = useAllPropertyOffers(id as string)
  const result = data?.data?.result
  const {
    data: futureTours,
    refetch,
    isLoading: toursLoading
  } = useFetchFutureTours()
  const tours = futureTours?.data?.result

  const [selectedOffer, setSelectedOffer] = useAtom(propertyOfferAtom)
  const handleOfferClick = (offer: IBuyer) => {
    setSelectedOffer(offer)
    if (router) {
      router.push(`/offers/${offer.id}`)
    }
  }

  const firstTour = tours?.data?.result?.[0]
  const { month, day } = firstTour?.eventDate?.[0]?.eventDate
    ? formatDate(firstTour?.eventDate?.[0]?.eventDate)
    : { month: '--', day: '--' }
  const [{ mutateAcceptPropertyOffer, status }] = useUpdatePropertyOffer()
  const handleAcceptPropertyOffer = (offerId) => {
    const body = {
      header: ' ',
      body: ' ',
      offerId: offerId,
      response: true,
      notifyOtherParties: true
    }

    mutateAcceptPropertyOffer({
      body: body
    })
  }
  const [message, setMessage] = useState('')

  const [selectedOfferId, setSelectedOfferId] = useState(null)
  const { data: offerCommentsData } = useOfferComments(selectedOfferId)
  const offerComments = offerCommentsData?.data.result
  const {
    mutate: addPropertyOfferComment,
    status: PropertyOfferCommentStatus,
    data: OfferComment
  } = usePropertyOfferComment(selectedOfferId)

  return (
    <>
      <section className={`w-full p-6 flex flex-col gap-12`}>
        {/* <PropertyDetailsItem /> */}
        <SellerPropertyDetailsItem/>
        <section className="flex justify-between">
          <StatisticsSection />
          <UpcomingTourCard
            tourDate={day}
            tourMonth={month}
            tourTime={firstTour?.eventDate?.[0]?.tourTime}
            address={shortenAddress(
              firstTour?.property?.propertyAddressDetails?.formattedAddress
            )}
            {...firstTour}
            className="w-full"
          />
        </section>
        {result?.length > 0 ? (
          <section className="w-full bg-white rounded-2xl p-3 flex gap-6 flex-col">
            <SearchInput />
            <section className="grid grid-cols-3 gap-4">
              {result?.map((offer, index) => (
                <BuyerOfferCard
                  key={offer._id + index.toString()}
                  openComment={() => {
                    setIsDrawerOpen((prev) => !prev)
                    setCurrentOffer(offer)
                    setSelectedOfferId(offer._id)
                  }}
                  onClick={() => handleOfferClick(offer)}
                  buyer={offer.buyer}
                  offerPrice={offer.offerPrice}
                  financeType={offer.financeType}
                  downPayment={offer.downPayment}
                  handleAcceptOffer={() => handleAcceptPropertyOffer(offer._id)}
                  loading={status === 'pending'}
                />
              ))}
            </section>
          </section>
        ) : null}
      </section>
      <Drawer
        buyerName={curentOffer?.buyer?.fullname}
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        bottom={
          <section className="absolute bg-white h-30 w-full z-30 bottom-0 pb-5 overflow-hidden ">
            <section className="rounded-sm  h-full">
              <section className="w-full">
                <textarea
                  name="message"
                  onChange={(e) => {
                    setMessage(e.target.value)
                  }}
                  value={message}
                  className="resize-none w-full bg-transparent px-4 py-2 placeholder-shown:border-transparent disabled:border-0 disabled:bg-transparent border-none border-transparent focus:border-transparent focus:ring-0 focus:outline-none"
                />
              </section>
              <section className="flex justify-end items-center">
                <RoundedButton
                  label="Send"
                  onClick={() => {
                    addPropertyOfferComment({
                      offerId: curentOffer?._id,
                      comment: message
                    })
                    setMessage('')
                  }}
                  variant="primary"
                  className="py-2 px-7 bg-black text-white"
                />
              </section>
            </section>
          </section>
        }>
        {offerComments?.map((comment, index) => {
          const { time } = formatDate(comment.createdAt)
          return (
            <MessageItem
              key={comment.user + index.toString()}
              text={comment?.comment}
              time={time}
              isFromLoggedInUser={true}
              childStyle="bg-transparent"
            />
          )
        })}
        {/* <MessageItem
          text={`Hello John, I missed out on a few documents, so I attached it
                right now, if you can sign on it right away, I will really
                appreciate that you know.`}
          time={'2:30pm'}
          isFromLoggedInUser={false}
          parentStyle="rounded-md"
        />
        <MessageItem
          text={'hello'}
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text={'offerComments'}
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        />
        <MessageItem
          text={'offerComments'}
          time={'2:30pm'}
          isFromLoggedInUser={true}
          childStyle="bg-transparent"
        /> */}
      </Drawer>
    </>
  )
}

export default PropertyInformation
