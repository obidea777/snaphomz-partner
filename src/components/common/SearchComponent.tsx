'use client'

import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  onSearch?: (value: string) => void

  onFocus?: () => void
  placeholder?: string
  autoFocus?: boolean
  styling?: React.CSSProperties
  className?: string
  inputSearchString?: string
  loading?: boolean
}

const SearchComponent: React.FC<Props> = ({
  onSearch,

  onSelect = (item) => {
    console.log(item)
  },
  onFocus = () => {
    console.log('Focused')
  },
  placeholder = 'Enter Your Address, MLS#',
  autoFocus = false,
  styling = {},
  className,
  inputSearchString,
  loading,
  ...rest
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    console.log({ value })
    onSearch(value)
  }

  const handleInputFocus = () => {
    onFocus()
  }

  return (
    <div className="relative w-3/5">
      <input
        className={`appearance-none text-sm border bg-transparent border-solid border-[#D5D9DC] rounded-md w-full text-gray-700 leading-tight h-[3.5rem] px-3.5 placeholder:text-[#acacac] placeholder:text-sm focus:outline-none focus:border-black ${className}`}
        style={{ ...styling }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        value={inputSearchString}
        {...rest}
      />
      {loading && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="animate-spin h-5 w-5 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="#E8804C"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="#E8804C"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      )}
    </div>
  )
}

export default SearchComponent
