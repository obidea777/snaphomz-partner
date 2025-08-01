import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from 'utils/styleUtilities'

interface AccordionProps {
  title: string
  content: React.ReactNode
  className?: string
  titleClassName?: string
  contentClassName?: string
  isOpenByDefault?: boolean
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  content,
  className = '',
  titleClassName = '',
  contentClassName = '',
  isOpenByDefault = false
}) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault)

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`relative mb-3 ${className}`}>
      <h6 className="mb-0">
        <button
          id="accordion-collapse"
          onClick={toggleAccordion}
          className={cn(
            `relative flex items-center w-full p-4 font-bold text-left transition-all ease-in border-y border-solid border-[#F0F0F0] cursor-pointer text-black rounded-t-1 group bg-[#F0F0F0] ${titleClassName}`
          )}>
          <span>{title}</span>
          <i
            className={`absolute right-10 rotate-180 pt-1 transition duration-300 ease-in-out ${!isOpen ? 'rotate-180' : 'rotate-0'}`}>
            <Image
              src="/assets/images/icons/caretUp.svg"
              alt="caret"
              height={12}
              width={18}
            />
          </i>
        </button>
      </h6>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div
          className={cn(
            `p-4 text-sm leading-normal text-blue-gray-500/80 transition delay-700 duration-300 ease-in-out ${contentClassName}`
          )}>
          {content}
        </div>
      </div>
    </div>
  )
}

export { Accordion }
