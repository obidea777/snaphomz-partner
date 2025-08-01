import React from 'react'
import Image from 'next/image'
import { cn } from 'utils/styleUtilities'

type ProfileCircleProps = {
  image?: string
  placeholder?: string
  className?: string
}

const ProfileCircle: React.FC<ProfileCircleProps> = ({
  image,
  placeholder = 'cs',
  className
}) => {
  return (
    <section
      className={cn(
        'rounded-full h-14 w-14 items-center justify-center flex overflow-hidden relative mb-6 bg-black  text-lg text-white font-medium uppercase',
        className
      )}>
      {image ? (
        <Image src={image} alt="Profile" fill className="object-contain" />
      ) : (
        <p>{placeholder}</p>
      )}
    </section>
  )
}

export default ProfileCircle
