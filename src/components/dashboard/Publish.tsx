import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { useSingleProperty } from 'hooks/usePropertyOffer'
import { usePublishProperty } from 'hooks/usePublishProperty'
import { useAtom } from 'jotai'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { propertyDetailsAtom } from 'store/atoms/atoms'

const Publish = ({ closeModal }) => {
  const params = useParams()
  const id = params?.id
  const { data: singlePropertyData, isLoading: singlePropertyLoading } =
    useSingleProperty(id as string)
  const [{ mutatePublishProperty, status }] = usePublishProperty()

  const handlePublishProperty = () => {
    const body = { publish: true }

    mutatePublishProperty({
      id: singlePropertyData?.data?.property?._id,
      body: body
    })

    closeModal()
  }
  return (
    <section className="py-20  flex flex-col items-center">
      <p className="font-medium text-black text-3xl mb-4">Publish Live</p>
      <p className="font-light text-lg text[#666666 mb-16">
        Are you ready to sell this property?
      </p>
      <section className="flex items-center  gap-3 ">
        <RoundedButton
          label="No"
          onClick={() => {
            closeModal()
          }}
          variant="primary"
          className="bg-white text-black py-2 px-16 text-sm border border-solid border-black"
        />
        <RoundedButton
          label="Yes, Proceed"
          onClick={handlePublishProperty}
          loading={status === 'pending'}
          variant="primary"
          className="bg-black text-white py-2 text-sm"
        />
      </section>
    </section>
  )
}

export default Publish
