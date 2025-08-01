'use client'

import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { CardItem } from 'components/common/CardItem'
import Checkbox from 'components/common/Checkbox'
import { CustomFileInputBuyer } from 'components/common/CustomFileInputBuyer'
import Dropdown from 'components/common/DropDown'
import BorderedTextArea from 'components/common/inputs/BorderedTextArea'
import { BorderedTextInput } from 'components/common/inputs/BorderedTextInput'
import {
  useUpdatePropertyOffer,
  useAllPropertyOffers
} from 'hooks/usePropertyOffer'
import { useFetchAllTours } from 'hooks/useTours'
import { IBuyer } from 'interfaces/buyerOffer'
import { useAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import { propertyOfferAtom } from 'store/atoms/atoms'
import { formatDate } from 'utils/dateutilities'
import { error, success } from 'components/alert/notify';
import { usePropertyServiceAPI } from 'lib/api/property'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { propertyReadWriteAtom } from 'store/atoms/property'
import { Button } from '@mantine/core'
import { Eye, FileText, Info, X } from 'lucide-react'
import FolderIcon from '../../../../../public/assets/images/icons/folder.svg'
import { SharedFolder } from 'components/dashboard/documents/shared-folder'
import { useGetAllRepos, useRepoManagementApi } from 'lib/api/useRepoManagement'
import { RectIcon } from 'components/common/offer-document-card'
import Modal from 'components/common/Modal'
import { SocketContext } from 'providers/socket.context'

const repos = [
  {
    label: 'Disclosure',
    subTitle: 'disclosure shared documents',
    folderName: 'disclosure-document',
    folderUrl: '/disclosure-document'

  },
  {
    label: 'Agreements',
    subTitle: 'agreement shared documents',
    folderName: 'agreement-document', folderUrl: '/agreement-document'
  },
  {
    label: 'Other Docs',
    subTitle: 'shared proof documents',

    folderName: 'proof-document',
    folderUrl: '/proof-document'
  },
];
interface TimeDropdownProps {
  value: string | null
  label: string
  labelClassName?: string
  inputClassName?: string
  onSelect: (selectedValue: string) => void
}

const generateTimeOptions = (): { label: string; value: string }[] => {
  const times = []
  const startTime = 9
  const endTime = 18

  for (let hour = startTime; hour <= endTime; hour++) {
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hourIn12HourFormat = hour > 12 ? hour - 12 : hour
    const formattedTime = `${hourIn12HourFormat}:00 ${ampm}`
    times.push({
      label: formattedTime,
      value: formattedTime
    })
  }
  return times
}

type IPropertyInformationProps = {
  params: { slug: string }
}

type BinaryFileType = {
  name: string;
  value: string;
  uplaodedAt?: string;
}

const PropertyInformation: React.FC<IPropertyInformationProps> = () => {
  const [pageCount, setPageCount] = useState(1);
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const params = useParams()
  const [agentState,] = useAtom(agentReadWriteAtom)
  const [propertyData,] = useAtom(propertyReadWriteAtom)
  const propertyId = propertyData?.engagedProperty?.engagement?.propertyId
  const id = params?.id
  const { data: tours } = useFetchAllTours()
  const [offerForm, setOfferForm] = useState({
    propertyEngagementId: id,
    price: null,
    financeType: '',
    downPayment: null,
    cashAmount: null,
    coverLetter: '',
    financeContingency: '',
    appraisalContingency: '',
    inspectionContingency: '',
    closeEscrow: '',
    expiryDate: '',
    documentIds: [] as string[],
    specialTerms: '',
    messageToAgent: '',
  });
  const [selectedFolder, setSelectedFolder] = useState()
  const { data: docs = [], isLoading: reposLoading } = useGetAllRepos(propertyId, selectedFolder);
  const [formErrors, setFormErrors] = useState<{ price?: string; downPayment?: string; financeType?: string; cashAmount?: string }>({});
  const [selectedOffer, setSelectedOffer] = useAtom(propertyOfferAtom)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null);
  const { useCreatePropertyOffer, uploadNewFile } = usePropertyServiceAPI()
  const { mutate: createOffer } = useCreatePropertyOffer()
  const { createRepoWithUploadedFile }= useRepoManagementApi()
  const [opened, setOpened] = useState(false);
  const [binaryFile, setBinaryFile] = useState<BinaryFileType[]>([]);
  const [document , setDocuments] = useState([])
  const { socket, state, setState } = useContext(SocketContext)
  const handleOfferClick = (offer: IBuyer) => {
    setSelectedOffer(offer)
    if (router) {
      router.push(`/offers/${offer.id}`)
    }
  }

  const firstTour = tours?.data?.result?.[0]
  const { month, day } = firstTour?.eventDate?.[0]?.eventDate
    ? formatDate(firstTour?.eventDate?.[0]?.eventDate)
    : { month: '--', day: '--' }
  const [{ mutateAcceptPropertyOffer, status }] = useUpdatePropertyOffer()

  const getBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  const handleFileChange = async (file: any) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      const base64 = await getBase64(file)
      setBinaryFile((prev) => [
        ...prev,
        {
          name: file.name,
          value: base64
        }
      ]);
    } else {
      error({ message: "Only PDF files are supported" })
    }
  }
  const handleFileUpload = async (file: any) => {
    setUploading(true)
    if (file && file.type === "application/pdf") {
      const { key } = await uploadNewFile(file, agentState.user.id, propertyData?.engagedProperty?.engagement?.propertyId);
      const payload = {
        uploadedFile: {
          fileName: file?.name,
          fileSize: file?.size,
          fileUrl: key,
          fileType: file?.type
        },
        createRepoManagementInput: {
          name: 'proof-document',
          url: '/proof-document',
          propertyId: propertyData?.engagedProperty?.engagement?.propertyId,
          createdBy: agentState.user.id,
          parentFolderName: 'proof-document',
          isArchived: false
        }
      };
      createRepoWithUploadedFile?.mutate(payload, {
        onSuccess: (data) => { 
          console.log(data)
          setDocuments((prev) => {
            return[
              ...prev,
              data
            ]
          })
        },
        onError: (err) => {
          error({ message: err?.message || 'Upload failed' });
        },
      });
      // const response = await uploadNewFile(file, agentState.user.id, propertyData?.engagedProperty?.engagement?.propertyId)
      setUploadedFiles((prev) => ([
        ...prev,
          key
      ]))
    } else {
      error({ message: "Only PDF files are supported" })
    }
    setUploading(false)
  };
  const preUploadFileChange = async (file: any) => {

    setUploadedFiles((prev) => ([
      ...prev,
      file?.fileUrl
    ]))

  };
  const handleAcceptPropertyOffer = (offerId) => {
    const body = {
      header: ' ',
      body: ' ',
      offerId: offerId,
      response: true,
      notifyOtherParties: true
    }

    mutateAcceptPropertyOffer({
      body: body
    })
  }
  console.log("Property L ",propertyData);

  const hnadleSubmit = async () => {
    const mapToDto = (form: any): any => ({
      userId: agentState?.user?.id,
      propertyEngagementId: form.propertyEngagementId,
      price: form.price,
      financeType: form.financeType,
      downPayment: form.downPayment,
      cashAmount: form.cashAmount,
      coverLetter: form.messageToAgent,
      specialTerms: form.specialTerms,
      financeContingency: form.financeContingency || '',
      financeContingencyDays: +form.financeContingencyDays || 0,
      appraisalContingency: form.appraisalContingency || '',
      appraisalContingencyDays: +form.appraisalContingencyDays || 0,
      inspectionContingency: form.inspectionContingency || '',
      inspectionContingencyDays: +form.inspectionContingencyDays || 0,
      closeEscrow: form.closeEscrow || '',
      closeEscrowDays: +form.closeEscrowDays || 0,
      propertyId: propertyData?.engagedProperty?.engagement?.propertyId,
      listingId: "" + propertyData?.engagedProperty?.engagement?.listingId,
      expiryDate: new Date() || '',
      documentIds: document || uploadedFiles || [],
      isBuyer:false,
      isSeller:false
    })
    const data = mapToDto(offerForm)
    createOffer({
      input: data,
      id: id.toString()
    }, {
      onSuccess: () => {
        const payload = {
          propertyName:propertyData.engagedProperty?.engagement?.propertyName,
          agentName:`${agentState.user?.firstName} ${agentState?.user?.lastName}`,
          userId:propertyData.engagedProperty?.userId
        }
        if(socket){

          console.log('insie socket')
          socket.emit('offer_created',payload);
        }
        success({ message: "Offer created successfully" })
        router.push(`/dashboard/buy/${id}/offers`);
      },
      onError: (error) => {
        console.error('Offer creation failed:', error.message);
      },
    })
  }
  const [activeTab, setActiveTab] = useState<number>(0); // Store the index of active tab

  const [selectedRepo, setSelectedRepo] = useState<any>(null);



  const handleCloseModal = () => {
    setOpened(false); // Close the modal
  };
  console.log(document)

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);



  // Function to handle the file selection
  const handleSelectFile = (file: any) => {
    console.log(file)
    const payload = {
      name: file?.fileName,
      value: file?.fileUrl,
      uploadedAt: file?.uploadedAt
    }
    setUploadedFiles((prev) => ([
      ...prev,
      file?.fileUrl
    ]))
    setBinaryFile((prev) => {
      return [
        ...prev,
        payload
      ]
    })
    setSelectedDoc(file);
    setModalOpened(false); // Close the modal after selection
  };

  const handleButtonClick = (repo) => {
    console.log(repo)
    setSelectedFolder(repo?.folderName) // Set the selected repo
    setModalOpened(true); // Open the modal
  };


  return (
    <>
      <section className="absolute top-40 left-0 right-0 bottom-0 z-50 bg-[#FAF9F5] overflow-hidden max-h-screen min-h-screen h-[100vh] ">
        {/* <nav
          className={`w-full py-6 flex items-center justify-between h-[100px] px-12`}>
          <Link href="/" className="block w-64">
            <Image
              src="/assets/images/snaphomz-logo.svg"
              alt="logo"
              height={60}
              width={180}
            />
          </Link>
        </nav> */}
        {/* <div className="w-full h-0.5 bg-[#EDEDED]">
          <div className={`h-full w-${pageCount}/4 bg-[#E8804C]`}></div>
        </div> */}
        {/* 1st page */}
        {pageCount === 1 && (
          <section className="flex flex-col items-center gap-x-5 py-8 justify-between h-4/5">
            <div className="w-3/5 flex flex-col items-center h-4/5">
              <h1 className="text-black text-3xl font-medium">Create Offer</h1>
              <p className="text-[#4D4D4D] text-lg mt-4 mb-14">Purchase Price Terms</p>

              <section className="grid grid-cols-2 w-2/5 gap-x-6 gap-y-20">
                {[
                  {
                    label: 'Purchase Price',
                    key: 'price',
                    type: 'number',
                    left: '$',
                  },
                  {
                    label: 'Initial Deposit',
                    key: 'downPayment',
                    type: 'number',
                    left: '$',
                  },
                  {
                    label: 'Finance Type',
                    key: 'financeType',
                    type: 'text',
                  },
                  {
                    label: 'Amount',
                    key: 'cashAmount',
                    type: 'number',
                    left: '$',
                  },
                ].map(({ label, key, type, left }) => (
                  <div key={key}>
                    <BorderedTextInput
                      label={label}
                      labelClassName="text-base font-medium text-black"
                      type={type}
                      inputClassName="border-none"
                      containerClass="border border-solid border-[#B2B2B2] bg-white rounded-md px-4"
                      left={left ? <p className="font-bold text-[#909090]">{left}</p> : null}
                      onChange={(e) =>
                        setOfferForm((prev) => ({
                          ...prev,
                          [key]: type === 'number' ? Number(e.target.value) : e.target.value,
                        }))
                      }
                      value={offerForm[key] ?? ''}
                    />
                    {formErrors[key] && (
                      <p className="text-red-500 text-sm mt-1">{formErrors[key]}</p>
                    )}
                  </div>
                ))}
              </section>
            </div>

            <div className="flex items-center justify-between w-full px-12">
              <section className="flex items-center w-1/2">
                <RoundedButton
                  label="Back"
                  onClick={() => router.back()}
                  variant="primary"
                  className="w-[30%] py-3 bg-transparent border border-solid border-black"
                />
                <RoundedButton
                  label="Discard & Exit"
                  onClick={() => router.back()}
                  variant="primary"
                  className="w-[30%] py-3 bg-transparent text-[#E8804C]"
                />
              </section>

              <RoundedButton
                label="Save & Continue"
                onClick={() => {
                  const requiredFields = [
                    { key: 'price', message: 'Purchase price is required' },
                    { key: 'downPayment', message: 'Initial deposit is required' },
                    { key: 'financeType', message: 'Finance type is required' },
                    { key: 'cashAmount', message: 'Cash amount is required' },
                  ];

                  for (let field of requiredFields) {
                    const value = offerForm[field.key];
                    const isInvalid =
                      typeof value === 'number' ? value <= 0 : !value || value.trim() === '';

                    if (isInvalid) {
                      error({ message: field.message });
                      return;
                    }
                  }

                  setFormErrors({});
                  setPageCount(2);
                }}
                variant="primary"
                className="w-[15%] py-3 bg-black border border-solid border-black text-white"
              />
            </div>
          </section>
        )}

        {/* 2nd page */}
        {pageCount === 2 && (
          <section className="flex flex-col items-center gap-x-10 py-8 justify-between h-4/5 w-full">
            <div className="w-4/5 flex flex-col items-center h-4/5">
              <div className="w-full flex flex-col items-center h-4/5">
                <h1 className="text-black text-3xl font-medium">Create Offer</h1>
                <p className="text-[#4D4D4D] text-lg mt-4 mb-14">Contingencies</p>

                <section className="grid grid-cols-4 w-full gap-x-6 gap-y-20 mb-16">
                  {[
                    { label: 'Finance Contingency', key: 'financeContingency' },
                    { label: 'Appraisal Contingency', key: 'appraisalContingency' },
                    { label: 'Inspection Contingency', key: 'inspectionContingency' },
                    { label: 'Close Escrow', key: 'closeEscrow' },
                  ].map(({ label, key }) => {
                    const value = offerForm[key];
                    const daysKey = `${key}Days`;
                    const selectedDays = offerForm[daysKey];

                    return (
                      <section key={key}>
                        <p className="text-base font-medium text-black mb-4">{label}</p>
                        <section className="flex items-center gap-2">
                          <Dropdown
                            options={[
                              { label: 'Yes', value: 'yes' },
                              { label: 'No', value: 'no' },
                            ]}
                            inputClassName="h-14 w-40 border border-[#FF8700] text-black bg-white rounded-md focus:border-[#FF8700]"
                            onSelect={(selectedValue) => {
                              setOfferForm((prev) => ({
                                ...prev,
                                [key]: selectedValue,
                                [daysKey]: '',
                              }));
                            }}
                            value={value ?? null}
                          />

                          {value === 'yes' && (
                            <div className="flex  gap-1">
                              <select
                                className="h-14 w-24 border border-[#FF8700] rounded-md px-2 text-black focus:outline-none focus:border-[#FF8700]"
                                value={selectedDays ?? ''}
                                onChange={(e) => {
                                  const selected = Number(e.target.value);
                                  setOfferForm((prev) => ({
                                    ...prev,
                                    [daysKey]: selected,
                                  }));
                                }}
                              >
                                <option value="">0</option>
                                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                                  <option key={day} value={day}>
                                    {day} day{day > 1 ? 's' : ''}
                                  </option>
                                ))}
                              </select>

                              {(!selectedDays || selectedDays === 0) && (
                                <div className="relative group">
                                  <button type="button" className="text-[#FF8700] hover:text-orange-600">
                                    <Info className="w-3 h-3" />
                                  </button>
                                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                    Please add number of days
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </section>
                      </section>
                    );
                  })}

                </section>

                <BorderedTextArea
                  label="Special Terms"
                  labelClassName="text-base font-medium text-black mb-4"
                  placeholder="Add a note"
                  type="text"
                  className="h-full"
                  inputClassName="border border-solid border-[#D5D9DC] focus:border-[#FF8700] disabled:border-0 disabled:bg-[#ACACAC] rounded-md px-4 w-full h-full bg-white"
                  onChange={(e) =>
                    setOfferForm((prev) => ({ ...prev, specialTerms: e.target.value }))
                  }
                  value={offerForm.specialTerms || ''}
                />
              </div>
            </div>

            <div className="flex items-center justify-between w-full px-12">
              <section className="flex items-center w-1/2">
                <RoundedButton
                  label="Back"
                  onClick={() => {
                    setFormErrors({});
                    setPageCount(1)
                  }}
                  variant="primary"
                  className="w-[30%] py-3 bg-transparent border border-solid border-black"
                />
                <RoundedButton
                  label="Discard & Exit"
                  onClick={() => router.back()}
                  variant="primary"
                  className="w-[30%] py-3 bg-transparent text-[#E8804C]"
                />
              </section>

              <RoundedButton
                label="Save & Continue"
                onClick={() => {
                  console.log("Offer data : ", offerForm);
                  const contingencies = ['financeContingency', 'appraisalContingency', 'inspectionContingency', 'closeEscrow'];

                  for (let key of contingencies) {
                    const field = offerForm[key];

                    if (!field || field?.trim() === '') {
                      error({ message: `${key.replace(/([A-Z])/g, ' $1')} is required` });
                      return;
                    }
                  }

                  setFormErrors({});
                  setPageCount(3);
                }}

                variant="primary"
                className="w-[15%] py-3 bg-black border border-solid border-black text-white"
              />

            </div>
          </section>
        )}


        {/* 3RD ONE */}
        {pageCount === 3 && (
          <section className="flex flex-col items-center gap-x-5 py-8 justify-between h-4/5 w-full">
            <div className="w-4/5 flex flex-col items-center h-4/5">
              <div className="w-full flex flex-col items-center h-4/5">
                <h1 className="text-black text-3xl font-medium">Create Offer</h1>
                <p className="text-[#4D4D4D] text-lg mt-4 mb-6">Documents</p>

                {uploading ? (
                  <div className="w-full flex items-center justify-center py-10">
                    <span className="text-[#FF8700] font-medium animate-pulse">Uploading...</span>
                  </div>
                ) : (
                  <CustomFileInputBuyer handleFile={(file) => handleFileChange(file?.[0])} />
                )}
                {/* <p className='text-sm uppercase font-bold mt-4 opacity-50'>Or Select from Folders </p>
                <div className='button-group gap-2 flex w-4/5 mt-4'>
                  {repos.map((repo, index) => (
                    <button
                      key={index}
                      onClick={() => handleButtonClick(repo)}
                      className={`flex  w-full items-center gap-2 p-6   rounded-lg hover:bg-grey-190  ${activeTab === index ? 'bg-orange-200 text-orange-500' : 'bg-[#F7F2EB]'}`}
                    >
                      <Image
                        alt={'folder'}
                        src={FolderIcon}
                        width={28}
                        height={28}
                        className='object-contain object-center'
                      />
                      <div className='flex flex-col items-start '>
                        <p className="text-md font-bold uppercase">{repo.label}</p>
                        <p className="text-xs opacity-50 ">{repo.subTitle}</p>
                      </div>

                    </button>
                  ))}
                </div> */}

                <section className="grid grid-cols-2 mt-6 gap-7 w-full">
                  {binaryFile.map((type, i) => (
                    <CardItem
                      key={i}
                      name={type?.name}
                      propertyId={propertyData?.engagedProperty?.engagement?.propertyId}
                      title={type?.name}
                      fileUrl={type?.value}
                      preUploadFileChange={preUploadFileChange}
                      updatedDate="Updated Dec 18, 2023 03:02 PM"
                    />
                  ))}
                </section>
                {modalOpened &&
                  <Modal
                    isOpen={modalOpened}
                    closeModal={() => setModalOpened(false)} // Close modal on backdrop click
                    className="w-[90%]"
                    useChildStyle={false}
                  >
                    <div className="space-y-4 p-12 ">
                      <div className="grid grid-cols-3 gap-4">
                        {/* Loop through docs and display each file as a folder card */}
                        {docs?.[0]?.uploadedFiles?.map((props: any, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectFile(props)}
                            className="cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg hover:border-[#FF8700] border-[#707070] bg-[#F3F3F3] p-4 rounded-md"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <RectIcon />
                              <p className="mt-2 text-center font-medium">{props?.fileName}</p>
                              <p className="text-xs text-center text-gray-500 mt-2">
                                {new Date(props?.uploadedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions Section */}
                      <div className="flex justify-between mt-8">
                        <button
                          onClick={() => setModalOpened(false)}
                          className="w-1/3 py-3 bg-transparent text-[#FF8700] border border-[#FF8700] rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSelectFile}
                          className="w-1/3 py-3 bg-[#FF8700] text-white rounded-md"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </Modal>}


              </div>
            </div>

            <div className="flex items-center justify-between w-full px-12">
              <section className="flex items-center w-1/2">
                <RoundedButton
                  label="Back"
                  onClick={() => setPageCount(2)}
                  variant="primary"
                  className="w-[30%] py-3 bg-transparent border border-solid border-black"
                />
                <RoundedButton
                  label="Discard & Exit"
                  onClick={() => router.back()}
                  variant="primary"
                  className="w-[30%] py-3 bg-transparent text-[#E8804C]"
                />
              </section>
              <RoundedButton
                label={uploading ? "Uploading..." : "Save & Continue"}
                onClick={async () => {

                  if (uploading) return;
                  if (!selectedFile) {
                    error({ message: 'Please upload at least one document before continuing.' });
                    return;
                  }
                  await handleFileUpload(selectedFile)
                  setPageCount(4);
                }}
                disabled={uploading}
                variant="primary"
                className="w-[15%] py-3 bg-black border border-solid border-black text-white disabled:opacity-60"
              />


            </div>
          </section>
        )}

        {pageCount === 4 && (
          <section className="flex flex-col items-center gap-x-5 py-8 justify-between h-4/5 w-full">
            <div className="w-4/5 flex flex-col items-center h-4/5">
              <div className="w-full flex flex-col items-center justify-center h-4/5">
                <h1 className="text-black text-3xl font-medium">Create Offer</h1>
                <p className="text-[#4D4D4D] text-lg mt-4 mb-14">Message to Buyer</p>

                <BorderedTextArea
                  placeholder="Add a note"
                  type="text"
                  className="h-full flex items-center justify-center"
                  inputClassName="border border-solid border-[#D5D9DC] focus:border-[#FF8700] disabled:border-0 disabled:bg-[#ACACAC] rounded-md px-4 w-4/5 h-full"
                  onChange={(e) =>
                    setOfferForm((prev) => ({
                      ...prev,
                      messageToAgent: e.target.value,
                    }))
                  }
                  value={offerForm.messageToAgent || ''}
                />
              </div>
            </div>

            <div className="flex items-center justify-between w-full px-12">
              <section className="flex items-center w-1/2">
                <RoundedButton
                  label="Back"
                  onClick={() => setPageCount(3)}
                  variant="primary"
                  className="w-[30%] py-3 bg-transparent border border-solid border-black"
                />
                <RoundedButton
                  label="Discard & Exit"
                  onClick={() => router.back()}
                  variant="primary"
                  className="w-[30%] py-3 bg-transparent text-[#E8804C]"
                />
              </section>
              <RoundedButton
                label="Save & Continue"
                onClick={() => {
                  if (!offerForm.messageToAgent || offerForm.messageToAgent.trim() === '') {
                    error({ message: 'Please enter a message to the agent before continuing.' });
                    return;
                  }
                  hnadleSubmit()
                }}
                variant="primary"
                className="w-[15%] py-3 bg-black border border-solid border-black text-white"
              />

            </div>
          </section>
        )}



      </section>
    </>
  )
}

export default PropertyInformation
