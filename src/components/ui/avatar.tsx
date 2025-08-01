import React from 'react'
import Image from 'next/image'
import { cn } from 'utils/styleUtilities'

interface AvatarProps {
  alt?: string
  autoContrast?: boolean
  children?: React.ReactNode
  color?: string
  gradient?: string
  imageProps?: React.ComponentPropsWithoutRef<'img'>
  radius?: string | number
  size?: number | string
  src?: string | null
  className?: string
}

const CustomAvatar: React.FC<AvatarProps> = ({
  alt,
  children,
  color,
  gradient,
  imageProps,
  className,
  radius,
  size = 'md',
  src
}) => {
  const getSize = (size: number | string) => {
    if (typeof size === 'number') {
      return `${size}px`
    } else {
      return size
    }
  }

  const getBorderRadius = (radius: string | number) => {
    if (typeof radius === 'number') {
      return `${radius}px`
    } else {
      return radius
    }
  }

  return (
    <div
      style={{
        width: getSize(size),
        height: getSize(size),
        borderRadius: getBorderRadius(radius || '50%'),
        backgroundColor: color || 'gray',
        backgroundImage: gradient ? `linear-gradient(${gradient})` : 'none'
      }}
      className={cn('relative', className)}>
      {src ? (
        // <img src={src} alt={alt || ''} {...imageProps} />
        <Image
          src={src}
          alt={alt || ''}
          {...imageProps}
          width={100}
          height={100}
        />
      ) : (
        children && (
          <div className="absolute inset-0 flex items-center justify-center">
            {children}
          </div>
        )
      )}
    </div>
  )
}

export default CustomAvatar
