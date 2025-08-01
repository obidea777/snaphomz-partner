import { convertUndefinedString } from 'components/common/PropertyDetails'
import React from 'react'
import { formatNumber } from 'utils/mathutilities'

type IPropertyOverviewProps = {
  name: string
  address: string
  price: number
  city: string
  postalCode: string
  numberOfBathroom: string
  numberOfBedroom: string
  lotSizeUnit: string
  lotSizeValue: string
  propertyType: string
  currentStatus: string
}

const PropertyOverview: React.FC<IPropertyOverviewProps> = ({
  price,
  name,
  address,
  city,
  postalCode,
  numberOfBathroom,
  numberOfBedroom,
  lotSizeValue,
  lotSizeUnit,
  propertyType,
  currentStatus
}) => {
  return (
    <section className="grid grid-cols-2">
      <section>
        <section className="flex items-center">
          <h1 className="font-bold text-[#030303] text-3xl">
            {formatNumber(price)}
          </h1>
          <section className="ml-6 items-center flex justify-center px-8 py-1 bg-[#E9FFCC] rounded-full">
            <p className="font-bold text-xs text-center text-[#2CB049]">
              {currentStatus}
            </p>
          </section>
        </section>
        <p className="font-bold text-lg text-black w-4/5 mt-3">{name}</p>
        <p className="text-base text-black w4/5">
          {address}, {city}, {postalCode}
        </p>
        <p className="text-lg text-[#030303] w4/5 mt-5">
          Estimated payment: $6,607/month
        </p>
      </section>
      <section className="border-y border-solid flex py-4 justify-between gap-4 h-1/2">
        <section className="items-center flex flex-col w-1/3">
          <h3 className="font-medium text-xl text-[#030303]">
            {numberOfBedroom}
          </h3>
          <p className="text-grey-370 text-xs">Bedrooms</p>
        </section>
        <section className="items-center flex flex-col border-x border-solid border-[#EAEAEA] px-8">
          <h3 className="font-medium text-xl text-[#030303]">
            {numberOfBathroom}
          </h3>
          <p className="text-grey-370 text-xs">Bathrooms</p>
        </section>
        <section className="items-center flex flex-col w-1/3">
          <h3 className="font-medium text-xl text-[#030303]">
            {convertUndefinedString(lotSizeValue) ? lotSizeValue : 0}
          </h3>
          <p className="text-grey-370 text-xs">{lotSizeUnit}</p>
        </section>
      </section>
    </section>
  )
}

export { PropertyOverview }
