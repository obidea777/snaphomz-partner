import ProfileCircle from 'components/common/ProfileCircle'
import React, { ReactElement } from 'react'
import { cn } from 'utils/styleUtilities'

type UserCardProps = {
  name: string
  role: string
  profileImage?: string
  profilePlaceholder?: string
  className?: string
  profileClassName?: string
  rightComponent?: ReactElement
}

const UserInfoDealCard: React.FC<UserCardProps> = ({
  name,
  role,
  profileImage,
  profilePlaceholder = 'js',
  className,
  profileClassName,
  rightComponent
}) => {
  return (
    <section
      className={cn(
        'border-[0.5px] border-solid border-[#AAAAAA] bg-transparent rounded-xl flex items-center justify-between w-full px-4 py-3 flex-wrap',
        className
      )}>
      <section className="flex items-center gap-4 justify-center">
        <ProfileCircle
          className={cn('h-12 w-12 text-sm mb-0', profileClassName)}
          image={profileImage}
          placeholder={profilePlaceholder}
        />
        <section>
          <h2 className="font-bold text-black text-md">{name}</h2>
          <p className="text-md text-[#E8804C] font-medium">{role}</p>
        </section>
      </section>
      {rightComponent}
    </section>
  )
}

export { UserInfoDealCard }
