import Image from 'next/image'
import React from 'react'

export function convertUndefinedString(value) {
  if (value === 'undefined') {
    return undefined
  }
  return value
}

type IPropertyDetailsProps = {
  noOfBeds: string
  noOfBaths: string
  lotSizeValue: string
  lotSizeUnit: string
}

const PropertyDetails: React.FC<IPropertyDetailsProps> = ({
  noOfBaths,
  noOfBeds,
  lotSizeValue,
  lotSizeUnit
}) => {
  return (
    <section>
      <section className="flex items-center justify-between w-[70%] mb-4">
        <Image
          src="/assets/images/icons/bed.svg"
          alt="Bed"
          className="object-contain"
          height={31}
          width={24}
        />
        <Image
          src="/assets/images/icons/bath.svg"
          alt="Bath"
          className="object-contain"
          height={31}
          width={24}
        />
        <Image
          src="/assets/images/icons/feet.png"
          alt="Size"
          className="object-contain"
          height={31}
          width={24}
        />
      </section>
      <section className="flex items-center justify-between w-4/5 font-bold">
        <p className="text-base text-[#F7F2EB]">
          {`${convertUndefinedString(noOfBeds) ? noOfBeds : 0}`} Bed
        </p>
        <Image
          src="/assets/images/icons/ellipse.svg"
          alt="Dot"
          className="object-contain block"
          height={7}
          width={7}
        />
        <p className="text-base text-[#F7F2EB]">
          {`${convertUndefinedString(noOfBaths) ? noOfBaths : 0}`} Bath
        </p>
        <Image
          src="/assets/images/icons/ellipse.svg"
          alt="Dot"
          className="object-contain block"
          height={7}
          width={7}
        />
        <p className="text-base text-[#F7F2EB]">{`${convertUndefinedString(lotSizeValue) ? lotSizeValue : 0} ${lotSizeUnit ? lotSizeUnit : 'Sqft'}`}</p>
      </section>
    </section>
  )
}

export default PropertyDetails
