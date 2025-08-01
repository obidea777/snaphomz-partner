'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { success } from 'components/alert/notify'
import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { DocumentCard } from 'components/common/DocumentCard'
import { EmptyPlaceholder } from 'components/common/EmptyPlaceholder'
import { EmptyPlaceholderAgreement } from 'components/common/EmptyPlaceholder-Agreement'
import { RoundedButtonFileUpload } from 'components/common/inputs/RoundedButtonFileUpload'
import LoadingState from 'components/common/LoadingState'
import Modal from 'components/common/Modal'
import AgreementModal from 'components/dashboard/sell/agreemant-modal'
import CreateTransactionModal from 'components/dashboard/sell/transaction'
import UpdateStatusModal from 'components/dashboard/sell/transaction_step2'
import { PropertyTransactionItem } from 'components/overview/PropertyTransactionItem'
import {
  deletePropertyDocument,
  useAllDocumentsOfAProperty
} from 'hooks/usePropertyDocuments'
import { useUpdatePropertyDocument } from 'hooks/useUpdateProperty'
import { useAtom } from 'jotai'
import { usePropertyServiceAPI } from 'lib/api/property'
import { addFormToTransaction, createTransaction, deleteTransaction, fetchTransactionDocuments } from 'lib/api/zipform'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { propertyReadWriteAtom } from 'store/atoms/property'
import { formatDate } from 'utils/dateutilities'
import { downloadDocument } from 'utils/downloadFunction'
import { showToast } from 'utils/toastHelper'
import Image from 'next/image'
import DeleteConfirmationModal from 'components/dashboard/sell/confirmationModal'

const Agreement = () => {
  const params = useParams()
  const queryClient = useQueryClient()
  const id = params?.id
  const [isOpen, setIsOpen] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [activeDocument, setActiveDocument] = useState<string | null>(null)
  const {
    data: propertyDocuments,
    isLoading,
    error
  } = useAllDocumentsOfAProperty(id as string)
  const { setFile, postUpdateLoading } = useUpdatePropertyDocument(id as string)
  const result = propertyDocuments?.data?.result
  const [agent] = useAtom(agentReadWriteAtom);
  const [loading, setLoading] = useState(false)
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [propertyStatus, setPropertyStatus] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useAtom(propertyReadWriteAtom);
  const [agreementDocs, setAgrreementDocs] = useState<any>(null)
  const contextId = agent.contextId;
  const { updateParticipantsBRA } = usePropertyServiceAPI()

  console.log("Property data : ", propertyData);

  const handleSelect = (option: string) => {
    setPropertyType(option);
  };
  const handleFileChange = (file: File) => {
    setFile(file)
  }
  const closeModal = () => {
    setPropertyStatus(null)
    setTransactionType(null)
    setIsOpen(null)
    setPropertyType(null);
  }
  const handleDocumentClick = (document) => {
    setSelectedDocument(document)
  }
  const useDeletePropertyDocument = () => {
    const mutation = useMutation({
      mutationFn: deletePropertyDocument,
      mutationKey: ['DELETE_PROPERTY_DOCUMENT'],
      onSuccess: (data) => {
        showToast('success', data.message)
        queryClient.refetchQueries({
          queryKey: ['GET_DOCUMENTS_OF_PROPERTY'],
          exact: true
        })
      }
    })

    return mutation
  }
  const {
    mutate: deletePropertyDocumentMutate,
    status,
    data: deletePropertyData
  } = useDeletePropertyDocument()

  const handleDocumentDelete = (document) => {
    setSelectedDocument(document)
    deletePropertyDocumentMutate(document?._id)
  }

  const handleCreateTransaction = async () => {


    const transactionData = {
      name: 'New Transaction',
      data: {
        transactionType: propertyType,
        propertyType: 'Residential',
        Other_Seller1_FirstName: agent.user.firstName,
        REData_REProperties_ResidentialProperty_Listing_ListingData_REOffice_StreetAddress_PostalCode: propertyData?.selectedProperty?.zipCode,
        REData_REProperties_ResidentialProperty_YearBuilt: 2023,
        REData_REProperties_ResidentialProperty_Listing_ListingData_ListPrice: 120000,
        REData_REProperties_ResidentialProperty_Listing_StreetAddress_City: propertyData?.selectedProperty?.city,
        REData_REProperties_ResidentialProperty_Listing_StreetAddress_StateOrProvince: propertyData.selectedProperty.propertyAddress,
      },
      status: 'active',
    };
    try {
      const newTransaction = await createTransaction(contextId, transactionData);
      if (newTransaction?.success) {
        updateParticipantsBRA.mutate({ id: propertyData.engagedProperty.id, bra_id: newTransaction?.data?.value?.id }, {
          onSuccess: (data) => {
            setPropertyData({
              selectedProperty: propertyData.selectedProperty,
              engagedProperty: {
                ...propertyData.engagedProperty,
                bra_id: newTransaction?.data?.value?.id
              }
            })
            success({ message: "Buyer representation agreement created successfully" })
          }
        })
      }
      closeModal();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const getBRADocuments = async () => {
    try {
      setLoading(true)
      const response = await fetchTransactionDocuments(agent.contextId, propertyData?.engagedProperty?.bra_id)
      // console.log('Fetched documents:', response);
      setAgrreementDocs(response?.data?.value)
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
    setLoading(false)
  }

  const addBRADocuments = async () => {
    try {
      setLoading(true)
      const documentData = {
        "id": "81c5450b-a87d-468d-b8b9-0056cae7e9a5",
        "status": 0
      }
      await addFormToTransaction(agent.contextId, propertyData?.engagedProperty?.bra_id, documentData)
      setIsOpen(null)
      success({ message: "Agreement created successfully" })
      getBRADocuments();
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
    setLoading(false)
  }

  const deleteAgentTransaction = async () => {
    try {      
      setLoading(true)
      const response = await deleteTransaction(agent.contextId, propertyData?.engagedProperty?.bra_id)
      setPropertyData({
        selectedProperty: propertyData.selectedProperty,
        engagedProperty: {
          ...propertyData.engagedProperty,
          bra_id: null
        }
      })
      setIsOpen(null)
      success({ message: "Transaction deleted Successfully" })
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
    setLoading(false)
  }

  useEffect(() => {
    if (propertyData?.engagedProperty?.bra_id) {
      getBRADocuments()
    }
  }, [propertyData?.engagedProperty])

  return <>
    <section className="pb-6">
      <PropertyTransactionItem />
      {
        propertyData?.engagedProperty?.bra_id ? <>
          <section className="w-full flex items-center justify-end my-10 gap-7">
            <RoundedButtonFileUpload setFile={handleFileChange} />
            <RoundedButton
              label="Genrate Form"
              onClick={() => { setIsOpen("step3") }}
              variant="primary"
              className="bg-black text-white py-2 text-sm"
            />
            <RoundedButton
              label="Delete Transaction"
              onClick={() => { setIsOpen("step4") }}
              variant="primary"
              className="bg-black text-white py-2 text-sm"
            />
          </section>
          <>
            {
              agreementDocs?.length > 0 ? <>
                <section className="flex flex-wrap items-center gap-10">
                  {
                    agreementDocs?.map((propertyDocument) => {
                      const { month, day, year, time } = formatDate(
                        propertyDocument.updatedAt
                      )
                      return (
                        <DocumentCard
                          key={propertyDocument?._id}
                          downloadDocument={() =>
                            downloadDocument(
                              propertyDocument.url,
                              propertyDocument.name
                            )
                          }
                          title={propertyDocument.name}
                          description={propertyDocument.description}
                          updatedDate={`Updated ${month} ${day}, ${year} ${time}`}
                          onClick={() => {
                            handleDocumentClick(propertyDocument)
                          }}
                          documentUrl={selectedDocument?.url}
                          handleDocumentDelete={() =>
                            handleDocumentDelete(propertyDocument)
                          }
                          isOpen={activeDocument === propertyDocument._id}
                          setActiveDocument={() =>
                            setActiveDocument(
                              activeDocument === propertyDocument._id
                                ? null
                                : propertyDocument._id
                            )
                          }
                        />
                      )
                    })
                  }
                </section>
              </> : <section className="w-full flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                <div className="mb-4 p-4 bg-white rounded-full shadow-sm">
                  <Image
                    src="/assets/images/icons/documents.svg"
                    alt="No documents"
                    width={48}
                    height={48}
                    className="opacity-70"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Documents Found</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md text-center">
                  Documents related to this property will appear here once uploaded
                </p>
                {/* <RoundedButton
            label="Upload Document"
            onClick={() => {}}
            variant="primary"
            className="bg-black text-white py-2 px-6 text-sm"
          /> */}
              </section>
            }
          </>
        </> : <EmptyPlaceholderAgreement
          EmptyPlaceHolderImage="/assets/images/icons/agreement-01.svg"
          transactionImage='/assets/images/icons/transaction-01.svg'
          title="Agreements"
          description="You don't have an agreement here"
          buttonLabel='Create transaction'
          onButtonClick={() => {
            setIsOpen("step1")
          }}
        />
      }
    </section>
    <Modal isOpen={isOpen === "step1"} closeModal={closeModal}>
      <CreateTransactionModal
        propertyType={propertyType}
        handleSelect={handleSelect}
        key="01"
        onClose={closeModal}
        setIsOpen={setIsOpen}
      />
    </Modal>

    <Modal isOpen={isOpen === "step3"} closeModal={closeModal}>
      <AgreementModal
        key="01"
        isOpen={isOpen === "step3"}
        loading={loading}
        onClose={closeModal}
        generateAgreement={addBRADocuments}
      />
    </Modal>

    <Modal isOpen={isOpen === "step4"} closeModal={closeModal}>
      <DeleteConfirmationModal
        key="04"
        isOpen={isOpen === "step4"}
        loading={loading}
        onClose={closeModal}
        onDelete={()=>{
          console.log("Delete transaction");
          deleteAgentTransaction()
        }}
        // generateAgreement={addBRADocuments}
      />
    </Modal>

    <Modal isOpen={isOpen === "step2"} closeModal={closeModal}>
      <UpdateStatusModal
        status={propertyStatus}
        transactionType={transactionType}
        setStatus={setPropertyStatus}
        setTransactionType={setTransactionType}
        onClose={closeModal}
        handleCreateTransaction={handleCreateTransaction}
      />
    </Modal>
  </>
}

export default Agreement
