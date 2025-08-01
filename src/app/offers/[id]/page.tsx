// 'use client'

// import { Accordion } from 'components/common/Accordion'
// import { Button } from 'components/common/buttons/Button'
// import { DocumentCard } from 'components/common/DocumentCard'
// import ContactCard from 'components/dashboard/ContactCard'
// import SummaryTermsCard from 'components/dashboard/summaryTermsCard'
// import {
//   useUpdatePropertyOffer,
//   useSinglePropertyOffers
// } from 'hooks/usePropertyOffer'
// import { useAtom } from 'jotai'
// import Image from 'next/image'
// import { useParams, useRouter } from 'next/navigation'
// import { propertyOfferAtom } from 'store/atoms/atoms'
// import { formatDate } from 'utils/dateutilities'
// import { downloadDocument } from 'utils/downloadFunction'

// const Offer = () => {
//   const router = useRouter()
//   const [selectedOffer] = useAtom(propertyOfferAtom)
//   const handleBack = () => {
//     router.back()
//   }
//   console.log(selectedOffer)
//   const [{ mutateAcceptPropertyOffer, status }] = useUpdatePropertyOffer()

//   const params = useParams()
//   const id = params?.id
//   const { data: singlePropertyOffer } = useSinglePropertyOffers(id as string)

//   const { month, day, year } = formatDate(
//     singlePropertyOffer?.data?.buyerAgent?.createdAt
//   )
//   const handlePublishProperty = () => {
//     const body = {
//       header: 'this is the header',
//       body: 'this is the body',
//       offerId: singlePropertyOffer?.data?._id,
//       response: true,
//       notifyOtherParties: true
//     }

//     mutateAcceptPropertyOffer(body)
//   }

//   return (
//     <section className="bg-white rounded-t-xl px-14 py-12 gap-12 h-full min-h-screen flex">
//       <section className="w-3/5">
//         <section className="flex items-center justify-between mb-12">
//           <section
//             className="flex items-center gap-5 cursor-pointer"
//             onClick={handleBack}>
//             <Image
//               src="/assets/images/icons/arrow-left.svg"
//               alt="logo"
//               height={19}
//               width={18}
//             />
//             <p className="text-md font-medium">Back</p>
//           </section>
//           <Button className="bg-black flex items-center justify-center gap-3 w-1/5">
//             <p className="text-md text-white ">Summarize</p>
//             <Image
//               src="/assets/images/icons/starIcon.svg"
//               alt="Star"
//               height={21}
//               width={20}
//             />
//           </Button>
//         </section>
//         <section className="flex items-center justify-between mb-12">
//           <section className="flex items-center gap-4">
//             <p className="text-base capitalize text-[#E8804C] font-medium">
//               Offers
//             </p>
//             <Image
//               src="/assets/images/icons/caretRight.svg"
//               alt="logo"
//               height={9}
//               width={6}
//             />
//             <p className="text-base capitalize text-[#E8804C] font-medium">
//               {singlePropertyOffer?.data?.buyerAgent?.fullname}
//             </p>
//           </section>
//           <p className="text-md capitalize font-medium">
//             Sent on{`${month} ${day} ${year}`}
//           </p>
//         </section>
//         <Accordion
//           title="Presented by"
//           content={
//             <section className="grid grid-cols-3 gap-6">
//               <ContactCard
//                 name={singlePropertyOffer?.data?.buyerAgent?.fullname}
//                 email={singlePropertyOffer?.data?.buyerAgent?.email}
//                 phone={
//                   singlePropertyOffer?.data?.buyerAgent?.mobile?.raw_mobile
//                 }
//                 license={`${'Licence#'} ${singlePropertyOffer?.data?.buyerAgent?.licence_number}`}
//                 profilePlaceholder={`${singlePropertyOffer?.data?.buyerAgent?.firstName[0].toUpperCase()}${singlePropertyOffer?.data?.buyerAgent?.lastName[0].toUpperCase()}`}
//               />
//             </section>
//           }
//         />
//         <Accordion
//           title="Letter & Special Terms"
//           content={
//             <section className="py-12 px-8">
//               <p className="font-medium text-base text-balance">
//                 RE: OFFER LETTER GOES HERE <br />
//                 <br />
//                 <br /> It is a long established fact that a reader will be
//                 distracted by the readable content of a page when looking at its
//                 layout. The point of using Lorem Ipsum is that it has a
//                 more-or-less normal distribution of letters, as opposed to using
//                 ‘Content here, content here’, making it look like readable
//                 English. Many desktop publishing packages and web page editors
//                 now use Lorem Ipsum as their default model text, and a search
//                 for ‘lorem ipsum’ will uncover many web sites still in their
//                 infancy. Various versions have evolved over the years, sometimes
//                 by accident, sometimes on purpose (injected humour and the
//                 like). <br />
//                 <br />
//                 <br /> Contrary to popular belief, Lorem Ipsum is not simply
//                 random text. It has roots in a piece of classical Latin
//                 literature from 45 BC, making it over 2000 years old. Richard
//                 McClintock
//               </p>
//             </section>
//           }
//         />
//         <Accordion
//           title="Documents"
//           content={
//             <section className="py-12 flex flex-col gap-3">
//               {singlePropertyOffer?.data?.documents &&
//               singlePropertyOffer.data.documents.length > 0 ? (
//                 singlePropertyOffer.data.documents.map((propertyDocument) => (
//                   <DocumentCard
//                     key={propertyDocument.id}
//                     downloadDocument={() =>
//                       downloadDocument(
//                         propertyDocument.url,
//                         propertyDocument.name
//                       )
//                     }
//                     title={propertyDocument.name}
//                     updatedDate="NA"
//                   />
//                 ))
//               ) : (
//                 <p className="font-medium text-base text-balance">
//                   No documents available
//                 </p>
//               )}
//             </section>
//           }
//         />
//       </section>
//       <SummaryTermsCard
//         offerPrice={singlePropertyOffer?.data?.offerPrice?.amount || '0'}
//         loanAmount={singlePropertyOffer?.data?.loanAmount?.amount || '0'}
//         financeType={singlePropertyOffer?.data?.financeType || '-'}
//         downPayment={singlePropertyOffer?.data?.downPayment?.amount || '0'}
//         financeContingency={
//           singlePropertyOffer?.data?.financeContingency?.amount || '0'
//         }
//         financeContingencyunit={
//           singlePropertyOffer?.data?.financeContingency?.unit || '-'
//         }
//         apprasalContingency={
//           singlePropertyOffer?.data?.apprasalContingency || '-'
//         }
//         inspectionContingency={
//           singlePropertyOffer?.data?.inspectionContingency?.amount || '0'
//         }
//         inspectionContingencyunit={
//           singlePropertyOffer?.data?.inspectionContingency?.unit || '-'
//         }
//         closeEscrow={singlePropertyOffer?.data?.closeEscrow || '-'}
//         label="Counter Offer"
//         submitLabel="Accept offer"
//         buttonType="submit"
//         loading={status === 'pending'}
//         onClickSubmit={handlePublishProperty}
//         onClickCancel={() => router.push(`/counter-offer/${id}`)}
//       />
//     </section>
//   )
// }

// export default Offer

'use client'
import parse from 'html-react-parser';
import { Accordion } from 'components/common/Accordion'
import { Button } from 'components/common/buttons/Button'
import { DocumentCard } from 'components/common/DocumentCard'
import ContactCard from 'components/dashboard/ContactCard'
import SummaryTermsCard from 'components/dashboard/summaryTermsCard'
import { useUpdatePropertyOffer } from 'hooks/usePropertyOffer'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { propertyOfferAtom } from 'store/atoms/atoms'
import { formatDate } from 'utils/dateutilities'
import { downloadDocument } from 'utils/downloadFunction'
import { selectAtom } from 'jotai/utils';
import { agentReadWriteAtom } from 'store/atoms/agent-atom';
import { useGetPropertyOfferById } from 'lib/api/property';

const Offer = () => {
  const router = useRouter()
  //const [selectedOffer] = useAtom(propertyOfferAtom)
  const handleBack = () => router.back()
  const [currentAgent] = useAtom(agentReadWriteAtom);
  const params = useParams()
  const offerId = params?.id || ""
  const [{ mutateAcceptPropertyOffer, status }] = useUpdatePropertyOffer()
  const {data:selectedOffer , isLoading , error} = useGetPropertyOfferById(offerId || "")
  const  search = useSearchParams()
  const type = search.get('type')

  // Defensive fallback if selectedOffer is not defined yet
  if (!selectedOffer) {
    return <p>Loading offer data...</p>
  }
  console.log(selectedOffer)

  // Format the date from createdBy.createdAt or fallback
  const { month, day, year } = formatDate(selectedOffer.createdAt || new Date().toISOString())

  const handlePublishProperty = () => {
    const body = {
      header: 'this is the header',
      body: 'this is the body',
      offerId: selectedOffer.id,
      response: true,
      notifyOtherParties: true,
    }
    mutateAcceptPropertyOffer(body)
  }

  return (
    <section className="bg-white rounded-t-xl px-14 py-12 gap-12 h-full min-h-screen flex">
      <section className="w-3/5">
        <section className="flex items-center justify-between mb-12">
          <section className="flex items-center gap-5 cursor-pointer" onClick={handleBack}>
            <Image src="/assets/images/icons/arrow-left.svg" alt="logo" height={19} width={18} />
            <p className="text-md font-medium">Back</p>
          </section>
          <Button className="bg-black flex items-center justify-center gap-3 w-1/5">
            <p className="text-md text-white ">Summarize</p>
            <Image src="/assets/images/icons/starIcon.svg" alt="Star" height={21} width={20} />
          </Button>
        </section>
        <section className="flex items-center justify-between mb-12">
          <section className="flex items-center gap-4">
            <p className="text-base capitalize text-[#E8804C] font-medium">Offers</p>
            <Image src="/assets/images/icons/caretRight.svg" alt="logo" height={9} width={6} />
            <p className="text-base capitalize text-[#E8804C] font-medium">
              {selectedOffer?.createdBy?.firstName} {selectedOffer?.createdBy?.lastName}
            </p>
          </section>
          <p className="text-md capitalize font-medium">
            Sent on {`${month} ${day} ${year}`}
          </p>
        </section>
        <Accordion
          title="Presented by"
          content={
            <section className="grid grid-cols-3 gap-6">
              <ContactCard
                name={`${selectedOffer?.createdBy?.firstName} ${selectedOffer?.createdBy?.lastName}`}
                email={selectedOffer?.createdBy?.email}
                phone={selectedOffer?.createdBy?.phone}
                license="" // No licence data in your object, leave blank or add if available
                profilePlaceholder={`${selectedOffer?.createdBy?.firstName[0]}${selectedOffer?.createdBy?.lastName[0]}`}
              />
            </section>
          }
        />
        <Accordion
          title="Cover Letter "
          content={
            <section className="py-12 px-8">
              <p className="font-medium text-base text-balance">
              {selectedOffer?.coverLetter
                ? parse(selectedOffer.coverLetter)
                : 'No cover letter available'}
              </p>
            </section>
          }
        />
         <Accordion
          title="Special Terms"
          content={
            <section className="py-12 px-8">
              <p className="font-medium text-base text-balance">
              {selectedOffer?.specialTerms
                ? parse(selectedOffer.specialTerms)
                : 'No cover letter available'}
              </p>
            </section>
          }
        />
        <Accordion
          title="Documents"
          content={
            <section className="py-12 flex flex-col gap-3">
              {selectedOffer.documents && selectedOffer.documents.length > 0 ? (
                selectedOffer.documents.map((propertyDocument) => (
                  <DocumentCard
                    key={propertyDocument.id}
                    downloadDocument={() => downloadDocument(propertyDocument.url, propertyDocument.name)}
                    title={propertyDocument.name}
                    updatedDate="NA"
                  />
                ))
              ) : (
                <p className="font-medium text-base text-balance">No documents available</p>
              )}
            </section>
          }
        />
      </section>
      <SummaryTermsCard
      status = {selectedOffer?.status}
         isCounterOffer={selectedOffer?.createdBy?.id != currentAgent?.user?.id}
        offerPrice={selectedOffer.price || '0'}
        loanAmount={selectedOffer.cashAmount || '0'} // cashAmount used as loanAmount placeholder, adjust if needed
        financeType={selectedOffer.financeType || '-'}
        downPayment={selectedOffer.downPayment || '0'}
        financeContingency={selectedOffer?.financeContingencyDays || '0'}// Not provided, adjust accordingly
        financeContingencyunit="-Days"
        apprasalContingency={selectedOffer?.appraisalContingencyDays  || '0'}
        inspectionContingency={selectedOffer?.inspectionContingencyDays || '0'}
        inspectionContingencyunit="-Days"
        closeEscrow={selectedOffer?.closeEscrowDays|| '0'}
        label="Counter Offer"
        submitLabel="Accept offer"
        buttonType="submit"
        userType='sell'
        loading={status === 'pending'}
        onClickSubmit={handlePublishProperty}
        onClickCancel={() => router.push(`/counter-offer/${offerId}?type={type}`)}
      />
    </section>
  )
}

export default Offer

