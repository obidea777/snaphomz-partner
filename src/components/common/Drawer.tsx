import React, { ReactNode } from 'react'

type IDrawerProps = {
  children: ReactNode
  bottom?: ReactNode
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  buyerName: string
}

const Drawer: React.FC<IDrawerProps> = ({
  children,
  isOpen,
  setIsOpen,
  bottom,
  buyerName
}) => {
  if (!isOpen) return

  return (
    <div
      className={`fixed top-0 bottom-0 right-0 left-0 z-10 overflow-hidden bg-gray-900 bg-opacity-25 transform ${
        isOpen
          ? 'transition-opacity duration-500 opacity-100'
          : 'transition-all delay-500 opacity-0'
      }`}
      role="dialog">
      <div
        className={`fixed z-50 right-0 top-0 w-screen max-w-lg h-full bg-white shadow-xl transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="document">
        <div className="relative flex flex-col h-full overflow-y-auto">
          <div className="flex-1 space-y-6 bg-[#FAF8F5] relative pb-48">
            {children}
          </div>
        </div>
        <header className="flex items-center justify-between p-4 border-b absolute top-0 right-0 left-0 h-16 bg-white z-20">
          <h2 className="text-lg font-bold">{buyerName}</h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close drawer"
            className="text-gray-600 hover:text-gray-900">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </header>
        {bottom}
      </div>
      <div
        className="fixed inset-0 w-screen h-full z-10 cursor-pointer mt-20"
        onClick={() => setIsOpen(false)}></div>
    </div>
  )
}

export { Drawer }
