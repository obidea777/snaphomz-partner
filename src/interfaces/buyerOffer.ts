import { IFormattedProperty } from './formattedProperty'

export interface IBuyerOffer {
  agentApproval?: boolean
  agentApprovalDate?: null
  apprasalContingency?: boolean
  buyer?: IBuyer
  buyerAgent?: IPropertyAgent
  closeEscrow?: false
  createdAt?: string
  currentStatus?: string
  documents?: []
  _id?: string
  downPayment?: IPrice
  financeContingency?: IContingency
  financeType?: string
  inspectionContingency?: IContingency
  loanAmount?: IPrice
  offerCreator?: string
  offerPrice?: IPrice
  offerType?: string
  property?: IFormattedProperty
  status?: Status[]
  seller?: IBuyer
  sellerAgent?: IPropertyAgent
  submitWithOutAgentApproval?: boolean
  updatedAt?: string
  onClick?: () => void
  handleAcceptOffer?: () => void
}

export interface IBuyer {
  accountType: string;
  createdAt: string; // or Date if you parse it
  email: string;
  emailVerified: boolean;
  firstName: string;
  fullName: string;
  lastName: string;
  mobile: IMobile;
  preApproval: boolean;
  preApprovalDocument: any;
  propertyPreference: any;
  stripeCustomerId: string;
  tokenExpiryTime: string; // or Date if parsed
  updatedAt: string; // or Date
  verificationCode: string;
  id: string;
}

interface IMobile {
  number_body: string
  mobile_extension: string
  raw_mobile: string
  _id: string
}

interface IPrice {
  amount: number
  currency: string
}
interface IContingency {
  amount: string
  unit: string
}
interface IPropertyAgent {
  completedOnboarding: boolean
  connectedUsers: string[]
  createdAt: string
  email: string
  emailVerified: boolean
  firstName: string
  fullname: string
  lastName: string
  licence_number: string
  mobile: IMobile
  region: string
  token_expiry_time: string | null
  updatedAt: string
  verification_code: string
  __v: number
  _id: string
}

interface Status {
  status: string
  eventTime: string
  _id: string
}
