import React, { useState, useRef } from 'react'
import { cn } from 'utils/styleUtilities'

interface DatePickerProps {
  placeholder?: string
  label?: string
  labelClassName?: string
  inputClassName?: string
  className?: string
  onDateChange?: (date: string) => void // Add this line
}

const DatePicker: React.FC<DatePickerProps> = ({
  placeholder = 'Select date',
  label,
  labelClassName,
  inputClassName,
  className,
  onDateChange // Add this line
}) => {
  const [displayDate, setDisplayDate] = useState<string>('')
  const [isoDate, setIsoDate] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value)
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    const isoDateString = date.toISOString().split('T')[0] // Date part of ISO string
    setDisplayDate(formattedDate)
    setIsoDate(isoDateString)
    if (onDateChange) {
      onDateChange(isoDateString) // Call the callback with the ISO string
    }
  }

  const handleInputClick = () => {
    inputRef.current?.showPicker()
  }

  return (
    <section>
      {label ? (
        <label
          className={cn(
            '  mb-2 block text-sm font-normal text-[#848484]',
            labelClassName
          )}>
          {label}
        </label>
      ) : null}
      <div className={cn('relative max-w-sm', className)}>
        <input
          type="text"
          value={displayDate}
          readOnly
          onClick={handleInputClick}
          className={cn(
            'relative bg-[#F5F8FA] font-satoshi text-sm text-[#8E929C]  border border-[#707070] rounded-md  focus:border-[#FF8700]  block pl-3 p-2.5 appearance-none h-full w-full peer outline-none transition-all placeholder-shown:border-[#D5D9DC] focus:border-[#FF8700] disabled:border-0 disabled:bg-[#ACACAC]  cursor-pointer',
            inputClassName
          )}
          placeholder={placeholder}
        />
        <input
          type="date"
          ref={inputRef}
          onChange={handleDateChange}
          className={cn('absolute -top-1 hidden border', inputClassName)}
        />
      </div>
    </section>
  )
}

export default DatePicker
