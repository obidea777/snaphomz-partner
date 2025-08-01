'use client'

import { useSingleProperty } from 'hooks/usePropertyOffer'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React from 'react'
import { claimedPropertyReadWriteAtom } from 'store/atoms/claimed-property'
import { propertyReadWriteAtom } from 'store/atoms/property'
import { formatDate } from 'utils/dateutilities'
import { formatNumber } from 'utils/mathutilities'
import { shortenAddress } from 'utils/stringsUtilities'
import { cn } from 'utils/styleUtilities'

type IPropertyTransactionItemProps = {
  showTransactionInformation?: boolean
  className?: string
}

const SellerPropertyTransactionItem: React.FC<IPropertyTransactionItemProps> = ({
  showTransactionInformation = true,
  className
}) => {
  const params = useParams()
  const id = params?.id
  const [claimedProperty, setClaimedProperty] = useAtom(claimedPropertyReadWriteAtom)
 console.log(claimedProperty)
 

  return (
    <section className="flex-wrap flex items-start bg-[#0A0A0A] rounded-xl py-3 px-5 w-full gap-12">
      <section className={cn('flex items-start gap-x-12 w-1/2', className)}>
        {claimedProperty?.mls_data?.data?.media?.primaryListingImageUrl ? (
          <section className="rounded-lg h-24 overflow-hidden relative w-1/2">
            <Image
              src={claimedProperty?.mls_data?.data?.media?.primaryListingImageUrl}
              alt={shortenAddress(claimedProperty?.image)}
              className="rounded-lg object-cover"
              fill
              priority
              unoptimized
            />
          </section>
        ) : (
          <div className="text-white flex items-center justify-center h-24 w-full">
            No image available
          </div>
        )}
        <section className="w-1/2">
          <h2 className="font-light text-white text-md pt-5">
          {claimedProperty?.mls_data?.data?.address?.unparsedAddress}
          </h2>
          <h3 className="text-[#BABABA] text-base">
          {claimedProperty?.mls_data?.data?.address?.unparsedAddress} (
              {claimedProperty?.mls_data?.data?.address?.city}),{' '}
              {claimedProperty?.mls_data?.data?.address?.zipCode}
          </h3>
        </section>
      </section>
    
      {showTransactionInformation ? (
        <section className="px-6 xl:w-2/5 items-center justify-end flex">
          <section className="flex items-center w-full gap-x-12 justify-end pt-5">
            <section className="">
              <h2 className="font-bold text-white text-md">
              {formatNumber(+claimedProperty?.mls_data?.data?.listPrice || 100)}
              </h2>
              <h3 className="text-[#BABABA] text-base">Property value</h3>
            </section>
            <section className="">
              {/* <h2 className="font-bold text-white text-md ">{`${day} ${month} ${year}`}</h2> */}
              <h3 className="text-[#BABABA] text-base">Date of exchange</h3>
            </section>
          </section>
        </section>
      ) : null}
    </section>
  )
}

export { SellerPropertyTransactionItem }
