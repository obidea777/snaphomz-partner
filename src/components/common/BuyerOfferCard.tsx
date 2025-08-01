'use client'

import Image from 'next/image'
import React from 'react'
import { formatNumber } from 'utils/mathutilities'
import { RoundedButton } from './buttons/RoundedButton'
import ProfileCircle from './ProfileCircle'
import { IBuyerOffer } from 'interfaces/buyerOffer'
import { useAtom } from 'jotai'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { Badge } from 'components/ui/badge'

type IBuyerOfferCardProps = IBuyerOffer & {
  openComment?: () => void
  loading?: boolean
}

const BuyerOfferCard: React.FC<any> = ({
  buyer,
  offerPrice,
  financeType,
  downPayment,
  onClick,
  openComment,
  isCounterOffer = false,
  offerStatusHandler,
  loading,
  isFinalized = false,
  userId,
  status,
  counterOffer,
  userType,
  offerFinalization,
  coutnerOfferStatusHandler,
  viewCounterOffer
}) => {
  const [currentAgent] = useAtom(agentReadWriteAtom);
  console.log("Offers Pricesss :  ", offerPrice, counterOffer)
  return (
    < div className='flex items-center w-full justify-between gap-4'>
      <section className="bg-[#F8F8F8] w-[320px] rounded-2xl px-6 pt-6 pb-2 ">
        <section className="flex items-center justify-between mb-6">
          {/* <div className="py-1 px-4 flex items-center justify-center bg-[#FFB576] text-black text-xs font-bold rounded-full">
          {status}
        </div> */}
          <Badge
            className={`
      ${offerPrice?.status === 'PENDING' ? 'bg-orange-500' : ''}
      ${offerPrice?.status === 'ACCEPTED' ? 'bg-green-500' : ''}
      ${offerPrice?.status === 'REJECTED' ? 'bg-red-500' : ''}
       ${offerPrice?.status === 'APPROVED' ? 'bg-blue-500' : ''}
    `}
          >
            {offerPrice?.status}
          </Badge>
          <div className="flex items-center gap-2">
            <Image
              className=" cursor-pointer"
              onClick={openComment}
              src="/assets/images/icons/chatIcon.svg"
              alt="chat"
              height={24}
              width={24}
            />
            <Image
              src="/assets/images/icons/starIconOrange.svg"
              alt="star"
              height={20}
              width={20}
            />
          </div>
        </section>
        <ProfileCircle
          placeholder={`${buyer?.firstName[0]?.toUpperCase() || 'X'}${buyer?.lastName[0]?.toUpperCase() || 'X'}`}
        />
        <section className="w-4/5 mb-4">
          <h2 className="font-bold text-xl">{offerPrice?.createdBy?.firstName} {offerPrice?.createdBy?.lastName}</h2>
          <p className="text-md text-[#707070]">{offerPrice?.createdBy?.email}</p>
          <p className="text-md text-[#707070]">
            Mobile: {offerPrice?.createdBy?.phone}
          </p>
        </section>
        <p className="text-md text-[#707070] font-medium">Offer Price</p>
        <h1 className="font-bold text-2xl mb-6">
          {formatNumber(offerPrice?.price)}
        </h1>

        <section className="flex items-center justify-between mb-6">
          <section className="">
            <p className="text-md text-[#777777] font-medium">Finance Type</p>
            <p className="text-lg text-black font-medium capitalize">
              {financeType}
            </p>
          </section>
          <section className="">
            <p className="text-md text-[#777777] font-medium">Down Payment</p>
            <p className="text-lg text-black font-medium">
              {formatNumber(downPayment)}
            </p>
          </section>
        </section>
        <section className="flex items-center justify-between mb-6">
          {
            (offerPrice?.status == 'APPROVED' && userType === "seller" && !counterOffer) ?
              <RoundedButton
                variant="secondary"
                onClick={() => offerStatusHandler(offerPrice?.id, 'DECLINED')}
                loading={loading}
                label="Reject Offer"
                className="py-2 text-black border  text-xs border-solid w-full border-black px-5"
              /> : null}

          {
            offerPrice?.status == 'APPROVED' && userType === "seller" && !counterOffer ?
              <RoundedButton
                variant="secondary"
                onClick={() => offerStatusHandler(offerPrice?.id, 'ACCEPTED')}
                loading={loading}
                label="Accept Offer"
                className="py-2 text-black  text-xs border border-solid  w-full border-black px-5"
              /> : null
          }

          {/* {
          (offerPrice?.status == 'APPROVED'  && userType === "seller")  ? 
          <RoundedButton
            variant="secondary"
            onClick={() => offerStatusHandler(offerPrice?.id , '')}
            loading={loading}
            label="Reject Offer"
            className="py-2 text-black border border-solid w-full border-black px-5"
          /> : null} */}

          {
            offerPrice?.status == 'PENDING' && currentAgent?.user?.id !== offerPrice?.createdBy?.id && userType === "buy" ?
              <RoundedButton
                variant="secondary"
                onClick={() => offerStatusHandler(offerPrice?.id, 'APPROVED' , offerPrice)}
                loading={loading}
                label="Approve Offer"
                className="py-2 text-black  text-xs border border-solid  w-full border-black px-5"
              /> : null
          }


          {/* {isCounterOffer && offerPrice?.status == 'PENDING' ? (
          <RoundedButton
            variant="secondary"
            onClick={() => offerStatusHandler(offerPrice?.id, 'DECLINED')}
            loading={loading}
            label="Reject Offer"
            className="py-2 text-black border border-solid w-full border-black px-5"
          />
        ) : null}

        {isCounterOffer && offerPrice?.status == 'PENDING' ? (
          <RoundedButton
            variant="secondary"
            onClick={() => offerStatusHandler(offerPrice?.id, 'ACCEPTED')}
            loading={loading}
            label="Accept Offer"
            className="py-2 text-black border border-solid w-full border-black px-5"
          />
        ) : null} */}

          {(offerPrice?.createdBy?.id != currentAgent?.user?.id && !offerPrice?.isBuyer) ? (
            <>
              <RoundedButton
                variant="primary"
                onClick={() => offerFinalization(offerPrice?.id, 'FINALIZED' , offerPrice)}
                loading={loading}
                label="Finalize Offer"
                className="py-2 text-white bg-orange-600 hover:bg-green-700 border-none w-full px-5"
              />
              <br /></>
          ) : null}

          {(offerPrice?.createdBy?.id !== currentAgent?.user?.id && offerPrice?.isBuyer && offerPrice?.status !== 'ACCEPTED') ? (
            <>
              <RoundedButton
                variant="secondary"
                onClick={() => offerStatusHandler(offerPrice?.id, 'ACCEPTED')}
                loading={loading}
                label="Accept Offer"
                className="py-2 text-black border border-solid w-full border-black px-5"
              />
              <br /></>
          ) : null}
          {offerPrice?.status === 'ACCEPTED' ? (
            <>
              <RoundedButton
                variant="secondary"
                onClick={() => window.open('https://www.zipformplus.com/')}
                loading={loading}
                label="Sign Document"
                className="py-2 text-black border border-solid w-full border-black px-5"
              />
              <br /></>
          ) : null}
          <RoundedButton
            variant="secondary"
            onClick={onClick}
            label="View Offer"
            className="py-2 text-white  text-xs bg-black px-5 w-full "
          />
        </section>
      </section>
      {
        counterOffer &&
        <div className='flex flex-col items-center gap-4'>
          <p className='font-semibold'>Counter Offer</p>
          <Image
            className=" cursor-pointer"
            onClick={openComment}
            src="/assets/images/counter-arrow.png"
            alt="chat"
            height={96}
            width={96}
          />
        </div>

      }

      {
        counterOffer &&

        <section className="bg-[#F8F8F8] rounded-2xl px-6 pt-6 pb-2 w-[320px]">
          <section className="flex items-center justify-between mb-6">
            {/* <div className="py-1 px-4 flex items-center justify-center bg-[#FFB576] text-black text-xs font-bold rounded-full">
            {status}
          </div> */}
            <Badge
              className={`
        ${counterOffer?.status === 'PENDING' ? 'bg-orange-500' : ''}
        ${counterOffer?.status === 'ACCEPTED' ? 'bg-green-500' : ''}
        ${counterOffer?.status === 'REJECTED' ? 'bg-red-500' : ''}
      `}
            >
              {counterOffer?.status}
            </Badge>
            <div className="flex items-center gap-2">
              {

              }
              <Image
                className=" cursor-pointer"
                onClick={openComment}
                src="/assets/images/icons/chatIcon.svg"
                alt="chat"
                height={24}
                width={24}
              />
              <Image
                src="/assets/images/icons/starIconOrange.svg"
                alt="star"
                height={20}
                width={20}
              />
            </div>
          </section>
          <ProfileCircle
            placeholder={`${counterOffer?.createdBy?.firstName[0]?.toUpperCase() || 'X'}${buyer?.lastName[0]?.toUpperCase() || 'X'}`}
          />
          <section className="w-4/5 mb-4">
            <h2 className="font-bold text-xl">{counterOffer?.createdBy?.firstName} {counterOffer?.createdBy?.lastName}</h2>
            <p className="text-md text-[#707070]">{counterOffer?.createdBy?.email}</p>
            <p className="text-md text-[#707070]">
              Mobile: {counterOffer?.createdBy?.phone}
            </p>
          </section>
          <p className="text-md text-[#707070] font-medium">Offer Price</p>
          <h1 className="font-bold text-2xl mb-6">
            {formatNumber(counterOffer?.price)}
          </h1>

          <section className="flex items-center justify-between mb-6">
            <section className="">
              <p className="text-md text-[#777777] font-medium">Finance Type</p>
              <p className="text-lg text-black font-medium capitalize">
                {financeType}
              </p>
            </section>
            <section className="">
              <p className="text-md text-[#777777] font-medium">Down Payment</p>
              <p className="text-lg text-black font-medium">
                {formatNumber(downPayment)}
              </p>
            </section>
          </section>
          <section className="flex items-center gap-1 justify-between mb-6">
            {
              (counterOffer?.status == 'APPROVED' && userType === "seller") ?
                <RoundedButton
                  variant="secondary"
                  onClick={() => coutnerOfferStatusHandler(counterOffer?.id, 'DECLINED')}
                  loading={loading}
                  label="Reject Offer"
                  className="py-2 text-black border  text-xs border-solid w-full border-black px-5"
                /> : null}

            {
              counterOffer?.status == 'APPROVED' && userType === "seller" ?
                <RoundedButton
                  variant="secondary"
                  onClick={() => coutnerOfferStatusHandler(counterOffer?.id, 'ACCEPTED')}
                  loading={loading}
                  label="Accept Offer"
                  className="py-2 text-black border border-solid  text-xs  w-full border-black px-5"
                /> : null
            }
            {
              counterOffer?.status == 'PENDING' && currentAgent?.user?.id !== counterOffer?.createdBy?.id && userType === "seller" ?
                <RoundedButton
                  variant="secondary"
                  onClick={() => coutnerOfferStatusHandler(counterOffer?.id, 'APPROVED')}
                  loading={loading}
                  label="Approve Counter Offer"
                  className="py-2 text-black border  text-xs border-solid  w-full border-black px-5"
                /> : null
            }
            <RoundedButton
              variant="secondary"
              onClick={viewCounterOffer}
              label="View Counter Offer"
              className="py-2 text-white text-xs bg-black px-5 w-full "
            />
          </section>
        </section>
      }


    </div>
  )
}

export { BuyerOfferCard }
