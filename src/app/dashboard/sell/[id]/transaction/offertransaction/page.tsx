'use client'

import Stepper from 'components/dashboard/Stepper'
import { PropertyTransactionItem } from 'components/overview/PropertyTransactionItem'
import { UserInfoDealCard } from 'components/overview/UserInfoDealCard'
import Image from 'next/image'

const page = () => {
  return (
    <section className="">
      <section className="bg-white rounded-xl p-6">
        <PropertyTransactionItem />
        <section className="mt-6">
          <section className="grid grid-cols-3 gap-4">
            <UserInfoDealCard
              rightComponent={
                <Image
                  src="/assets/images/icons/message.svg"
                  alt="chat"
                  height={24}
                  width={24}
                />
              }
              name="Racheal Wyatt"
              role="Seller"
            />
            <UserInfoDealCard name="Kevin Winston" role="Agent" />
            <UserInfoDealCard name="John Smith" role="Broker" />
          </section>
        </section>
      </section>

      <Stepper />
    </section>
  )
}

export default page
