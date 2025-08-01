import React from 'react';

interface CustomModalProps {
  opened: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ opened, onClose, children }) => {
  return (
    <div
      className={`fixed  z-[1000] inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${
        opened ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className="bg-white px-8 p-6 rounded-2xl shadow-lg w-[70%]"
        onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking inside
      >
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
