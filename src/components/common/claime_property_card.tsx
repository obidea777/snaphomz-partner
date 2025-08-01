'use client'

import { Property } from 'app/listing/page'
import Image from 'next/image'
import React, { ReactElement } from 'react'
import { formatNumber } from 'utils/mathutilities'
import { shortenAddress } from 'utils/stringsUtilities'
import { cn } from 'utils/styleUtilities'

type IPropertyCardProps = {
  children?: ReactElement
  badgeStatus?: string
  property: any
  className?: string
}

const ClaimePropertyCard: React.FC<IPropertyCardProps> = ({
  badgeStatus,
  children,
  property,
  className
}) => {
  const badgeColor =
    badgeStatus?.toLocaleLowerCase() === 'pending'
      ? 'bg-[#FF8700]'
      : badgeStatus?.toLocaleLowerCase() === 'now showing'
        ? 'bg-[#ACF337]'
        : 'bg-[#F7F2EB]'


        console.log(property)

  return (
    <section className={cn('w-[26rem] rounded-2xl overflow-hidden', className)}>
      <section className="h-[12rem] overflow-hidden relative w-full">
        {property?.status ? (
          <div
            className={cn(
              `absolute top-6 left-5 ${badgeColor} px-7 py-1 rounded-full z-10`
            )}>
            <p className="font-bold text-sm">{property?.status}</p>
          </div>
        ) : null}

        <img
          src={property?.image || property?.mls_data?.data?.media?.primaryListingImageUrl}
          alt={shortenAddress(property?.name || 'Property Image')}
          className="object-cover"

          // height={220}
          // width={464}
        />
      </section>
      <section className="bg-[#0A0A0A] px-8 pt-4 pb-8 rounded-b-2xl ">
        <h2 className="text-[#F7F2EB] font-semibold text-[1.8rem]">
          {formatNumber(property?.price|| property?.mls_data?.data?.listPrice ||  0)}
        </h2>
        <div className="h-16 mb-2">
          {/* <p className="text-lg font-normal mt-2 text-[#F7F2EB]">
            {shortenAddress(property?.name || property?.mls_data?.data?.courtesyOf)}
          </p> */}
          <p className="text-lg font-normal mt-2 text-[#F7F2EB]">
            {property?.address} {property?.city} {property?.zipCode}
          </p>
        </div>

        {children}
      </section>
    </section>
  )
}

export { ClaimePropertyCard }
