import Image from 'next/image'
import React from 'react'
const features = [
  { id: 1, name: 'Residential', icon: '/assets/images/icons/bed2.svg' },
  { id: 2, name: 'Built in 2005', icon: '/assets/images/icons/calender2.svg' },
  { id: 3, name: '$471 Price/sqft', icon: '/assets/images/icons/size.svg' }
]
// type IfeaturesProps = {
//   features: []
// }

const FeatureList: React.FC = () => (
  <section className="grid grid-cols-3 gap-4 mt-8">
    {features.map(({ name, icon, id }) => (
      <div
        className="pl-4 py-4 flex items-center bg-[#F4F4F4] rounded-sm w-full"
        key={id}>
        <Image
          src={icon}
          alt={name}
          objectFit="contain"
          height={35}
          width={20}
        />
        <h3 className="text-base ml-6">{name}</h3>
      </div>
    ))}
  </section>
)

export { FeatureList }
