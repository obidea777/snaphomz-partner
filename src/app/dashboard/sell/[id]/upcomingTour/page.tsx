'use client'

import { Button } from 'components/common/buttons/Button'
import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { CustomDatePicker } from 'components/common/date/CustomDatePicker'
import { EmptyPlaceholder } from 'components/common/EmptyPlaceholder'
import TimePicker from 'components/common/inputs/TimePicker'
import LoadingState from 'components/common/LoadingState'
import { UpcomingTourCard } from 'components/common/UpcomingTourCard'
import { PropertyTransactionItem } from 'components/overview/PropertyTransactionItem'
import { SellerPropertyDetailsItem } from 'components/overview/SellerPropertyDetailsItem'
import { useSingleProperty } from 'hooks/usePropertyOffer'
import {
  useFetchAllTours,
  useFetchFutureTours,
  useScheduleATour
} from 'hooks/useTours'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { formatDate } from 'utils/dateutilities'
import { shortenAddress } from 'utils/stringsUtilities'

const UpcomingTour = () => {
  const params = useParams()
  const id = params?.id
  const { data: singlePropertyData } = useSingleProperty(id as string)
  const router = useRouter()
  const {
    data: futureTours,
    refetch,
    isLoading: toursLoading
  } = useFetchFutureTours()
  const result = futureTours?.data?.result
  const [{ mutateScheduleATour }] = useScheduleATour()
  const [startTime, setStartTime] = useState<string>('00:00')
  const [endTime, setEndTime] = useState<string>('23:59')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const handleStartTimeChange = (time: string) => {
    setStartTime(time)
  }

  const handleEndTimeChange = (time: string) => {
    setEndTime(time)
  }

  const handleAddClick = () => {
    if (selectedDate && startTime && endTime) {
      const startDateTime = `${selectedDate}T${startTime}:00.000Z`
      const endDateTime = `${selectedDate}T${endTime}:00.000Z`
      mutateScheduleATour({
        property: singlePropertyData?.data?.property?._id,
        tourDate: startDateTime
      })
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <>
    <SellerPropertyDetailsItem/>
      {toursLoading ? (
        <LoadingState keyType="svg" />
      ) : result && result.length > 0 ? (
        <section className="mt-20 flex">
          <section className="w-4/5">
            {result.map((tour) => {
              const { month, day } = tour?.eventDate?.[0]?.eventDate
                ? formatDate(tour?.eventDate?.[0]?.eventDate)
                : { month: '--', day: '--' }

              return (
                <UpcomingTourCard
                  key={tour?._id}
                  hasTopNav={false}
                  hasRightPicture={true}
                  hasRightPictureClassname="rounded-r-none"
                  hasButton={true}
                  className="mb-4"
                  tourDate={day}
                  tourMonth={month}
                  tourTime={tour?.eventDate?.[0]?.tourTime}
                  address={shortenAddress(
                    tour?.property?.propertyAddressDetails?.formattedAddress
                  )}
                />
              )
            })}
          </section>
          <section className="flex flex-col w-1/2 gap-10 px-8">
            <section className="flex justify-between items-center">
              <p className="text-black font-semibold text-xl">Availability</p>
              <RoundedButton
                label="Manage"
                onClick={() => router.push('/manageSchedule')}
                variant="primary"
                className="bg-inherit border border-[#000000] text-black py-1 px-8 text-sm"
              />
            </section>
            <CustomDatePicker
              onChange={setSelectedDate}
              label="Date"
              placeholder="Choose new date"
              inputClassName="w-full"
              labelClassName="text-black font-medium text-base"
              value={selectedDate}
            />
            <TimePicker
              label="Time"
              labelClassName="text-black font-medium text-base"
              onStartTimeChange={handleStartTimeChange}
              onEndTimeChange={handleEndTimeChange}
            />
            <section className="flex justify-end w-full items-center">
              <Button className="border-none bg-inherit w-6/12">
                <p className="text-black font-medium text-base">Cancel</p>
              </Button>
              <RoundedButton
                disabled={!selectedDate && !startTime && !endTime}
                label="Add"
                onClick={handleAddClick}
                variant="primary"
                className="bg-[#D9D9D9]  text-white py-2 px-12 text-sm"
              />
            </section>
          </section>
        </section>
      ) : (
        <EmptyPlaceholder
        transactionImage=''
          EmptyPlaceHolderImage="/assets/images/icons/calendar.svg"
          title="Tour Schedule"
          description="You have no availability set for buyers to engage."
          buttonLabel="Set Availability"
          onButtonClick={() => router.push('/manageSchedule')}
        />
      )}
    </>
  )
}

export default UpcomingTour
