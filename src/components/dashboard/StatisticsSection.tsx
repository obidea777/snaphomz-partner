import Image from 'next/image'
import React from 'react'
import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { useParams } from 'next/navigation'
import { usePropertyAnalytics } from 'hooks/usePropertyDocuments'

const StatisticsSection: React.FC = () => {
  const params = useParams()
  const id = params?.id

  const {
    data: propertyAnalytics,
    isLoading,
    error
  } = usePropertyAnalytics(id as string)
  const result = propertyAnalytics?.data
  const dummyData = {
    totalClients: 128,
    viewsCount: 534,
    totalOffers: 42,
    shareCount: 76
  }
  return (
    <section className="rounded-xl bg-white px-6 py-3">
      <section className="flex items-center justify-between gap-24 mb-12">
        <RoundedButton
          className="py-2 px-4"
          variant="secondary"
          label={
            <section className="flex items-center justify-center gap-2">
              <Image
                src="/assets/images/icons/advertise.svg"
                alt="chat"
                height={12}
                width={12}
              />
              <p className="text-xs font-medium text-black">Advertise</p>
            </section>
          }
          onClick={() => {}}
        />
        <section className="flex items-center gap-2">
          <p className="font-medium text-sm text-black">
            Viewer access & activity
          </p>
          <Image
            src="/assets/images/icons/arrowRight.svg"
            alt="chat"
            height={12}
            width={12}
          />
        </section>
      </section>
      <section className="flex items-center gap-8">
        <section className="flex flex-col items-center justify-center">
          <p className="text-black font-bold text-2xl">
            {dummyData?.totalClients}
          </p>
          <p className="text-black font-bold text-xl">Clients</p>
        </section>
        <Image
          src="/assets/images/icons/Line.svg"
          alt="chat"
          height={20}
          width={1}
        />
        <section className="flex flex-col items-center justify-center">
          <p className="text-black font-bold text-2xl">
            {dummyData?.viewsCount}
          </p>
          <p className="text-black font-bold text-xl">Views</p>
        </section>
        <Image
          src="/assets/images/icons/Line.svg"
          alt="chat"
          height={20}
          width={1}
        />
        <section className="flex flex-col items-center justify-center">
          <p className="text-black font-bold text-2xl">
            {dummyData?.totalOffers}
          </p>
          <p className="text-black font-bold text-xl">Offers</p>
        </section>
        <Image
          src="/assets/images/icons/Line.svg"
          alt="chat"
          height={20}
          width={1}
        />
        <section className="flex flex-col items-center justify-center">
          <p className="text-black font-bold text-2xl">
            {dummyData?.shareCount}
          </p>
          <p className="text-black font-bold text-xl">Shares</p>
        </section>
      </section>
    </section>
  )
}

export { StatisticsSection }
