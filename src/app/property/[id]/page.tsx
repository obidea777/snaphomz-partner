'use client'
import { RoundedButton } from 'components/common/buttons/RoundedButton'
import Checkbox from 'components/common/Checkbox'
import { CustomFileInput } from 'components/common/CustomFileInput'
import BorderedTextArea from 'components/common/inputs/BorderedTextArea'
import { BorderedTextInput } from 'components/common/inputs/BorderedTextInput'
import { PropertyCard } from 'components/common/PropertyCard'
import PropertyDetails from 'components/common/PropertyDetails'
import EditableSection from 'components/overview/EditableSection'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useUpdateProperty } from 'hooks/usePropertyDetails'
import { Controller } from 'react-hook-form'
import { useEffect } from 'react'
import Link from 'next/link'
import Dropdown from 'components/common/DropDown'
import { useSingleProperty } from 'hooks/usePropertyOffer'
import { showToast } from 'utils/toastHelper'
type IEditPropertyProps = {}
const EditProperty: React.FC<IEditPropertyProps> = () => {
  const params = useParams()
  const propertyId = params?.id as string
  const id = params?.id
  const {
    data: singlePropertyData,
    isLoading: singlePropertyLoading,
    refetch: refetchSinglePropertyData
  } = useSingleProperty(id as string)
  const selectedProperty = singlePropertyData?.data?.property
  const handleVideoFileChange = (files: File[]) => {
    setVideos((prevFiles) => [...prevFiles, ...files])
  }
  const handleFileChange = (files: File[]) => {
    setImages((prevFiles) => [...prevFiles, ...files])
  }
  const {
    control,
    errors,
    update,
    isValid,
    handleSubmit,
    setVideos,
    videos,
    images,
    setImages,
    isLoading,
    setValue,
    data
  } = useUpdateProperty(propertyId, selectedProperty)

  useEffect(() => {
    if (data) {
      showToast('success', data.message, {
        className: 'bg-green-500'
      })
      refetchSinglePropertyData()
    }
  }, [data])
  useEffect(() => {
    if (selectedProperty) {
      setValue('numBedroom', selectedProperty?.numBedroom)
      setValue('amount', selectedProperty?.price?.amount)
      setValue('numBathroom', selectedProperty?.numBathroom)
      setValue('lotSizeValue', selectedProperty?.lotSizeValue)
      setValue('propertyType', selectedProperty?.propertyType)
      setValue('propertyDescription', selectedProperty?.propertyDescription)
      setValue('propertyStatus', selectedProperty?.propertyStatus)
    }
  }, [selectedProperty])

  const onSubmit = async () => {
    console.log('submitting')
    handleSubmit()
  }
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }
  return (
    <>
      <section
        className="flex items-center gap-5 cursor-pointer pl-16 pt-10 bg-white"
        onClick={handleBack}>
        <Image
          src="/assets/images/icons/arrow-left.svg"
          alt="logo"
          height={19}
          width={18}
        />
        <p className="text-md font-medium">Back</p>
      </section>
      <section className="bg-white rounded-t-xl px-14 py-12 gap-12 h-full min-h-screen flex flex-wrap">
        <section className="lg:w-3/5">
          <h2 className="font-bold text-xl mb-12">
            {`Editing ${selectedProperty?.propertyName}`}
          </h2>
          <section className="grid lg:grid-cols-2 gap-8 gap-y-16 grid-cols-1">
            <Controller
              render={({ field: { onChange, value } }) => (
                <BorderedTextInput
                  label="Bedrooms"
                  labelClassName=""
                  type="number"
                  value={value}
                  onChange={onChange}
                  error={errors?.numBedroom?.message}
                />
              )}
              name="numBedroom"
              control={control}
            />
            <Controller
              render={({ field: { onChange, value } }) => (
                <BorderedTextInput
                  label="Price"
                  type="number"
                  onChange={onChange}
                  error={errors?.amount?.message}
                  value={value}
                  inputClassName="w-[65%]"
                  right={
                    <section className="flex items-center justify-center ml-4">
                      <Image
                        height={16}
                        width={16}
                        src="/assets/images/icons/exclamation.svg"
                        alt="Edit Icon"
                        className="cursor-pointer object-contain"
                      />
                      <p className="text-md text-[#030303] ml-2">
                        Talk to agent
                      </p>
                    </section>
                  }
                />
              )}
              name="amount"
              control={control}
            />
            <Controller
              render={({ field: { onChange, value } }) => (
                <BorderedTextInput
                  label="Bathrooms"
                  labelClassName=""
                  type="number"
                  name="numBathroom"
                  onChange={onChange}
                  value={value}
                  error={errors?.numBathroom?.message}
                />
              )}
              name="numBathroom"
              control={control}
            />
            <BorderedTextInput label="Sft." labelClassName="" type="number" />
            <BorderedTextInput
              label="Property Size."
              labelClassName=""
              type="number"
            />
            <Controller
              render={({ field: { onChange, value } }) => (
                <BorderedTextInput
                  label="Lot Size"
                  labelClassName=""
                  type="number"
                  name="lotSize"
                  onChange={onChange}
                  value={value}
                  error={errors?.lotSizeValue?.message}
                />
              )}
              name="lotSizeValue"
              control={control}
            />
            <BorderedTextInput
              label="HOA dues"
              labelClassName=""
              type="number"
            />
            <Controller
              render={({ field: { onChange, value } }) => (
                <BorderedTextInput
                  label="Property Type"
                  labelClassName=""
                  name="propertyType"
                  type="text"
                  onChange={onChange}
                  value={value}
                  error={errors?.propertyType?.message}
                />
              )}
              name="propertyType"
              control={control}
            />
            <BorderedTextInput
              label="Year Built"
              labelClassName=""
              type="number"
            />
            <BorderedTextInput
              label="Structural remodel year"
              labelClassName=""
              type="number"
            />
            <Controller
              render={({ field: { onChange, value } }) => (
                <BorderedTextArea
                  label="Property Description"
                  labelClassName=""
                  type="text"
                  name="propertyDescription"
                  className="h-36"
                  onChange={onChange}
                  value={value}
                  error={errors?.propertyDescription?.message}
                />
              )}
              name="propertyDescription"
              control={control}
            />
          </section>
          <h2 className="font-bold text-xl mt-20 mb-8">Features</h2>
          {selectedProperty?.features != null &&
            selectedProperty?.features.length > 0 &&
            selectedProperty?.features?.map((features, index) => {
              return (
                <EditableSection
                  key={features.id}
                  title={features.feature}
                  description={features.description}
                />
              )
            })}
          <h2 className="font-bold text-xl mt-20">Contact Information</h2>
          <p className="text-md mt-2  mb-8 text-[#848484] w-4/5">
            Potential buyers will contact you through the email address
            registered on Snaphomz or through your listed agent.
          </p>
          <BorderedTextInput
            className="w-3/5"
            type="email"
            defaultValue={selectedProperty?.seller?.email}
            disabled
          />
          <section className="flex items-center gap-x-4 my-8">
            <Checkbox
              label={
                <p className="text-md text-[#848484]">I agree to the terms</p>
              }
              checked={true}
              onChange={() => {}}
            />
          </section>
          <p className="text-base font-medium mt-6 text-[#848484] mb-2">
            Add Photos
          </p>
          <section className="flex items-center gap-2">
            <section className="w-[15%] h-24 mr-10">
              <CustomFileInput handleFile={handleFileChange} />
            </section>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 h-24 items-center">
              {/* render images from selectedProperty.images and if it there are more than 3 add the remaining as a count */}
              {selectedProperty?.images?.slice(0, 3).map((image, index) => {
                return (
                  <div key={index}>
                    <img
                      className="object-cover object-center w-full h-24 max-w-full rounded-lg"
                      src={image.url}
                      alt="gallery-photo"
                    />
                  </div>
                )
              })}
              {/* Render the count of remaining images */}
              {selectedProperty?.images?.length > 3 && (
                <p className="text-sm font-bold">{`+${selectedProperty?.images?.length - 3} more`}</p>
              )}
              {/* render uploaded images from images array */}
              {images.map((image, index) => {
                return (
                  <div key={index}>
                    <img
                      className="object-cover object-center w-full h-24 max-w-full rounded-lg"
                      src={URL.createObjectURL(image)}
                      alt="gallery-photo"
                    />
                  </div>
                )
              })}
            </section>
          </section>
          <p className="text-base font-medium mt-6 text-[#848484] mb-2">
            Add Video
          </p>
          <section className="flex items-center gap-2">
            <section className="w-[15%] h-24 mr-10">
              <CustomFileInput handleFile={handleVideoFileChange} />
            </section>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 h-24 items-center">
              {/* render videos from selectedProperty.videos and if it there are more than 3 add the remaining as a count */}
              {selectedProperty?.videos?.slice(0, 3).map((video, index) => {
                return (
                  <div key={index}>
                    <video
                      className="object-cover object-center w-full h-24 max-w-full rounded-lg"
                      src={video.url}
                    />
                  </div>
                )
              })}
              {/* Render the count of remaining videos */}
              {selectedProperty?.videos?.length > 3 && (
                <p className="text-sm font-bold">{`+${selectedProperty?.videos?.length - 3} more`}</p>
              )}
              {/* render uploaded videos from videos array */}
              {videos.map((video, index) => {
                return (
                  <div key={index}>
                    <video
                      className="object-cover object-center w-full h-24 max-w-full rounded-lg"
                      src={URL.createObjectURL(video)}
                    />
                  </div>
                )
              })}
            </section>
          </section>
        </section>
        <section className="flex flex-col gap-y-10">
          <PropertyCard property={selectedProperty}>
            <PropertyDetails
              noOfBeds={selectedProperty?.numBedroom}
              noOfBaths={selectedProperty?.numBathroom}
              lotSizeValue={selectedProperty?.lotSizeValue}
              lotSizeUnit={selectedProperty?.lotSizeUnit}
            />
          </PropertyCard>
          <Controller
            name="propertyStatus"
            defaultValue={undefined}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Dropdown
                label="Property Status"
                labelClassName="mt-6 text-[#848484]"
                options={[
                  { label: 'Publish', value: 'publish' },
                  { label: 'UnPublish', value: 'unpublish' }
                ]}
                inputClassName="h-13 border-transparent bg-[#F5F8FA]"
                onSelect={(selectedValue) => {
                  onChange(
                    selectedValue !== undefined ? selectedValue : undefined
                  )
                }}
                error={errors.propertyStatus?.message}
                value={value}
              />
            )}
          />
          <section className="flex items-center justify-between my-5 w-full">
            <Link href={`/listing/listing-preview/${selectedProperty?._id}`}>
              <RoundedButton
                label="Preview"
                onClick={() => {}}
                variant={'primary'}
                className="py-2 text-white bg-black px-6"
              />
            </Link>
            <RoundedButton
              label={isLoading ? 'Saving' : 'Save & Continue'}
              loading={isLoading}
              onClick={() => onSubmit()}
              variant={'primary'}
              className="py-2 text-black border border-solid border-black px-6 w-40"
            />
          </section>
        </section>
      </section>
    </>
  )
}
export default EditProperty
