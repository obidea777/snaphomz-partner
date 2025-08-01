import axios from 'axios'
import { getAuthToken } from 'lib/storage'

const SHARED_KEY = process.env.NEXT_PUBLIC_ZIPFORM_SHARED_KEY || '1B6341EE-C30B-466D-851F-36AFED6F4847';
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ZIPFORM_SERVICE_URI || "http://localhost:5050/zipform",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Auth-SharedKey': SHARED_KEY,
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken() || localStorage.getItem('userAccessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.resolve(error)
  }
)

export default api
