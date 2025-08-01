'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { DocumentCard } from 'components/common/DocumentCard'
import BorderedTextArea from 'components/common/inputs/BorderedTextArea'
import DatePicker from 'components/common/inputs/DateInput'
import TimePicker from 'components/common/inputs/TimePicker'
import ContactCard from 'components/dashboard/ContactCard'
import { useSinglePropertyOffers } from 'hooks/usePropertyOffer'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { formatDate } from 'utils/dateutilities'
import { downloadDocument } from 'utils/downloadFunction'
import { schema } from 'interfaces/counterOffer'
import { BorderedTextInput } from 'components/common/inputs/BorderedTextInput'
import Dropdown from 'components/common/DropDown'
import SummaryTermsCard from 'components/dashboard/summaryTermsCard'
import { useCreateCounterOffer } from 'hooks/useCounterOffer'
import { applyChanges } from 'utils/modelUtilities'
import { usePropertyServiceAPI } from 'lib/api/property'
import { useAtom } from 'jotai'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { useState } from 'react'
import { propertyOfferAtom } from 'store/atoms/atoms'
import { claimedPropertyReadWriteAtom } from 'store/atoms/claimed-property'
import { success } from 'components/alert/notify'

const CounterOffer = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  })
  const params = useParams()
  const id = params?.id
  const [currentAgent] = useAtom(agentReadWriteAtom);
  const { data: singlePropertyOffer } = useSinglePropertyOffers(id as string)
  const [notes , setNotes] = useState('')
  const { createPropertyCounterOffer:{mutate} } = usePropertyServiceAPI();
  const [selectedOffer] = useAtom(propertyOfferAtom)
  const [claimedProperty] = useAtom(claimedPropertyReadWriteAtom)

  const onSubmit = async(data) => {
    // const updatedValues = {
    //   offerPrice: {
    //     amount: data.offerPrice,
    //     currency: 'usd'
    //   },
    //   financeType: data.financeType,
    //   downPayment: {
    //     amount: data.downPayment,
    //     currency: 'usd'
    //   },
    //   financeContingency: { amount: data.financeContingency, unit: 'days' },
    //   apprasalContingency: { amount: data.appraisalContingency, unit: 'days' },
    //   inspectionContingency: {
    //     amount: data.inspectionContingency,
    //     unit: 'days'
    //   },
    //   closeEscrow: {
    //     amount: data.closeEscrow,
    //     unit: 'days'
    //   },
    //   specialTerms: data.specialTerms
    // }
    const payload = {
   
      userId:currentAgent?.user?.id,
      price: data?.offerPrice,
      downPayment:  data.downPayment,
      financeType:data.financeType,
      financeContingencyDays:  Number(data.financeContingency),
      appraisalContingencyDays:  Number(data.appraisalContingency),
      inspectionContingencyDays: Number(data.inspectionContingency),
      specialTerms:data.specialTerms,
      description:notes || "",
      offerId:selectedOffer?.id,
      cashAmount:selectedOffer?.cashAmount,
      propertyId:claimedProperty?.id.toString(),
      listingId:claimedProperty?.listingid.toString(),
      closeEscrowDays: data.closeEscrow || 0,
      expiryDate:new Date()
      //documentIds: selectedOffer?.documents.map((d:any) => d._id) ?? [],
   
}
   console.log(payload)
   await mutate(payload);
   success({message:'Counter-offer sent!'});

    mutate(payload)
  }
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-t-xl px-14 py-12 gap-12 h-full min-h-screen flex">
      <section className="w-3/5">
        <section className=" mb-12">
          <section className="flex items-center gap-5">
            <Image
              src="/assets/images/icons/arrow-left.svg"
              alt="logo"
              height={19}
              width={18}
            />
            <p className="text-md font-medium">Back</p>
          </section>
        </section>
        <p className="font-bold text-3xl">Counter Offer</p>

        <p className="font-bold text-base">Presented to</p>

        <section className="grid grid-cols-3 gap-6">
          <ContactCard
            name={singlePropertyOffer?.data?.buyerAgent?.fullname}
            email={singlePropertyOffer?.data?.buyerAgent?.email}
            phone={singlePropertyOffer?.data?.buyerAgent?.mobile?.raw_mobile}
            license={`${'Licence#'} ${singlePropertyOffer?.data?.buyerAgent?.licence_number}`}
            profilePlaceholder={`${singlePropertyOffer?.data?.buyerAgent?.firstName[0].toUpperCase()}${singlePropertyOffer?.data?.buyerAgent?.lastName[0].toUpperCase()}`}
          />
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <BorderedTextArea
                {...field}
                placeholder="Add a note"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e?.target.value)}
                className="h-36 w-[25rem]"
                inputClassName="border-transparent bg-[#F5F8FA] placeholder-shown:border-transparent"
              />
            )}
          />
        </section>
        <section>
          <section className="py-10">
            <p className="font-bold text-base">Offer Expiration</p>
            <section className="flex gap-6 mt-6">
              <DatePicker
                placeholder="Choose new date"
                inputClassName="w-full border border[#707070]"
                labelClassName="text-black font-medium text-base"
              />
              <TimePicker labelClassName="text-black font-medium text-base" />
            </section>
          </section>
        </section>
        <section className="py-10 ">
          <p className="font-bold text-base">Summary of terms</p>
          <section className="grid grid-cols-3 gap-6">
            <Controller
              name="offerPrice"
              control={control}
              render={({ field: { onChange, value } }) => (
                <BorderedTextInput
                  label="Offer Price"
                  labelClassName="mt-6"
                  type="number"
                  inputClassName="border-transparent bg-[#F5F8FA] rounded-l-none"
                  error={errors.offerPrice?.message}
                  defaultValue={singlePropertyOffer?.data?.offerPrice?.amount}
                  onChange={onChange}
                  value={value}
                  left={
                    <p className="fontMedium text-base bg-[#F5F8FA] h-full flex p-2 items-center rounded-l-md">
                      $
                    </p>
                  }
                />
              )}
            />
            <Controller
              name="financeType"
              defaultValue={undefined}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Finance Type"
                  labelClassName="mt-6"
                  options={[
                    { label: 'loan', value: 'loan' },
                    { label: 'cash', value: 'cash' },
                    { label: 'contingent', value: 'contingent' },
                    { label: 'non-contingent', value: 'non-contingent' },
                    { label: 'FHA-VA loan', value: 'FHA-VA loan' }
                  ]}
                  inputClassName="h-13 border-transparent bg-[#F5F8FA]"
                  onSelect={(selectedValue) => {
                    onChange(
                      selectedValue !== undefined ? selectedValue : undefined
                    )
                  }}
                  error={errors.financeType?.message}
                  defaultValue={singlePropertyOffer?.data?.financeType}
                  value={value}
                />
              )}
            />
            <Controller
              name="downPayment"
              control={control}
              render={({ field: { onChange, value } }) => (
                <BorderedTextInput
                  label="Down Payment"
                  labelClassName="mt-6"
                  type="number"
                  inputClassName="border-transparent bg-[#F5F8FA] rounded-l-none"
                  error={errors.downPayment?.message}
                  defaultValue={singlePropertyOffer?.data?.downPayment?.amount}
                  onChange={onChange}
                  value={value}
                  left={
                    <p className="fontMedium text-base bg-[#F5F8FA] h-full flex p-2 items-center rounded-l-md">
                      $
                    </p>
                  }
                />
              )}
            />

            <Controller
              name="financeContingency"
              control={control}
              render={({ field: { onChange, value } }) => (
                <BorderedTextInput
                  label="Finance Contingency"
                  labelClassName=""
                  type="number"
                  inputClassName="border-transparent bg-[#F5F8FA]"
                  left={
                    <div className="flex items-center h-full">
                      <select className="h-full bg-[#F5F8FA]  rounded-l-md text-base text-[#2E2E2E] font-medium outline-none px-2">
                        <option>Days</option>
                      </select>
                      <div className="h-[70%] border-r border-[#D5D9DC]"></div>
                    </div>
                  }
                  error={errors.financeContingency?.message}
                  defaultValue={
                    singlePropertyOffer?.data?.financeContingency?.amount
                  }
                  onChange={onChange}
                  value={value}
                />
              )}
            />

            <Controller
              name="appraisalContingency"
              control={control}
              render={({ field: { onChange, value } }) => (
                <BorderedTextInput
                  label="Appraisal Contingency"
                  labelClassName=""
                  type="number"
                  inputClassName="border-transparent bg-[#F5F8FA]"
                  left={
                    <div className="flex items-center h-full">
                      <select className="h-full bg-[#F5F8FA]  rounded-l-md text-base text-[#2E2E2E] font-medium outline-none px-2">
                        <option>Days</option>
                      </select>
                      <div className="h-[70%] border-r border-[#D5D9DC]"></div>
                    </div>
                  }
                  error={errors.appraisalContingency?.message}
                  defaultValue={
                    singlePropertyOffer?.data?.appraisalContingency?.amount
                  }
                  onChange={onChange}
                  value={value}
                />
              )}
            />

            <Controller
              name="inspectionContingency"
              control={control}
              render={({ field: { onChange, value } }) => (
                <BorderedTextInput
                  label="Inspection Contingency"
                  labelClassName=""
                  type="number"
                  inputClassName="border-transparent bg-[#F5F8FA] rounded-l-none"
                  left={
                    <div className="flex items-center h-full">
                      <select className="h-full bg-[#F5F8FA]  rounded-l-md text-base text-[#2E2E2E] font-medium outline-none px-2">
                        <option>Days</option>
                      </select>
                      <div className="h-[70%] border-r border-[#D5D9DC]"></div>
                    </div>
                  }
                  error={errors.inspectionContingency?.message}
                  defaultValue={
                    singlePropertyOffer?.data?.inspectionContingency?.amount
                  }
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              name="closeEscrow"
              control={control}
              render={({ field: { onChange, value } }) => (
                <BorderedTextInput
                  label="Close Escrow"
                  labelClassName="mt-6"
                  type="number"
                  inputClassName="border-transparent bg-[#F5F8FA] rounded-l-none"
                  left={
                    <div className="flex items-center h-full">
                      <select className="h-full bg-[#F5F8FA]  rounded-l-md text-base text-[#2E2E2E] font-medium outline-none px-2">
                        <option>Days</option>
                      </select>
                      <div className="h-[70%] border-r border-[#D5D9DC]"></div>
                    </div>
                  }
                  error={errors.closeEscrow?.message}
                  defaultValue={singlePropertyOffer?.data?.closeEscrow?.amount}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </section>
        </section>
        <section className="py-10">
          <p className="font-bold text-base">Special terms</p>
          <Controller
            name="specialTerms"
            control={control}
            render={({ field: { onChange, value } }) => (
              <BorderedTextArea
                labelClassName=""
                placeholder="Add a note"
                type="text"
                name="propertyDescription"
                className="h-36  w-[25rem]"
                inputClassName="border-transparent bg-[#F5F8FA] placeholder-shown:border-transparent"
                error={errors.specialTerms?.message}
                defaultValue={singlePropertyOffer?.data?.specialTerms}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </section>

        <section className="mt-10">
          <p className="font-bold text-base">Documents</p>
          <section className="py-12 flex flex-col gap-3">
            {singlePropertyOffer?.data?.documents &&
            singlePropertyOffer.data.documents.length > 0 ? (
              singlePropertyOffer.data.documents.map((propertyDocument) => (
                <DocumentCard
                  key={propertyDocument.id}
                  downloadDocument={() =>
                    downloadDocument(
                      propertyDocument.url,
                      propertyDocument.name
                    )
                  }
                  title={propertyDocument.name}
                  updatedDate="NA"
                />
              ))
            ) : (
              <p className="font-medium text-base text-balance">
                No documents available
              </p>
            )}
          </section>
        </section>
      </section>
      <SummaryTermsCard
        offerPrice={singlePropertyOffer?.data?.offerPrice?.amount || '0'}
        loanAmount={singlePropertyOffer?.data?.loanAmount?.amount || '0'}
        financeType={singlePropertyOffer?.data?.financeType || '-'}
        downPayment={singlePropertyOffer?.data?.downPayment?.amount || '0'}
        financeContingency={
          singlePropertyOffer?.data?.financeContingency?.amount || '0'
        }
        financeContingencyunit={
          singlePropertyOffer?.data?.financeContingency?.unit || '-'
        }
        apprasalContingency={
          singlePropertyOffer?.data?.apprasalContingency || '-'
        }
        inspectionContingency={
          singlePropertyOffer?.data?.inspectionContingency?.amount || '0'
        }
        inspectionContingencyunit={
          singlePropertyOffer?.data?.inspectionContingency?.unit || '-'
        }
        closeEscrow={singlePropertyOffer?.data?.closeEscrow || '-'}
        label="Cancel"
        isCounterOffer={true}
        userType='sell'
        submitLabel="Submit"
        buttonType="submit"
        loading={status === 'pending'}
        onClickSubmit={() => {}}
        onClickCancel={handleBack}
      />
    </form>
  )
}

export default CounterOffer
