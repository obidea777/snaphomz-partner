'use client'

import { RoundedButton } from 'components/common/buttons/RoundedButton'
import LoadingState from 'components/common/LoadingState'
import { PropertyTransactionItem } from 'components/overview/PropertyTransactionItem'
import { UserInfoDealCard } from 'components/overview/UserInfoDealCard'
import { useSingleProperty } from 'hooks/usePropertyOffer'
import { useAtom } from 'jotai'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Transactionpage = () => {
  const router = useRouter()

  const [allAgents, setAllAgents] = useState([])
  const params = useParams()
  const id = params?.id
  const { data: singlePropertyData, isLoading: singlePropertyLoading } =
    useSingleProperty(id as string)

  const completeAllAgentsArray = (property) => {
    if (property === null || property === undefined) return
    const broker = {
      firstName: property?.brokers[0]?.agent?.firstName || '__',
      lastName: property?.brokers[0]?.agent?.lastName || '__',
      role: 'Broker'
    }
    const buyerAgent = {
      firstName: property?.buyerAgent?.firstName || '__',
      lastName: property?.buyerAgent?.lastName || '__',
      role: 'Buyer Agent'
    }
    const sellerAgent = {
      firstName: property?.sellerAgent?.firstName || '__',
      lastName: property?.sellerAgent?.lastName || '__',
      role: 'Seller Agent'
    }
    setAllAgents([broker, buyerAgent, sellerAgent])
  }

  useEffect(() => {
    completeAllAgentsArray(singlePropertyData?.data?.property)
  }, [singlePropertyData])

  const handleViewOffers = () => {
    router.push(
      `/dashboard/sell/${singlePropertyData?.data?.property?._id}/offers`
    )
  }

  return (
    <section className="">
      <section className="bg-white rounded-xl p-6">
        <PropertyTransactionItem />
        <section className="mt-6">
          <section className="grid grid-cols-3 gap-4">
            {
              singlePropertyLoading
                ? Array(3)
                    .fill(null)
                    .map((_, index) => (
                      <LoadingState key={index} keyType="div" />
                    ))
                : null

              // allAgents.map((agent, index) => (
              //     <UserInfoDealCard
              //       key={agent?.firstName + index.toString()}
              //       rightComponent={
              //         <Image
              //           src="/assets/images/icons/message.svg"
              //           alt="chat"
              //           height={24}
              //           width={24}
              //         />
              //       }
              //       name={`${agent?.firstName} ${agent?.lastName}`}
              //       role={agent?.role}
              //     />
              //   ))
            }
          </section>
        </section>
      </section>
      <section className="w-full items-center justify-center flex flex-col gap-3 pt-20">
        <section className="border border-solid border-white bg-white items-center justify-center flex rounde-lg px-2 py-2">
          <Image
            src="/assets/images/icons/verified.svg"
            alt="chat"
            height={24}
            width={24}
          />
        </section>
        <p className="font-bold text-xl text-black">Offer Transaction</p>
        <p className="text-base text-[#8E929C]">
          Accept an offer to begin transaction
        </p>
        <RoundedButton
          label="View Offers"
          onClick={handleViewOffers}
          variant="primary"
          className="bg-black text-white py-2 text-sm mt-10"
        />
      </section>
    </section>
  )
}

export default Transactionpage
