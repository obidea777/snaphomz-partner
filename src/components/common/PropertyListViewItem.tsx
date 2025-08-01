'use client'

import { Property } from 'app/listing/page'
import Image from 'next/image'
import React, { useState } from 'react'
import { formatNumber } from 'utils/mathutilities'
import { cn } from 'utils/styleUtilities'
import { RoundedButton } from './buttons/RoundedButton'
import { useAtom } from 'jotai'
import { propertyReadWriteAtom } from 'store/atoms/property'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { authUser } from 'lib/api/zipform'
import { useRouter } from 'next/navigation'

type IPropertyListViewItemProps = {
  property: any
  badgeStatus?: string
  openProperty: () => void
  deleteProperty: () => void
  editProperty: () => void
}

const PropertyListViewItem: React.FC<IPropertyListViewItemProps> = ({
  property,
  badgeStatus,
  openProperty,
  deleteProperty,
  editProperty
}) => {
  console.log('PropertyListViewItem', property, badgeStatus);
  const router = useRouter();
  const [_, setPropertyState] = useAtom(propertyReadWriteAtom);
  const [agent, setAgent] = useAtom(agentReadWriteAtom);
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    setLoading(true);
    try {
      const data = await authUser();
      if (data?.data?.contextId) {
        setAgent({
          ...agent,
          contextId: data?.data?.contextId || "",
        });
      }

      setPropertyState({
        selectedProperty: {
          propertyId: property?.engagement?.propertyId,
          propertyAddress: property?.engagement?.propertyAddress,
          city: property?.engagement?.city,
          state: property?.engagement?.state,
          zipCode: property?.engagement?.zipCode,
          propertyImage: property?.engagement?.propertyImage,
          propertyProgress: property?.engagement?.propertyProgress,
          userId: property?.engagement?.userId,
          id: property?.id,
        },
        engagedProperty: property
      });

      router.push(`/dashboard/buy/${property?.id}/overview?propertyId=${property?.engagement?.propertyId}`);
    } catch (error) {
      console.error("Error loading property:", error);
    } finally {
      setLoading(false);
    }
  };
  const badgeColor =
    badgeStatus?.toLocaleLowerCase() === 'pending'
      ? '#FF8700'
      : badgeStatus?.toLocaleLowerCase() === 'now showing'
        ? '#ACF337'
        : '#F7F2EB'
  return (
    <section className="flex items-center justify-between border-b h-32 pb-8 border-solid border-[#7C7C7C] flex-wrap overflow-hidden">
      <section className="flex items-center md:w-1/2 mb-5 gap-4">
        <div className="rounded-md overflow-hidden">
          {property?.engagement?.propertyImage && (
            <Image
              src={property?.engagement?.propertyImage}
              alt={property?.engagement?.propertyName}
              height={100}
              width={100}
              priority
              unoptimized
              className="object-contain"
            />
          )}
        </div>
        <section className="w-4/5">
          <div
            className={cn(
              `bg-[${badgeColor}] inline-block px-7 py-1 rounded-full mb-2`
            )}>
            <p className="font-medium text-xs">{badgeStatus}</p>
          </div>
          <h2 className="font-bold text-gray-500 text-base">
            {property?.engagement?.propertyName}
          </h2>
          <h2 className="font-bold text-black text-base">
            {property?.engagement?.propertyAddress}
          </h2>
        </section>
      </section>
      <section className="flex items-center gap-12">
        <h1 className="font-bold text-2xl">
          {formatNumber(property?.engagement?.price || property?.mls_data?.data?.listPrice)}
        </h1>
        <RoundedButton
          variant="secondary"
          label="Open"
          onClick={handleOnClick}
          className="px-12 py-1.5 border border-solid border-black bg-white text-black"
        />
        {/* <RoundedButton
          variant="secondary"
          label="Edit"
          onClick={editProperty}
          className="px-12 py-1.5 bg-[#D9D9D9] text-black"
        />
        <Image
          onClick={deleteProperty}
          src="/assets/images/icons/deleteIcon.png"
          alt="Property name"
          className="object-contain cursor-pointer "
          height={20}
          width={20}
        /> */}
      </section>
    </section>
  )
}

export { PropertyListViewItem }
