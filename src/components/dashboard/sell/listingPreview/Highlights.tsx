import Image from 'next/image'
import React from 'react'

const Highlights = () => {
  return (
    <section className="rounded-xl w-full bg-[#F4F4F4] px-8 p-4">
      <h2 className="font-medium text-xl mb-6">Highlights</h2>
      <section className="">
        {[
          {
            id: 1,
            name: 'Westlake Middle School',
            icon: '/assets/images/icons/school.svg'
          },
          {
            id: 2,
            name: 'Wood flooring',
            icon: '/assets/images/icons/floor.svg'
          },
          {
            id: 3,
            name: 'Newly Remodelled',
            icon: '/assets/images/icons/hammer.svg'
          },
          {
            id: 4,
            name: 'No HOA',
            icon: '/assets/images/icons/house.svg'
          }
        ].map(({ name, icon, id }) => (
          <div className="flex items-center mb-4" key={id}>
            <Image
              src={icon}
              alt={name}
              objectFit="contain"
              height={21}
              width={21}
            />
            <h3 className="text-base ml-6">{name}</h3>
          </div>
        ))}
      </section>
      {/* <div className="bg-grey-850 h-[0.05rem] my-4"></div>
      <button className="bg-black border border-solid border-grey-850 flex items-center justify-center px-8 py-4 rounded-sm text-white w-full">
        Start the process
      </button>
      <button className="bg-transparent border-none flex items-center justify-center px-8 py-4 mt-2 text-black w-full">
        Take a tour
      </button> */}
    </section>
  )
}

export { Highlights }
