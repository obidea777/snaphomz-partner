'use client'

import { Button } from 'components/common/buttons/Button'
import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { useState } from 'react'
import { UpcomingTourCard } from 'components/common/UpcomingTourCard'
import WeekScheduler from 'components/common/weekScheduler'
import Image from 'next/image'
import { useAtom } from 'jotai'
import { useFetchFutureTours } from 'hooks/useTours'
import LoadingState from 'components/common/LoadingState'
import { formatDate } from 'utils/dateutilities'
import { shortenAddress } from 'utils/stringsUtilities'
import { useParams, useRouter } from 'next/navigation'

const UpcomingTour = () => {
  const [currentView, setCurrentView] = useState<'list' | 'grid'>('grid')
  const { data: futureTours, refetch, isLoading } = useFetchFutureTours()
  const result = futureTours?.data?.result
  const router = useRouter()
  const handleBack = () => {
    router.back()
  }
  return (
    <>
      <section
        className="flex items-center gap-5 cursor-pointer"
        onClick={handleBack}>
        <Image
          src="/assets/images/icons/arrow-left.svg"
          alt="logo"
          height={18}
          width={18}
        />
        <p className="text-md font-medium">Back</p>
      </section>
      <section className=" mt-6 flex gap-20">
        <section className=" w-5/12 px-6 ">
          <WeekScheduler />
        </section>
        <section className="w-6/12  ">
          <section className="flex gap-3 justify-end items-center mb-16">
            <Button className="w-28 h-10">
              <p className="text-white text-base">Add New</p>
            </Button>
            <section className="flex items-center gap-8">
              <Image
                onClick={() => setCurrentView('list')}
                height={24}
                width={24}
                src="/assets/images/icons/listIcon.svg"
                alt="List Icon"
                className="cursor-pointer object-contain"
              />
              <Image
                onClick={() => {}}
                height={24}
                width={24}
                src="/assets/images/icons/calendar.svg"
                alt="calendar Icon"
                className="cursor-pointer object-contain"
              />
            </section>
          </section>
          <section className="h-96">
            {isLoading ? (
              <LoadingState keyType="svg" />
            ) : (
              result != null &&
              result.length > 0 &&
              result.map((tour) => {
                const { month, day } = tour?.eventDate?.[0]?.eventDate
                  ? formatDate(tour?.eventDate?.[0]?.eventDate)
                  : { month: '--', day: '--' }

                return (
                  <UpcomingTourCard
                    key={tour?._id}
                    hasTopNav={false}
                    hasRightPicture={false}
                    hasRightPictureClassname="rounded-r-none"
                    hasButton={false}
                    className="mb-4 border h-80"
                    tourDate={day}
                    tourMonth={month}
                    tourTime={tour?.eventDate?.[0]?.tourTime}
                    address={shortenAddress(
                      tour?.property?.propertyAddressDetails?.formattedAddress
                    )}
                  />
                )
              })
            )}
          </section>
          <section className="flex justify-end w-full items-center">
            <Button className="border-none bg-inherit w-6/12">
              <p className="text-black font-medium text-base">Cancel</p>
            </Button>
            <RoundedButton
              label="save"
              onClick={() => {}}
              variant="primary"
              className="bg-black  text-white py-2 px-8 text-sm"
            />
          </section>
        </section>
      </section>
    </>
  )
}

export default UpcomingTour
