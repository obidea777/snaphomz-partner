'use client'

import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import DOMPurify from 'dompurify'
import { AUTH_TOKEN, SECURE_LOGIN_KEY } from 'shared/constants/env'

export const isLocal = process.env.NODE_ENV === 'development'

export const deploymentEnv = process.env.NEXT_PUBLIC_ENVIROMENT_URL

interface StorageProps {
  key: string
  value?: string | unknown
}

export const storeCookie = ({ key, value }: StorageProps): void => {
  const date = new Date()
  const expireTime = new Date(date.getTime() + 7 * 60 * 60 * 1000)
  const maxAge = 7 * 60 * 60

  if (key !== '' && value !== '') {
    setCookie(key, DOMPurify.sanitize(JSON.stringify(value)), {
      expires: expireTime,
      maxAge,
      domain: isLocal ? '' : deploymentEnv,
      path: '/',
      sameSite: 'strict'
    })
  }
}

export const getAuthToken = (): string | undefined => {
  const authToken = getCookie(AUTH_TOKEN, {
    domain: isLocal ? '' : deploymentEnv,
    path: '/',
    sameSite: 'strict'
  })
  return typeof authToken === 'string'
    ? JSON.parse(DOMPurify.sanitize(authToken))
    : undefined
}



export const getUserDetail = (): string | undefined => {
  const user = getCookie(SECURE_LOGIN_KEY, {
    domain: isLocal ? '' : deploymentEnv,
    path: '/',
    sameSite: 'strict'
  })
  return JSON.parse(DOMPurify.sanitize(user))
}

export const getStoredCookie = (key: string): string | undefined => {
  const cookie = getCookie(key, {
    domain: isLocal ? '' : deploymentEnv,
    path: '/',
    sameSite: 'strict'
  })

  return typeof cookie === 'string'
    ? JSON.parse(DOMPurify.sanitize(cookie))
    : undefined
}

export const deleteStorageCookie = ({ key }: StorageProps): void => {
  deleteCookie(key, {
    domain: isLocal ? '' : deploymentEnv,
    path: '/',
    sameSite: 'strict'
  })
}

export const setLocalItem = ({ key, value }: StorageProps) => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.setItem(
      key,
      DOMPurify.sanitize(JSON.stringify(value))
    )
  }
}
export const getLocalItem = <T>({ key }: StorageProps): T | null => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const item = window.sessionStorage.getItem(key)
    if (item !== null) {
      try {
        return JSON.parse(DOMPurify.sanitize(item))
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Error parsing local storage item: `, err)
      }
    }
  }
  return null
}

type NodeEnvironment = 'dev' | 'prod'

export const returnCurrentUrl = (): NodeEnvironment => {
  if (typeof window !== 'undefined' && window.location.href) {
    // console.log(window.location.href);
    const currentUrl = window.location.href
    if (currentUrl.includes('localhost')) {
      return 'dev'
    } else if (currentUrl.includes('prod')) {
      return 'prod'
    }
  }
  return 'dev'
}

export const removeLocalItem = ({ key }: StorageProps): void => {
  sessionStorage.removeItem(key)
}
export const clearItem = (): void => {
  sessionStorage.clear()
}
