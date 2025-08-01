import $http from 'axios'
import Router, { useRouter } from 'next/router'

import { clearItem, deleteStorageCookie, getAuthToken } from './storage'
import { showToast } from 'utils/toastHelper'
import { useAtom } from 'jotai'
import { AUTH_TOKEN, FIT_FOR_PURPOSE } from 'shared/constants/env'

const client = $http.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Set up response interceptor
client.interceptors.response.use(
  async (response) => await Promise.resolve(response),
  async (error) => {
    if (error.response) {
      const status = error.response.status

      if ([500, 501, 503].includes(status)) {
        showToast(
          'error',
          'Something went wrong processing your request, Refresh your window'
        )

        return await Promise.reject({
          status,
          message:
            'Something went wrong processing your request, Refresh your window and try again!'
        })
      }
      if ([401, 307, 403].includes(status)) {
        // Clear the expired token and reject the promise

        deleteStorageCookie({ key: AUTH_TOKEN })
        clearItem()
        showToast(
          'error',
          'Something went wrong processing your request, Refresh your window and try again!'
        )
        window.location.href = '/'
        return await Promise.reject({
          status,
          message: 'Login session expired, please login again'
        })
      }
    }

    return await Promise.reject(error)
  }
)

// Set up request interceptor
client.interceptors.request.use((config) => {
  const token = getAuthToken()
  const regex = /^\/(login)?$/
  if (!regex.test(config.url as string)) {
    // Set the authorization header
    config.headers.Authorization = `Bearer ${token as string}`
  }
  return config
})

export default client

// Get the authorization header
export const setAuthorization = () => ({
  Authorization: `Bearer ${getAuthToken() as string}`
})

type ResponseKeys = 'data' | 'message'
type ErrorKeys = 'message'

export const pickErrorKey =
  (key: ErrorKeys = 'message') =>
  async (error: {
    request: any
    response?: { data: Record<ErrorKeys, string> }
  }) => {
    if (error?.response?.data != null) {
      const { message: errorMessage } = error.response.data
      switch (key) {
        case 'message':
          return await Promise.reject(errorMessage ?? 'An error occurred.')
      }
    } else if (error.request) {
      throw new Error(`Unexpected request error`)
    } else {
      throw new Error(`Client error`)
    }
  }

export const pickResponseKey =
  (keys: ResponseKeys[] = ['data']) =>
  (response: { data: Record<ResponseKeys, any> }) => {
    const result: Record<string, any> = {}
    keys.forEach((key) => {
      result[key] = response.data?.[key] ?? response.data[key]
    })
    return result
  }

export const pickResult = pickResponseKey(['data', 'message'])
export const pickErrorMessage = pickErrorKey('message')
