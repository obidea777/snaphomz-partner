export interface IFormattedProperty {
  _id: string
  propertyAddressDetails: IPropertyAddressDetails
  images: ImageInterface[]
  videos: Video[]
  listed: boolean
  propertyName: string
  currentStatus: string
  seller: ISeller
  sellerAgentAcceptance: boolean
  buyerAgentAcceptance: boolean
  propertyDocument: PropertyDocument[]
  brokers: Broker[]
  features: Feature[]
  propertyTaxes: PropertyTax[]
  status: Status[]
  createdAt: string
  updatedAt: string
  lotSizeUnit: string
  lotSizeValue: string
  numBathroom: string
  numBedroom: string
  price: Price
  propertyType: string
  propertyDescription: string
  buyerAgent: IPropertyAgent
  sellerAgent: IPropertyAgent
  propertyOwnershipDetails?: IpropertyOwnershipDetails
}

export interface IPropertyAddressDetails {
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
  year?: string
  price?: number
  bedroom?: number
  bathroom?: number
  propertyDescription?: string
  ownerDetails?: string
}

export interface ImageInterface {
  url: string
  thumbNail: string
  _id?: string
}

interface Video {
  url: string
  thumbNail: string
  _id?: string
}

export interface IPropertyAgent {
  _id: string
  firstName: string
  lastName: string
}

export interface PropertyDocument {
  name: string
  url: string
  _id?: string
}

export interface Broker {
  agent: IPropertyAgent
  role: string
  _id: string
}

interface Feature {
  feature: string
  icon: string
  description: string
  _id?: string
}

interface PropertyTax {
  amount: number
  currency: string
  dateSeen: string[]
  _id: string
}

interface Price {
  amount: number
  currency: string
}

interface Status {
  status: string
  eventTime: string
  _id: string
}

export interface ISeller {
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
  mobile: {
    number_body: string
    mobile_extension: string
    raw_mobile: string
    _id: string
  }
  token_expiry_time: string
  verification_code: string
  stripe_customer_id: string
  preApproval: true
  preApprovalDocument: {
    url: string
    expiryDate: string
  }
}
interface IpropertyOwnershipDetails {
  actiontime: string
}
