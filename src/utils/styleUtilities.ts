import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) {
    return ''
  }
}
