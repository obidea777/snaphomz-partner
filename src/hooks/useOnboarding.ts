import axios from 'axios'
import { error } from 'components/alert/notify'
import { useAtom } from 'jotai'
import { atomWithMutation } from 'jotai-tanstack-query'
import { Client } from 'lib/baseUrlClient'
import { pickErrorMessage, pickResult } from 'lib/client'
import { generateSHAString } from 'lib/helpers/generateSHAString'
import { getAuthToken, getStoredCookie, storeCookie } from 'lib/storage'
import {
  AGENTS_BACKEND_SERVICE,
  AGENT_BACKEND_SERVICE,
  AUTH_TOKEN,
  SECURE_LOGIN_KEY
} from 'shared/constants/env'
import { showToast } from 'utils/toastHelper'

// const sendVerificationEmail = async (body) => {
//   return await Client.post(`auth/agent/send-verification`, {
//     body: JSON.stringify(body)
//   }).then(pickResult, pickErrorMessage)
// }

const sendVerificationEmail = async (data) => {
  try {
    console.log("DAta : ",data);
    const accountType = "partner";
    const response = await axios.post(AGENTS_BACKEND_SERVICE, {
      query: `mutation { sendVerification(sendVerificationInput: { accountType: ${accountType?.toUpperCase()}, email: "${data.email}" }) }`,
    })
    // Check for errors in the GraphQL response
    if (response?.data?.errors?.length) {
      throw new Error(
        response.data.errors[0]?.message || 'Unknown error occurred'
      )
    }
    return response.data
  } catch (error) {
    // Normalize the error to ensure it can be handled consistently
    
    throw (
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'Request failed'
    )
  }
}

const postSendVerificationEmail = atomWithMutation(() => ({
  mutationKey: ['posts'],
  mutationFn: sendVerificationEmail,
  onSuccess(data: any) {
    showToast('success', data?.data?.sendVerification)
  },
  onError(err: any) {
    error({message:err} ) // Display the error message in the toast
  }
}))

export const useSendVerificationEmail = () => {
  const [{ mutate: mutateSendVerificationEmail, status, data, error }] =
    useAtom(postSendVerificationEmail)

  return [{ mutateSendVerificationEmail, status, data, error }]
}

const resendVerificationEmail = async (body) => {
  return await Client.post(`auth/user/resend/code`, {
    body: JSON.stringify(body)
  }).then(pickResult, pickErrorMessage)
}

const postresendVerificationEmail = atomWithMutation(() => ({
  mutationKey: ['posts'],
  mutationFn: resendVerificationEmail,
  onSuccess(data) {
    showToast('success', data.message)
  },
  onError(error: any) {
    console.log(error)
    showToast('error', error?.message)
  }
}))

export const useResendVerificationEmail = () => {
  const [{ mutate: mutateResendVerificationEmail, status, data }] = useAtom(
    postresendVerificationEmail
  )

  return [{ mutateResendVerificationEmail }]
}

const verifyAgentCode = async (data) => {
  const response = await axios.post(AGENTS_BACKEND_SERVICE, {
    query: `mutation {
      verifyOtp(verifyOtpInput: {
        otp: "${data?.code}"
        email: "${data?.email}"
      }){
        access_token,
        refresh_token
      }
    }`,
    // variables: {
    //   verifyOtpInput: {
    //     email: data?.email,
    //     otp: data?.code
    //   }
    // }
  })

  if (response?.data?.errors) {
    console.log("Error : ",response.data);
    error({message:response.data?.errors?.[0]?.message})
    
    throw response?.data?.errors
  }

  return response.data
}

const postVerifyAgentCode = atomWithMutation(() => ({
  mutationKey: ['posts'],
  mutationFn: verifyAgentCode,
  onSuccess(data) {
    showToast('success', 'Email Verified Succesfully')
  }
}))

export const useVerifyAgentCode = () => {
  const [{ mutate: mutateVerifyAgentCode, status, data }] =
    useAtom(postVerifyAgentCode)

  return [{ mutateVerifyAgentCode, status }]
}

// const updateAgentProfile = async (body) => {
//   return await Client.put(`agent/profile/update`, {
//     body: JSON.stringify(body)
//   }).then(pickResult, pickErrorMessage)
// }

const updateAgentProfile = async (body) => {
  try {
    const token = getAuthToken()
    console.log("Body",body);
    
    const response = await axios.post(
      AGENTS_BACKEND_SERVICE,
      {
        query: `
      mutation {
            completeSignUp(completeSignUpInput: {
                  firstName: "${body.firstName}",
                  lastName:"${body.lastName}",
                  phone: "${body.phoneNumber}",
                  password: "${body.password}",
                  licenseNumber: "${body.licenseNumber}",
                  zipCode:"${body.zipCode}"
            }) {
       id
       email
       firstName
       lastName
       licenseNumber
       zipCode
       phone
      }
     }`,
        variables: {
          input: {
            ...body
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (response?.data?.errors) throw response?.data?.errors
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const postUpdateAgentProfile = atomWithMutation(() => ({
  mutationKey: ['posts'],
  mutationFn: updateAgentProfile,
  onSuccess(data) {
    showToast('success', data.message)
  }
}))

export const useUpdateAgentProfile = () => {
  const [{ mutate: mutateUpdateAgentProfile, status, data }] = useAtom(
    postUpdateAgentProfile
  )

  return [{ mutateUpdateAgentProfile, status }]
}