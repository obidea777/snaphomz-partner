import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from 'utils/styleUtilities'
import PDFViewerModal from './pdfViewerModal'
import { useViewUploadedFileUrl } from 'lib/api/useRepoManagement'
import { downloadDocument, downloadDocumentPreSigned } from 'utils/downloadFunction'

type DocumentCardProps = {
  title: string
  updatedDate: string
  downloadIcon?: string
  documentIcon?: string
  moreOptionsIcon?: string
  copyOptionIcon?: string
  className?: string
  titleClassName?: string
  dateClassName?: string
  iconClassName?: string
  url?: string
  // downloadDocument?: () => void
  canDownLoad?: boolean
  moreOptions?: boolean
  copyOption?: boolean
  documentUrl?: string
  onClick?: () => void
  handleDocumentDelete?: () => void
  isOpen?: boolean
  setActiveDocument?: () => void
}

const DocCard: React.FC<DocumentCardProps> = ({
  title,
  updatedDate,
  downloadIcon = '/assets/images/icons/download.svg',
  documentIcon = '/assets/images/icons/documentIcon.svg',
  moreOptionsIcon = '/assets/images/icons/moreOptionsIcon.svg',
  copyOptionIcon = '/assets/images/icons/copy.svg',
  className,
  titleClassName,
  dateClassName,
  iconClassName,
  url,
  // downloadDocument,
  canDownLoad = true,
  moreOptions = true,
  copyOption = false,
  documentUrl,
  onClick,
  handleDocumentDelete,
  isOpen = false,
  setActiveDocument
}) => {
  const [isPdfViewerModalOpen, setIsPdfViewerModalOpen] = useState(false)
  const [PdfViewerUrl, setPdfViewerUrl] = useState(null)

  const { data: fileUrl, isLoading, error } = useViewUploadedFileUrl(url);

  const handleOpenPdfViewer = (url: string) => {
    setPdfViewerUrl(url)
    setIsPdfViewerModalOpen(true)
    setActiveDocument && setActiveDocument()
  }

  // useEffect(() => {
  // }, [PdfViewerUrl, isPdfViewerModalOpen])

  return (
    <>
      <section
        className={cn(
          'border-[0.5px] border-solid border-[#AAAAAA] rounded-md px-6 w-1/4 py-3 cursor-pointer',
          className
        )}
        onClick={onClick}>
        <section className="flex justify-end items-center gap-4">
          {canDownLoad ? (
            <section className="flex items-center justify-end mb-3">
              <Image
                onClick={() => { downloadDocumentPreSigned(fileUrl , title) }}
                src={downloadIcon}
                alt="download"
                height={16}
                width={16}
                className={iconClassName}
              />
            </section>
          ) : null}
          <section className="flex items-center justify-end mb-3">
            {copyOption ? (
              <Image
                src={copyOptionIcon}
                alt="copy"
                height={20}
                width={20}
                className={iconClassName}
              />
            ) : null}
          </section>
        </section>

        <Image
          src={documentIcon}
          alt="document"
          height={40}
          width={40}
          className={iconClassName}
        />
        <p className={cn('text-md font-bold my-2 h-12', titleClassName)}>
          {title}
        </p>
        <section className="flex items-end justify-between relative">
          <p
            className={cn('font-medium text-[#5A5A5A] text-sm', dateClassName)}>
            {updatedDate}
          </p>
          {moreOptions ? (
            <Image
              src={moreOptionsIcon}
              alt="more options"
              height={20}
              width={20}
              className={iconClassName}
              onClick={setActiveDocument}
            />
          ) : null}
          {isOpen && (
            <section className="bg-[#F5F8FA] absolute bottom-10 -right-5 w-20 rounded-md py-2 border-[0.1px] border-[#9B9B9B]">
              <div
                className="hover:bg-white w-full flex justify-center py-1"
                onClick={() => handleOpenPdfViewer(documentUrl)}>
                View
              </div>
              <div
                className="hover:bg-white w-full flex justify-center py-1"
                onClick={handleDocumentDelete}>
                Delete
              </div>
            </section>
          )}
        </section>
      </section>
      {isPdfViewerModalOpen && (
        <PDFViewerModal
          isOpen={isPdfViewerModalOpen}
          onClose={() => setIsPdfViewerModalOpen(false)}
          documentUrl={documentUrl}
        />
      )}
    </>
  )
}

export { DocCard }
