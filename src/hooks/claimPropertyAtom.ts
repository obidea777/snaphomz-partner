import { Property } from 'app/listing/page'
import { atomWithStorage } from 'jotai/utils'

export const claimPropertyAtom = atomWithStorage<any>('claim-property', {
  propertyAddressDetails: {
    formattedAddress: '',
    city: '',
    postalCode: '',
    country: '',
    placeId: '',
    province: '',
    state: '',
    streetName: '',
    streetNumber: '',
    longitude: '',
    latitude: ''
  },
  images: [],
  propertyDocument: [],
  propertyName: '',
  longitude: 0,
  latitude: 0,
  price: {
    amount: 0,
    currency: ''
  },
  propertyType: '',
  propertyDescription: '',
  videos: [],
  lotSizeValue: '',
  numBathroom: '',
  numBedroom: '',
  yearBuild: 0,
  lotSizeUnit: '',
  id: '',
  listed: false,
  currentStatus: '',
  seller: undefined,
  sellerAgentAcceptance: false,
  buyerAgentAcceptance: false,
  brokers: [],
  features: [],
  propertyTaxes: [],
  status: [],
  createdAt: '',
  updatedAt: '',
  sellerAgent: undefined,
  buyerAgent: undefined
})
