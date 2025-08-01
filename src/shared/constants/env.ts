export const isProd = process.env.NODE_ENV === 'production'
export const isLocal = process.env.NODE_ENV === 'development'

export const BASE_URL = 'https://dev.api.ocreal.online/api/v1'

export const AUTH_TOKEN = '##oc-real-agent##%+++chygoz##908rtr'
export const AUTH_ROLE = 'agent_authentication_role'
export const AUTH_APP_STATE = `__OCREAL_WEB_AGENT_APP@@000___Context#state`

export const SECURE_LOGIN_KEY = '__OCREAL+AGENT_####DASHBOARD(()_ELR'
export const FIT_FOR_PURPOSE = '___OCREAL_AGENT_HUSBAND######_ELR@@@'
export const AGENT_PROPERTIES_KEY = 'agent-properties-ocreal'

export const MORTGAGE_FILE_UPLOAD = process.env.NEXT_PUBLIC_MORTGAGE_SERIVCE_URL || 'http://localhost:4001'

export const AGENT_BACKEND_SERVICE =
  process.env.NEXT_PUBLIC_AUTH_SERIVCE_GRAPHQL_URL ||
  'http://localhost:4000/graphql'

export const AGENTS_BACKEND_SERVICE =
  process.env.NEXT_PUBLIC_AGENTS_SERIVCE_GRAPHQL_URL ||
  'http://localhost:4000/graphql'

export const COMMUNICATION_SOCKET_URI =
  process.env.NEXT_PUBLIC_COMMUNICATION_SOCKET_URI || 'ws://localhost:4002'

export const COMMUNICATION_SERVICE_URI =
  process.env.NEXT_PUBLIC_COMMUNICATION_SERVICE_URI || 'http://localhost:4002'

export const GET_MESSAGE_PROPERTY_MESSAGE_THREADS = `${COMMUNICATION_SERVICE_URI}/conversations/threads`

export const deploymentEnv = process.env.NEXT_PUBLIC_ENVIROMENT_URL
export const mlsDeploymentEnv = process.env.NEXT_PUBLIC_MLS_ENVIROMENT_URL
export const publicDomain = process.env.NEXT_PUBLIC_DOMAIN
export const googleMapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_URL
export const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAD1nloXcpFm5mvgyRdvgwFFpin7dEwwwc'

export const awsAccessKey = process.env.NEXT_PUBLIC_ACCESS_AWS_KEY!
export const awsSecretKey = process.env.NEXT_PUBLIC_SECRET_AWS__ACCESS_KEY!
export const awsS3BucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME!

export const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
export const cloudinaryUploadPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export const APP_PUBLIC_ROUTE = [
  '/login',
  '/forgot-password',
  '/verification',
  '/not-supported'
]
