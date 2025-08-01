import React from "react";

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  generateAgreement: () => void;
  loading: boolean;
}

const AgreementModal: React.FC<AgreementModalProps> = ({ isOpen, onClose, generateAgreement, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg text-center relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-bold">California Association of REALTORS®</h2>
        <p className="text-orange-500">Acronym: CAR &nbsp; Version: 1324.0</p>

        {/* Dropdowns */}
        <div className="mt-4 space-y-4">
          <select className="w-full p-3 border rounded-md bg-gray-100">
            <option>Purchases</option>
          </select>
          <select className="w-full p-3 border rounded-md bg-gray-100">
            <option>Buyer Representation Agreement</option>
          </select>
        </div>

        {/* Button */}
        <button className="mt-4 bg-black text-white px-6 py-2 rounded-md"
          onClick={generateAgreement}
          disabled={loading}
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default AgreementModal;
