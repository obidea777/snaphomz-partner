import React from 'react'
import { cn } from 'utils/styleUtilities'

type ITextInputProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  labelClassName?: string
  inputClassName?: string
  error?: string
}

const BorderedTextArea: React.FC<ITextInputProps> = ({
  className,
  label,
  labelClassName,
  inputClassName,
  error,
  ...props
}) => {
  return (
    <div className={cn('relative h-14 w-full', className)}>
      {label ? (
        <label
          className={cn(
            `mb-2 block text-sm font-normal text-[#848484]`,
            labelClassName
          )}>
          {label}
        </label>
      ) : null}
      <textarea
        {...props}
        className={cn(
          'peer h-full w-full border font-satoshi border-[#D5D9DC] bg-transparent text-sm font-normal text-[#0B1D2E] outline-none transition-all placeholder-shown:border-[#D5D9DC] focus:border-[#FF8700] disabled:border-0 disabled:bg-[#ACACAC] rounded-md px-4 py-2 appearance-none resize-none',
          inputClassName
        )}
      />
      {error ? <p className="text-xs text-red-600 my-1">{error}</p> : null}
    </div>
  )
}

export default BorderedTextArea
