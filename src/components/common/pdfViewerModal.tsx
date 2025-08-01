import React from 'react'
import Modal from './pdfModal'
interface PDFViewerModalProps {
  isOpen: boolean
  onClose: () => void
  documentUrl: string
}
const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  isOpen,
  onClose,
  documentUrl
}) => {
  const getViewerUrl = () => {
    const fileExtension = documentUrl.split('.').pop()?.toLowerCase()
    if (fileExtension === 'pdf' || fileExtension === 'txt') {
      return encodeURI(documentUrl) // Use encodeURI to ensure proper URL formatting
    } else if (fileExtension === 'doc' || fileExtension === 'docx') {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(documentUrl)}`
    }
    return null
  }
  const viewerUrl = getViewerUrl()
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Document Viewer"
      className="w-3/4">
      <div className="pdf-viewer-container h-[80vh] w-full">
        {viewerUrl ? (
          <iframe
            src={viewerUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        ) : (
          <p>Unsupported file format.</p>
        )}
      </div>
    </Modal>
  )
}
export default PDFViewerModal
