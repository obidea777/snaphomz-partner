export interface PropertyAddressDetails {
  formattedAddress: string
  latitude: string
  longitude: string
  placeId: string
  streetNumber: string
  streetName: string
  city: string
  province: string
  state: string
  postalCode: string
  country: string
}

export interface Image {
  url: string
  thumbNail: string
  _id: string
}

export interface Video {
  url: string
  thumbNail: string
  _id: string
}

export interface PreApprovalDocument {
  url: string
  expiryDate: string
}

export interface Seller {
  _id: string
  email: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  __v: number
  account_type: string
  firstName: string
  fullname: string
  lastName: string
  mobile: Mobile
  token_expiry_time: string | null
  verification_code: string
  stripe_customer_id: string
  preApproval: boolean
  preApprovalDocument: PreApprovalDocument
}

export interface PropertyDocument {
  name: string
  url: string
  _id: string
}

export interface Broker {
  agent: string
  role: string
  _id: string
}

export interface Feature {
  feature: string
  icon: string
  description: string
  _id: string
}

export interface PropertyTax {
  amount: number
  currency: string
  dateSeen: string[]
  _id: string
}

export interface Price {
  amount: number
  currency: string
}

export interface Mobile {
  number_body: string
  mobile_extension: string
  raw_mobile: string
  _id: string
}

export interface Agent {
  connectedUsers: {
    default: any[]
  }
  completedOnboarding: boolean
  _id: string
  email: string
  verification_code: string
  token_expiry_time: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  __v: number
  firstName: string
  fullname: string
  lastName: string
  licence_number: string
  mobile: Mobile
  region: string
}

export interface IProperty {
  _id: string
  propertyAddressDetails: PropertyAddressDetails
  images: Image[]
  videos: Video[]
  listed: boolean
  propertyName: string
  propertyDescription: string
  currentStatus: string
  seller: Seller
  sellerAgentAcceptance: boolean
  buyerAgentAcceptance: boolean
  propertyDocument: PropertyDocument[]
  brokers: Broker[]
  features: Feature[]
  propertyTaxes: PropertyTax[]
  status: any[]
  createdAt: string
  updatedAt: string
  lotSizeUnit: string
  lotSizeValue: string
  numBathroom: string
  numBedroom: string
  price: Price
  propertyType: string
  sellerAgent: Agent
  buyerAgent: Agent
}
