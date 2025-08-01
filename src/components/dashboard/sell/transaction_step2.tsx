import React, { useState } from 'react'
import { X } from 'lucide-react'

type Props = {
  onClose: () => void;
  status: string;
  transactionType: string;
  setStatus?: (str: string) => void;
  setTransactionType?: (str: string) => void;
  handleCreateTransaction: () => void
}

const UpdateStatusModal: React.FC<Props> = (props) => {
  const {
    onClose,
    status,
    transactionType,
    setStatus,
    setTransactionType,
    handleCreateTransaction
  } = props;
  // const [status, setStatus] = useState('Active')
  // const [transactionType, setTransactionType] = useState('Purchases')

  const statusOptions = ['Active', 'Pending', 'Prospect', 'Inactive', 'Fell Through']

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-lg px-8 py-10">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Property Info */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-[#222]">60 Portersville Rd Atoka,</h2>
          <p className="text-[#9B9B9B] text-sm mt-1">Portersville Rd Atoka,<br />Folsom, CA 38004</p>
        </div>

        {/* Dropdown */}
        <div className="mb-6">
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="Purchases">Purchases</option>
            <option value="Leases">Leases</option>
          </select>
        </div>

        {/* Status Options */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {statusOptions.map((option) => (
            <label
              key={option}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition 
                  ${status === option
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 hover:bg-gray-200"
                }`}
              onClick={() => setStatus(option)}
            >
              <input
                type="radio"
                name="status"
                value={option}
                checked={status === option}
                onChange={() => setStatus(option)}
                className="hidden"
              />
              {option}
            </label>
          ))}
        </div>


        {/* Save Button */}
        <div className="text-center w-xl">
          <button
            onClick={() => {
              handleCreateTransaction()
            }}
            className="bg-black text-white w-xl px-6 py-2 rounded-full hover:bg-gray-800 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateStatusModal
