import ProfileCircle from 'components/common/ProfileCircle'
import React from 'react'
import { cn } from 'utils/styleUtilities'

interface ContactCardProps {
  name: string
  email: string
  phone: string
  license: string
  profilePlaceholder: string
  profileClassName?: string
  nameClassName?: string
  emailClassName?: string
  phoneClassName?: string
  licenseClassName?: string
  containerClassName?: string
  detailsContainerClassName?: string
}

const ContactCard: React.FC<ContactCardProps> = ({
  name,
  email,
  phone,
  license,
  profilePlaceholder,
  profileClassName,
  nameClassName,
  emailClassName,
  phoneClassName,
  licenseClassName,
  containerClassName,
  detailsContainerClassName
}) => {
  return (
    <section className={cn('flex items-start gap-4', containerClassName)}>
      <ProfileCircle
        placeholder={profilePlaceholder}
        className={cn('h-10 w-10 text-xs', profileClassName)}
      />
      <section className={cn('flex flex-col gap-1', detailsContainerClassName)}>
        <p className={cn('font-bold text-lg', nameClassName)}>{name}</p>
        <p className={cn('font-medium text-sm', emailClassName)}>{email}</p>
        <p className={cn('font-medium text-sm', phoneClassName)}>{phone}</p>
        <p
          className={cn(
            'font-medium text-sm text-[#808080]',
            licenseClassName
          )}>
          {license}
        </p>
      </section>
    </section>
  )
}

export default ContactCard
