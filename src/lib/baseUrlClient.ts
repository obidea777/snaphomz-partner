import Router from 'next/router'

// import { LogoutAction } from './api/auth'
import { clearItem, deleteStorageCookie, getAuthToken } from './storage'
import { showToast } from 'utils/toastHelper'
import { AUTH_TOKEN, BASE_URL, FIT_FOR_PURPOSE } from 'shared/constants/env'

const LogoutAction = async () => {
  //   const response = (await client.get('api/auth/logout')).data

  //   toast.success(response?.message)

  setTimeout(() => {
    deleteStorageCookie({ key: FIT_FOR_PURPOSE })
    window.location.href = '/'
  }, 400)

  return
}

type CustomHeaders = Record<string, string>

interface FetchConfig {
  headers?: CustomHeaders
  onSuccess?: (body: any) => any
  onResponse?: (response: Response) => any
  onError?: (body: any, status: number) => any
  params?: Record<string, string | number>
  [key: string]: any
}

class AuthModule {
  getAuthToken() {
    return getAuthToken()
  }
}

const authModule = new AuthModule()

class FetchClient {
  private readonly baseUrl: string
  private readonly defaultHeaders: CustomHeaders

  constructor(baseUrl: string, defaultHeaders: CustomHeaders) {
    this.baseUrl = baseUrl
    this.defaultHeaders = defaultHeaders
  }

  private async handleResponse(
    response: Response,
    config: FetchConfig
  ): Promise<any> {
    const { onSuccess, onResponse, onError } = config

    // Check if the response status code is in the list of status codes
    const logoutStatusCodes = [401, 307, 403]
    if (logoutStatusCodes.includes(response.status)) {
      await LogoutAction() // Call the logout function

      // Clear the expired token and reject the promise
      deleteStorageCookie({ key: AUTH_TOKEN })
      clearItem()
      showToast('error', 'Login session expired, please login again')
      void Router.replace('/')
    }

    if (onResponse != null) {
      return onResponse(response)
    }

    const body = await response.json()
    if (response.ok) {
      if (response.status === 200 || response.status === 201) {
        return onSuccess != null ? onSuccess({ data: body }) : { data: body }
      } else if (response.status === 204) {
        return onSuccess != null ? onSuccess([]) : null
      }
    }

    const _error = { data: body }

    return await new Promise((resolve, reject) => {
      if (onError != null) {
        resolve(onError(_error, response.status))
      } else {
        const errorMessage = body?.message

        showToast('error', typeof errorMessage === 'string' ? errorMessage : '')

        reject(_error)
      }
    })
  }

  private prepareRequestConfig(config: FetchConfig): RequestInit {
    const { headers, ...userConfig } = config

    const defaultHeaders: CustomHeaders = {
      ...this.defaultHeaders,
      Accept: 'application/json',

      ...headers
    }

    const token = authModule.getAuthToken()
    if (token !== undefined || token !== null) {
      defaultHeaders.Authorization = `Bearer ${token as string}`
    }

    return {
      mode: 'cors',
      headers: { ...defaultHeaders },
      ...userConfig
    }
  }

  async request(url: string, config: FetchConfig = {}): Promise<any> {
    const requestUrl = `${this.baseUrl}/${url}`

    const requestConfig = this.prepareRequestConfig(config)

    const response = await fetch(requestUrl, requestConfig)
    return await this.handleResponse(response, config)
  }

  async get(url: string, config: FetchConfig = {}): Promise<any> {
    const { params, ...otherConfig } = config

    if (typeof params === 'object') {
      // Convert params to a URLSearchParams instance
      const queryParams = new URLSearchParams(params as any)

      // Append the query parameters to the URL
      url = `${url}?${queryParams.toString()}`
    }

    return await this.request(url, { ...otherConfig, method: 'GET' })
  }

  async post(url: string, config: FetchConfig = {}): Promise<any> {
    return await this.request(url, { ...config, method: 'POST' })
  }

  async put(url: string, config: FetchConfig = {}): Promise<any> {
    return await this.request(url, { ...config, method: 'PUT' })
  }

  async patch(url: string, config: FetchConfig = {}): Promise<any> {
    return await this.request(url, { ...config, method: 'PATCH' })
  }

  async delete(url: string, config: FetchConfig = {}): Promise<any> {
    return await this.request(url, { ...config, method: 'DELETE' })
  }
}

const defaultHeaders = {
  'Content-Type': 'application/json'
}

const Client = new FetchClient(BASE_URL as string, defaultHeaders)
const AIClient = new FetchClient(
  'https://dev.ai.api.ocreal.online' as string,
  defaultHeaders
)

export { Client, AIClient }
