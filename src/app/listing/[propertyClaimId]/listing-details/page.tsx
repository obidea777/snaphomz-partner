'use client'

import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { BorderedTextInput } from 'components/common/inputs/BorderedTextInput'
import { FileUpload } from 'components/common/inputs/RoundedFileInput'
import { PropertyCard } from 'components/common/PropertyCard'
import PropertyDetails from 'components/common/PropertyDetails'
import { useVerifyOwnership } from 'hooks/useVerifyOwnership'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Controller } from 'react-hook-form'
import Modal from 'components/common/Modal'
import { claimPropertyAtom } from 'hooks/claimPropertyAtom'
import { useState } from 'react'
import { usePropertyServiceAPI } from 'lib/api/property'
import { useRepoManagementApi } from 'lib/api/useRepoManagement'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { ClaimePropertyCard } from 'components/common/claime_property_card'
import { useSellerAPI } from 'lib/api/seller'

const ListingDetails = () => {
  const router = useRouter()
  const [currentProperty] = useAtom(claimPropertyAtom)
  const [coOwners, setCoOwners] = useState([{ id: 1 }])
  const [showCoOwners, setShowCoOwners] = useState(false)
  const { control, errors, isValid, handleSubmit, setFiles, files, isLoading } =useVerifyOwnership(currentProperty.id)
  const { createUserByEmailMutation } = useSellerAPI();
  const addCoOwner = () => {
    if (!showCoOwners) {
      // On the first click, only show the co-owner fields
      setShowCoOwners(true)
    } else {
      // For subsequent clicks, add more co-owner fields
      setCoOwners((prevCoOwners) => [
        ...prevCoOwners,
        { id: prevCoOwners.length + 1 }
      ])
    }
  }
  const createUserByEmail = ()=>{
      createUserByEmailMutation.mutateAsync("mausam@gmail.com",{
        onSuccess:(response : any)=>{
          console.log("Response : ",response);
          
        },
        onError:(err:any)=>{
          console.log(err);
          
        }
      })
  }
  const [additionalFiles, setAdditionalFiles] = useState(false)

  console.log(coOwners , showCoOwners , currentProperty)

  const handleFileChange = (files: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...files])
  }
  
  return (
    <section className="min-h-full flex-col justify-center flex bg-[#F7F2EB] px-14 rounded-t-lg pt-48">
      <section className="grid grid-cols-3 gap-x-24">
        <ClaimePropertyCard property={currentProperty}>
          <PropertyDetails
            noOfBeds={currentProperty.bedRooms}
            noOfBaths={currentProperty.bathRooms}
            lotSizeValue={
              currentProperty.sqft ??'0'
            }
            lotSizeUnit={currentProperty?.listing?.property?.livingArea?.toString()}
          />
        </ClaimePropertyCard>
        <section className="col-span-2">
          <h1 className="text-4xl font-medium mb-8">Enter Owner’s Details</h1>
          <section className="grid grid-cols-2 gap-6">
            <section className="relative">
              <Controller
                render={({ field: { onChange, value } }) => (
                  <BorderedTextInput
                    type="text"
                    label="First Name"
                    value={value}
                    onChange={onChange}
                    error={errors?.firstName?.message}
                  />
                )}
                name="firstName"
                control={control}
              />
            </section>
            <section className="relative">
              <Controller
                render={({ field: { onChange, value } }) => (
                  <BorderedTextInput
                    type="text"
                    label="last Name"
                    value={value}
                    onChange={onChange}
                    error={errors?.lastName?.message}
                  />
                )}
                name="lastName"
                control={control}
              />
              </section>
            <section className="relative">
              <Controller
                render={({ field: { onChange, value } }) => (
                  <BorderedTextInput
                    type="email"
                    label="Email"
                    value={value}
                    onChange={onChange}
                    error={errors?.email?.message}
                  />
                )}
                name="email"
                control={control}
              />
            </section>
          </section>

          {showCoOwners &&
            coOwners.map((coOwner, index) => (
              <section
                key={coOwner.id}
                className="grid grid-cols-2 gap-6 mt-10">
                <section className="relative">
                  <Controller
                    name={`coOwners.${index}.name`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <BorderedTextInput
                        type="text"
                        label={`Co-owner Name ${index + 1}`}
                        value={value}
                        onChange={onChange}
                        error={errors?.[`coOwners.${index}.name`]?.message}
                      />
                    )}
                  />
                </section>
                <section className="relative">
                  <Controller
                    name={`coOwners.${index}.email`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <BorderedTextInput
                        type="email"
                        label={`Email ${index + 1}`}
                        value={value}
                        onChange={onChange}
                        error={errors?.[`coOwners.${index}.email`]?.message}
                      />
                    )}
                  />
                </section>
              </section>
            ))}
          <section className="flex items-center mt-12 mb-6">
            <Image
              src="/assets/images/icons/plusIcon.svg"
              alt="add new image"
              objectFit="contain"
              className="cursor-pointer"
              height={27}
              width={27}
              onClick={addCoOwner}
            />
            <p className="font-bold text-base ml-6 text-black">Add co-owner</p>
          </section>
          <section className="relative mt-16">
            <FileUpload
              label={
                <label className="mb-2 block text-sm text-[#848484]">
                  Proof of Ownership
                </label>
              }
              setFiles={handleFileChange}
            />
          </section>

          <section className="flex items-center mt-10">
            <Image
              src="/assets/images/icons/plusIcon.svg"
              alt="add new image"
              objectFit="contain"
              className="cursor-pointer"
              height={27}
              width={27}
              onClick={() => setAdditionalFiles(!additionalFiles)}
            />
            <p className="font-bold text-base ml-6 text-black">
              Add another file
            </p>
          </section>
          {additionalFiles && (
            <FileUpload
              className="mt-4"
              label={
                <label className="mb-2 block text-sm text-[#848484]">
                  Additional Files
                </label>
              }
              setFiles={handleFileChange}
            />
          )}
          {files.length > 0 ? (
            <>
              {files.map((file) => (
                <section
                  key={file.name}
                  className="flex items-center justify-between w-1/2 mt-2">
                  <p className="font-bold text-sm text-black mb-4">
                    {file.name}
                  </p>
                  <Image
                    onClick={() =>
                      setFiles(files.filter((item) => item.name !== file.name))
                    }
                    src="/assets/images/icons/deleteIcon.png"
                    alt="Property name"
                    className="object-contain cursor-pointer"
                    height={12}
                    width={12}
                  />
                </section>
              ))}
            </>
          ) : null}
        </section>
      </section>
      <section className="flex items-center justify-between mt-20">
        <section>
          <RoundedButton
            label="Cancel"
            onClick={() => router.push('/listing')}
            variant="primary"
            className="py-2 text-black bg-transparent border border-solid border-black px-14"
          />
        </section>
        <section className="flex items-center gap-x-4">
          <RoundedButton
            label="Later"
            onClick={() => router.push('/listing')}
            variant="primary"
            className="py-2 text-black bg-transparent border-0 px-14"
          />

          <RoundedButton
            disabled={(files.length < 1) || isLoading}
            label="Continue"
            onClick={()=>handleSubmit()}
            loading={isLoading}
            variant="primary"
            className="py-2 text-white bg-black border border-solid border-black px-14"
          />
        </section>
      </section>
      <Modal useChildStyle isOpen={isLoading}>
        <section className="flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="w-16 h-16 text-black animate-spin dark:text-gray-900 fill-white"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </section>
      </Modal>
    </section>
  )
}

export default ListingDetails
