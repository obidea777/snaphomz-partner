import axios from 'axios'
import { error, success } from 'components/alert/notify'
import { useAtom } from 'jotai'
import { atomWithMutation } from 'jotai-tanstack-query'
import { Client } from 'lib/baseUrlClient'
import { pickErrorMessage, pickResult } from 'lib/client'
import { generateSHAString } from 'lib/helpers/generateSHAString'
import { deleteStorageCookie, getStoredCookie, storeCookie } from 'lib/storage'
import { useRouter } from 'next/navigation'

import React, { useEffect } from 'react'
import {
  AGENTS_BACKEND_SERVICE,
  AGENT_BACKEND_SERVICE,
  AUTH_TOKEN,
  FIT_FOR_PURPOSE,
  MORTGAGE_FILE_UPLOAD,
  SECURE_LOGIN_KEY
} from 'shared/constants/env'
import { agentReadWriteAtom, initialState } from 'store/atoms/agent-atom'
import { showToast } from 'utils/toastHelper'

export type LoginFormValues = {
  email?: string
  password?: string
}

const loginAgent = atomWithMutation(() => ({
  mutationKey: ['login-mutation'],
  mutationFn: async (data: LoginFormValues) => {
    try {
      // return await Client.post(`auth/agent/login`, {
      //   body: convertedString
      // }).then(pickResult, pickErrorMessage)

      const prudding = generateSHAString(data.email)
      storeCookie({ key: SECURE_LOGIN_KEY, value: prudding })

      const response = await axios.post(AGENT_BACKEND_SERVICE, {
        query: `
     query {
            agentLogin(agentLoginDto: {
              email: "${data.email}",
              password: "${data.password}",
              userType: "partner",
            }) {
              id,
              firstName,
              lastName,
              email,
              profile
              accountType,
              access_token,
              status,
              messageUnreadCount,
              conversationUnreadCount
            }
          }
        `
      })
      console.log("Response : ",response?.data);
      
      if (response?.data?.errors){
        error({message:response?.data?.errors?.[0]?.message})
        throw response?.data?.errors
      }
      success({message:"You’ve successfully signed in"})
      return response.data
    } catch (error) {
      console.log(error)
      throw error // Rethrowing the error to handle it in the mutation
    }
  }
}))

export const uploadProfilePicture = async (
  file: File,
) => {
  try {

    if (!file) {
      throw new Error('File, userId, and propertyId are required.')
    }
    const formData = new FormData()
    formData.append('file', file)
    // Make API call to upload file
    const response = await axios.post(`${MORTGAGE_FILE_UPLOAD}/file-upload/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    // success({ message: "File Uploaded successfully" })
    return response.data
  } catch (error: any) {
    console.error('Error uploading file:', error.message)
    // Handle HTTP errors gracefully
    if (error.response) {
      console.error('Server responded with status:', error.response.status)
      console.error('Response data:', error.response.data)
    } else if (error.request) {
      console.error('No response received:', error.request)
    } else {
      console.error('Request setup error:', error.message)
    }
    console.log("Error : ", error);

    // throw new Error('File upload failed. Please try again.')
  }
}

export const useAuthApi = () => {
  const router = useRouter()
  const [{ mutate, status, data }] = useAtom(loginAgent)
  const [_, setAgentState] = useAtom(agentReadWriteAtom)

  const handleLogin = React.useCallback(async (data: LoginFormValues) => {
    mutate(data)
  }, [])

  useEffect(() => {
    if (status === 'success') {
      const newAgent = {
        is_authenticated: true,
        user: {
          ...data.data.agentLogin
        }
      }

      delete newAgent.user['access_token']
      delete newAgent.user['refresh_token']

      const secure = getStoredCookie(SECURE_LOGIN_KEY)

      console.log('CALLED-1')

      if (secure !== undefined) {

      console.log('CALLED-3')
        const secureLogin = generateSHAString(
          data.data.agentLogin?.email ?? 'secure@ocreal_agent'
        )

      console.log('CALLED-2')
        storeCookie({ key: SECURE_LOGIN_KEY, value: secureLogin })
        showToast('success', data.message, {
          className: 'bg-green-500'
        })
        storeCookie({
          key: AUTH_TOKEN,
          value: data?.data?.agentLogin?.access_token
        })

        console.log('CALLED-4')

        void setAgentState(newAgent)
        setTimeout(() => {
          router.push('/partner-dashboard');
        }, 100);  // Delay of 100ms, adjust as necessary
        
        window.location.href = '/partner-dashboard';  // Try using window.location.href

        console.log('CALLED-5')
      } else {
        console.log('it returned undefined')
      }
    }
  }, [status])

  const LogoutAction = async () => {
    //   const response = (await client.get('api/auth/logout')).data

    //   toast.success(response?.message)

    setTimeout(() => {
      void setAgentState(initialState)
      deleteStorageCookie({ key: FIT_FOR_PURPOSE })
      deleteStorageCookie({ key: AUTH_TOKEN })
      deleteStorageCookie({ key: SECURE_LOGIN_KEY })
      router.refresh()
      void router.replace('/')
    }, 400)

    return
  }

  return {
    status,
    handleLogin,
    data,
    LogoutAction
  }
}
