// @ts-nocheck

import { formatDate, isValid, parse } from 'date-fns'
import React, { useRef, useState } from 'react'
import {
  DayPicker,
  DayPickerProps,
  getDefaultClassNames
} from 'react-day-picker'
import 'react-day-picker/style.css'

import { cn } from 'utils/styleUtilities'

type CustomDatePickerProps = {
  onChange: any
  value: Date | undefined
  placeholder?: string
  label?: string
  labelClassName?: string
  inputClassName?: string
} & DayPickerProps

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onChange,
  value,
  placeholder = 'Select date',
  label,
  labelClassName,
  inputClassName,
  ...props
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState(
    value ? formatDate(value, 'MMMM dd, yyyy') : ''
  )
  const defaultClassNames = getDefaultClassNames()

  const toggleDialog = () => setIsDialogOpen((prev) => !prev)

  const handleDayPickerSelect = (date: any) => {
    if (!date) {
      setInputValue('')
      onChange(undefined)
    } else {
      onChange(formatDate(date, 'MM/dd/yyyy'))
      setInputValue(formatDate(date, 'MMMM dd, yyyy'))
    }

    toggleDialog()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value) // keep the input value in sync

    const parsedDate = parse(e.target.value, 'MM/dd/yyyy"', new Date())

    if (isValid(parsedDate)) {
      onChange(formatDate(parsedDate, 'MM/dd/yyyy'))
    } else {
      onChange(undefined)
    }
  }

  return (
    <section>
      {label && (
        <label
          className={cn(
            'mb-2 block text-sm font-normal text-[#848484]',
            labelClassName
          )}>
          {label}
        </label>
      )}
      <div className={cn('relative max-w-sm', inputClassName)}>
        <input
          onChange={handleInputChange}
          type="text"
          value={inputValue}
          readOnly
          onClick={toggleDialog}
          className={cn(
            'relative bg-[#F5F8FA] font-satoshi text-sm text-[#8E929C] border border-[#707070] rounded-md focus:border-[#707070] block pl-3 p-2.5 appearance-none h-full w-full peer outline-none transition-all placeholder-shown:border-[#D5D9DC] disabled:border-0 disabled:bg-[#ACACAC] cursor-pointer',
            inputClassName
          )}
          placeholder={placeholder}
        />
        {isDialogOpen && (
          <div ref={dialogRef}>
            <DayPicker
              autoFocus
              onSelect={handleDayPickerSelect}
              mode="single"
              selected={value}
              classNames={{
                today: 'border-black',
                selected: 'bg-black border-black text-white',
                root: `${defaultClassNames.root} shadow-lg p-5`,
                chevron: `${defaultClassNames.chevron} text-black fill-black`
              }}
              {...props}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export { CustomDatePicker }
