import Map from 'components/Map'
import Image from 'next/image'
import React from 'react'
import { shortenAddress } from 'utils/stringsUtilities'

type ILocationProps = {
  province: string
  latitude: string
  longitude: string
  city: string
  postalCode: string
  formattedAddress: string
}

const Location: React.FC<ILocationProps> = ({
  province,
  latitude,
  longitude,
  city,
  postalCode,
  formattedAddress
}) => (
  <section>
    <h2 className="text-xl text-black font-bold mb-6">Location</h2>
    <section className="flex items-center gap-4 mb-6">
      <p className="text-xs font-medium text-black">{province}</p>
      <Image
        src="/assets/images/icons/trail.svg"
        alt="go back"
        objectFit="contain"
        height={8}
        width={4}
      />
      <p className="text-xs font-medium text-black">{city}</p>
      <Image
        src="/assets/images/icons/trail.svg"
        alt="go back"
        objectFit="contain"
        height={8}
        width={4}
      />
      <p className="text-xs font-medium text-black">{postalCode}</p>
      <Image
        src="/assets/images/icons/trail.svg"
        alt="go back"
        objectFit="contain"
        height={8}
        width={4}
      />
      <p className="text-xs font-medium text-black">
        {shortenAddress(formattedAddress)}
      </p>
    </section>
    <section className="w-full overflow-hidden mb-12">
      <Map
        coord={[{ lat: +latitude, lng: +longitude }]}
        height="278px"
        width="100%"
      />
    </section>
  </section>
)

export { Location }
