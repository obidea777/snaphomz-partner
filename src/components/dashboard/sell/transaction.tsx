import React from 'react'
import { X } from 'lucide-react'

type Props = {
  onClose: () => void;
  setIsOpen: (str: string) => void;
  handleSelect:(str:string)=> void;
  propertyType: string;
}

const CreateTransactionModal: React.FC<Props> = ({ onClose, setIsOpen, handleSelect, propertyType }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center p-4">
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-lg px-6 py-8">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#333]">Create Transaction</h2>
          <p className="text-[#F27C38] mt-2">Manage your Zipforms in this property</p>
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4">
          <div
            className={`flex flex-col items-center border p-6 rounded-md cursor-pointer hover:shadow transition ${propertyType === "purchase" ? "border-blue-500 bg-blue-100" : ""
              }`}
            onClick={() => handleSelect("purchase")}
          >
            <img
              src="/assets/images/icons/transaction-03.svg"
              alt="New Purchase"
              className="h-10 w-10"
            />
            <span className="mt-2 font-medium">New Purchase</span>
          </div>

          <div
            className={`flex flex-col items-center border p-6 rounded-md cursor-pointer hover:shadow transition ${propertyType === "esign" ? "border-blue-500 bg-blue-100" : ""
              }`}
            onClick={() => handleSelect("esign")}
          >
            <img
              src="/assets/images/icons/transaction-04.svg"
              alt="Quick eSign"
              className="h-10 w-10"
            />
            <span className="mt-2 font-medium">Quick eSign</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
            onClick={() => {
              setIsOpen("step2")
            }}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateTransactionModal
