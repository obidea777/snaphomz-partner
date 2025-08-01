import CustomAvatar from 'components/ui/avatar'
import { cn, getInitials } from 'utils/styleUtilities'

interface ChatItemProps {
  main?: boolean
  handleClick?: () => void
  firstname: string
  lastname: string
  propertiesCount: number
  email: string
}

const ChatItem: React.FC<ChatItemProps> = ({
  firstname,
  lastname,
  email,
  propertiesCount,
  main = true,
  handleClick
}) => {
  return (
    <div
      onClick={handleClick}
      className={cn('flex items-center gap-x-4', main ? 'cursor-pointer' : '')}>
      <div className="relative h-[50px] w-[50px]">
        <CustomAvatar
          className="h-[7rem] w-[7rem] text-base text-white"
          alt="avatar-image"
          size={'3rem'}>
          {getInitials(firstname, lastname) || 'SH'}
        </CustomAvatar>
      </div>
      <div>
        <p className="font-bold">
          {firstname} {lastname}
        </p>
        <p className="text-sm">{email}</p>
        <span className="text-sm font-[400] text-grey-750">
          Engaged in - {propertiesCount} properties
        </span>
      </div>
    </div>
  )
}

export default ChatItem
