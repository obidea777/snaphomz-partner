import React from 'react'
import { cn } from 'utils/styleUtilities'

type MessageItemProps = {
  text: string
  time: string
  isFromLoggedInUser: boolean
  parentStyle?: string
  childStyle?: string
}

const MessageItem: React.FC<MessageItemProps> = ({
  text,
  time,
  isFromLoggedInUser,
  parentStyle,
  childStyle
}) => {
  return (
    <section
      className={cn(
        `px-3 flex flex-col mb-4 mt-14 ${isFromLoggedInUser ? 'items-end' : 'items-start'}`,
        parentStyle
      )}>
      <section
        className={cn(
          `bg-white rounded-md min-h-4 max-w-[85%] w-auto px-3 py-4 my-3 ${
            isFromLoggedInUser ? 'text-right' : 'text-left'
          }`,
          childStyle
        )}>
        <p className="text-base text-[#454545]">{text}</p>
      </section>
      <section className="w-full max-w-[85%] ">
        <p className="text-xs font-medium text-[#454545] text-right">{time}</p>
      </section>
    </section>
  )
}

export { MessageItem }
