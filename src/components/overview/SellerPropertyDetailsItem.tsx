'use client'

import { RoundedButton } from 'components/common/buttons/RoundedButton'
import CircularProgressBar from 'components/common/CircularProgressBar'
import Modal from 'components/common/Modal'
import Publish from 'components/dashboard/Publish'
import { useSingleProperty } from 'hooks/usePropertyOffer'
import { useAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { propertyDetailsAtom } from 'store/atoms/atoms'
import { claimedPropertyReadWriteAtom } from 'store/atoms/claimed-property'
import { propertyReadWriteAtom } from 'store/atoms/property'
import { formatNumber } from 'utils/mathutilities'
import { shortenAddress } from 'utils/stringsUtilities'

const SellerPropertyDetailsItem = () => {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const [engagedProperty] = useAtom(propertyReadWriteAtom)
  const [claimedProperty, setClaimedProperty] = useAtom(claimedPropertyReadWriteAtom)
  const { data: singlePropertyData, isLoading: singlePropertyLoading } = useSingleProperty(id as string)
  const selectedProperty = singlePropertyData?.data?.property
  const handleEditPropertyClick = () => {
    router.push(`/dashboard/sell/${engagedProperty?.selectedProperty?.id}`)
  }
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const handleModal = () => {
    setIsOpen(!isOpen)
  }  
  return (
    <section className="flex-wrap flex items-center bg-[#0A0A0A] rounded-xl py-6 px-5 w-full gap-12">
      <section className="rounded-lg h-[12rem] overflow-hidden relative w-[30%]">
        {claimedProperty?.mls_data?.data?.media?.primaryListingImageUrl ? (
          <Image
            // src="/assets/images/property.png"
            // alt="Property name"
            src={claimedProperty?.mls_data?.data?.media?.primaryListingImageUrl}
            alt={claimedProperty?.mls_data?.data?.media?.primaryListingImageUrl}
            fill
            priority
            unoptimized
            className="rounded-md object-cover"
          />
        ) : (
          <div className="text-white flex items-center justify-center h-full w-full">
            No image available
          </div>
        )}
      </section>
      <section className="px-6 md:w-3/5">
        <section className="flex items-center justify-between">
          <section className="w-3/5">
            <h2 className="font-light text-white text-md w-11/12">
              {claimedProperty?.mls_data?.data?.address?.unparsedAddress}
            </h2>
            <h3 className="text-[#BABABA] text-base">
              {claimedProperty?.mls_data?.data?.address?.unparsedAddress} (
              {claimedProperty?.mls_data?.data?.address?.city}),{' '}
              {claimedProperty?.mls_data?.data?.address?.zipCode}
            </h3>
            <h1 className="text-white font-bold text-xl">
              {formatNumber(+claimedProperty?.mls_data?.data?.listPrice || 100)}
            </h1>
          </section>
          <section className="">
            {/* <CircularProgressBar
              size={100}
              strokeWidth={8}
              percentage={engagedProperty?.selectedProperty?.propertyProgress}
              backgroundColor="#CBCBCB"
              progressColor="white"
            /> */}
          </section>
        </section>
        {loading ? (
          <section className="flex items-center gap-4 mt-7">
            <Link
              href={`/listing/listing-preview/${claimedProperty?.id}`}
              className="w-1/5">
              <RoundedButton
                label="View"
                onClick={() => {}}
                className="w-full py-2"
                variant="primary"
              />
            </Link>
            {/* <RoundedButton
              label="Create Offer"
              onClick={() => handleEditPropertyClick()}
              variant="danger"
              className="w-2/5 py-2"
            /> */}
            <RoundedButton
              label="Share"
              onClick={() => {
                handleModal()
              }}
              variant="danger"
              className="w-1/5 py-2"
            />
            <RoundedButton
              label="Leave"
              onClick={() => {
                router.push('/partner-dashboard')
              }}
              variant="danger"
              className="w-1/5 py-2"
            />
            <Modal isOpen={isOpen} closeModal={handleModal}>
              <Publish closeModal={handleModal} />
            </Modal>
          </section>
        ) : (
          <section className="flex items-center gap-4 mt-7">
            <Link
              href={`/listing/listing-preview/${claimedProperty?.id}`}
              className="w-1/5">
              <RoundedButton
                label="Preview"
                onClick={() => {}}
                className="w-full py-2"
                variant="primary"
              />
            </Link>
            <RoundedButton
              label="Edit"
              onClick={() => handleEditPropertyClick()}
              variant="danger"
              className="w-1/5 py-2"
            />
            <RoundedButton
              label="Publish"
              onClick={() => {
                handleModal()
              }}
              variant="danger"
              className="w-1/5 py-2"
            />
            <RoundedButton
              label="Share"
              onClick={() => {}}
              variant="danger"
              className="w-1/5 py-2"
            />
            <Modal isOpen={isOpen} closeModal={handleModal}>
              <Publish closeModal={handleModal} />
            </Modal>
          </section>
        )}
      </section>
    </section>
  )
}

export { SellerPropertyDetailsItem }
