import CustomAvatar from 'components/ui/avatar'
import { Building2, MapPin } from 'lucide-react'
import { cn, getInitials } from 'utils/styleUtilities'

interface ChatItemProps {
  main?: boolean
  handleClick?: () => void
  firstname: string
  lastname: string
  lastMessage: string
  propertyID: string
  PropertyImg?: string
  timestamp: string
}

const ChatThread: React.FC<ChatItemProps> = ({
  firstname,
  lastname,

  timestamp,
  propertyID,
  lastMessage,
  main = true,
  handleClick
}) => {
  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-start w-full gap-x-4',
        main ? 'cursor-pointer' : ''
      )}>
      <div className="relative h-[50px] w-[50px]">
        <CustomAvatar
          className="h-[6rem] w-[6rem] text-xl text-white"
          alt="avatar-image"
          size={'3rem'}>
          {getInitials(firstname, lastname) || 'SH'}
        </CustomAvatar>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className=" flex justify-between  items-center">
          <p className="font-bold text-[14px]">
            {firstname} {lastname}
          </p>
          <p className=" text-right text-[10px] text-gray-500">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <span className="text-xs font-medium opacity-60  font-[400] text-grey-750">
          {lastMessage ? lastMessage : 'Start New Chat'}
        </span>
        <div className=" flex gap-2 mt-2">
          <div className="flex  p-2 px-3  rounded-full items-center gap-2 bg-green-100">
            <Building2 size={12} className="text-green-800" />
            <span className="text-xs text-green-800 font-medium">
              Bakers Streets
            </span>
          </div>
          <div className=" opacity-50 border flex gap-2 bg-slate-100  p-2 px-3 rounded-full items-center">
            <MapPin size={12} />
            <span className="text-xs font-medium">California</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatThread
