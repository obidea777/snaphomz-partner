import React from 'react'
import { createPortal } from 'react-dom'
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className
}) => {
  if (!isOpen) return null
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
  }
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`bg-white p-4 rounded-lg relative ${className}`}>
        {title && (
          <div className="border-b pb-2 mb-2">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={handleClose}
              className="absolute top-[-0.8rem] right-2 text-gray-500 hover:text-gray-800 text-4xl"
              aria-label="Close">
              &times;
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  )
}
export default Modal
