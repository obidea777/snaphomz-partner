// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAtom } from 'jotai'
// import { useQuery } from '@tanstack/react-query'
// import axios from 'axios'

// import { agentReadWriteAtom } from 'store/atoms/agent-atom'
// import { getAuthToken, storeCookie } from 'lib/storage'
// import { AGENT_BACKEND_SERVICE, AUTH_TOKEN } from 'shared/constants/env'
// import { showToast } from 'utils/toastHelper'

// // GraphQL query for user details
// const GET_USER_DETAILS = `
//   query GetUserDetails {
//     getUserDetails {
//       id
//       firstName
//       lastName
//       email
//       licenseNumber
//       bio
//       profile
//       address
//       zipCode
//       accountType
//     }
//   }
// `

// const AuthLayout = ({ children }) => {
//   const router = useRouter()
//   const [agentData, setAgentState] = useAtom(agentReadWriteAtom)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)

//   const { data, status, error } = useQuery({
//     queryKey: ['user-details-query'],
//     queryFn: async () => {
//       const token = getAuthToken()
//       if (!token) throw new Error('No auth token found')

//       const response = await axios.post(
//         AGENT_BACKEND_SERVICE,
//         { query: GET_USER_DETAILS },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )

//       if (response?.data?.errors) {
//         throw new Error('Failed to fetch user details')
//       }

//       return response.data
//     },
//     enabled: typeof window !== 'undefined', // only run on client
//     retry: false,
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   })

//   useEffect(() => {
//     if (status === 'pending'){
//       console.log('PENDINg')
//       return
//     } 

//     if (status === 'error' || !data?.data?.getUserDetails) {
//       console.log('GET DETAIL')
//       router.push('/')
//       return
//     }

//     const userDetails = data.data.getUserDetails

//     if (userDetails.accountType !== 'AGENT') {
//       router.push('/')
//       return
//     }

//     // Authenticated and valid agent
//     const newAgent = {
//       is_authenticated: true,
//       user: userDetails,
//     }

//     storeCookie({ key: AUTH_TOKEN, value: getAuthToken() })
//     setAgentState(newAgent)
//     setIsAuthenticated(true)
//     showToast('success', 'Authenticated as agent', { className: 'bg-green-500' })
//     setIsLoading(false)
//   }, [status, data, error, router, setAgentState])

//   if (isLoading || status === 'pending') return <div>Loading...</div>
//   if (!isAuthenticated) return null

//   return <div>{children}</div>
// }

// export default AuthLayout


'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { getAuthToken, storeCookie } from 'lib/storage'
import { AGENT_BACKEND_SERVICE, AUTH_TOKEN } from 'shared/constants/env'
import { showToast } from 'utils/toastHelper'
import { LoadingScreen } from 'components/common/LoadingPage'

const PUBLIC_ROUTES = ['/', '/signUp', '/password-reset', '/set-password']

const GET_USER_DETAILS = `
  query GetUserDetails {
    getUserDetails {
      id
      firstName
      lastName
      email
      licenseNumber
      profile
      zipCode
      accountType
    }
  }
`

const AuthLayout = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname() // get current route
  const [agentData, setAgentState] = useAtom(agentReadWriteAtom)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const { data, status, error } = useQuery({
    queryKey: ['user-details-query'],
    queryFn: async () => {
      const token = getAuthToken()
      if (!token) throw new Error('No auth token found')

      const response = await axios.post(
        AGENT_BACKEND_SERVICE,
        { query: GET_USER_DETAILS },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response?.data?.errors) {
        throw new Error('Failed to fetch user details')
      }

      return response.data
    },
    enabled: typeof window !== 'undefined', // only run on client
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const validate = () => {
    if (status === 'pending') {
      return
    }
    const token = getAuthToken()
    
    // User is NOT authenticated
    if ((status === 'error' || !data?.data?.getUserDetails || !token)) {
      setIsAuthenticated(false)
      setIsLoading(false)

      // If user tries to access protected routes, redirect to "/"
      if (!PUBLIC_ROUTES.includes(pathname)) {
        router.push('/')
      }
      return
    }

  
    // User IS authenticated
    const userDetails = data?.data?.getUserDetails

    console.log(userDetails.accountType)
    if (userDetails.accountType !== 'PARTNER') {
      router.push('/')
      return
    }

    setAgentState({
      is_authenticated: true,
      user: userDetails,
    })
    setIsAuthenticated(true)
    setIsLoading(false)

    // Redirect authenticated users away from public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
      router.push('/partner-dashboard') // change this to your authenticated landing page
      return
    }

    showToast('success', 'Authenticated as agent', { className: 'bg-green-500' })
  }
  const loginRoute = "/"

  useEffect(() => {
    if(pathname === loginRoute  || !PUBLIC_ROUTES.includes(pathname) ) {
      validate()
    }
  }, [status, data, error, router, pathname, setAgentState])

  if ((isLoading || status === 'pending') && !PUBLIC_ROUTES.includes(pathname)) return <p>Loading....</p>
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) return null

  return <>{children}</>
}

export default AuthLayout

