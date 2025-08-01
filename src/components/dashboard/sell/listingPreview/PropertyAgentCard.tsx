import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// type PropertyAgentCardProps = {}

const PropertyAgentCard: React.FC = () => {
  return (
    <section className="rounded-xl flex items-center justify-between bg-[#E8804C]  mt-4 p-4">
      <section className="flex items-center ">
        <div className="rounded-full overflow-hidden bg-black  h-12 w-12 mr-4" />
        <section>
          <h3 className="text-base font-bold text-black">Daniel Smith</h3>
          <p className="text-sm font-medium text-white">Listing Agent</p>
        </section>
      </section>
      <Link href="/" className="flex items-center mr-6">
        <Image
          src="/assets/images/icons/message.svg"
          alt="send message"
          objectFit="contain"
          height={16}
          width={28}
        />
      </Link>
    </section>
  )
}

export { PropertyAgentCard }
