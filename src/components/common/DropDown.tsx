import { useState, useEffect } from 'react'
import { cn } from 'utils/styleUtilities'

interface Option {
  label: string
  value: string | number
}

interface DropdownProps {
  label?: string
  options: Option[]
  labelClassName?: string
  inputClassName?: string
  placeholder?: string
  onSelect: (value: string | number) => void
  error?: string
  defaultValue?: string | number
  value: any
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  label,
  labelClassName,
  inputClassName,
  error,
  defaultValue,
  placeholder = 'Select an option',
  onSelect,
  value
}) => {
  const [selectedOption, setSelectedOption] = useState<
    string | number | undefined
  >(defaultValue)

  useEffect(() => {
    if (defaultValue !== undefined) {
      const defaultOption = options.find(
        (option) => option.value === defaultValue
      )
      if (defaultOption) {
        setSelectedOption(defaultOption.value)
      }
    }
  }, [defaultValue, options])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value
    setSelectedOption(selectedValue)
    onSelect(selectedValue)
  }

  return (
    <div className="relative inline-block text-left w-full">
      {label && (
        <label
          className={cn(
            'mb-2 block text-sm font-medium text-[#FF8700]',
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <select
        value={selectedOption || ''}
        onChange={handleChange}
        className={cn(
          'w-full border border-[#FF8700] rounded-md bg-white text-sm font-medium text-[#0B1D2E] font-satoshi h-full peer outline-none transition-all focus:border-[#FF8700] focus:ring-1 focus:ring-[#FF8700] disabled:border-0 disabled:bg-[#ACACAC] p-4 capitalize',
          inputClassName
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value}
            className="text-black capitalize"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-red-600 my-1">{error}</p> : null}
    </div>
  )
}

export default Dropdown
