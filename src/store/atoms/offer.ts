import { atom, WritableAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// TypeScript type for your Offer object
export type Offer = {
  id: string
  price: number
  financeType: string // e.g. 'loan'
  downPayment: number
  expiryDate: string // ISO date string
  cashAmount: number
  status: 'DECLINED' | 'PENDING' | 'APPROVED' | string
  createdAt: string
  updatedAt: string
  propertyEngagement: {
    user: {
      id: string
      email: string
      phone: string
    }
  }
  createdBy: {
    id: string
    email: string
    firstName: string
    lastName: string
    phone: string
  }
}

// Atom with persistent storage to hold the selected offer or undefined if none selected
export const selectedPropertyOfferAtom = atomWithStorage<Offer | undefined>(
  'SelectedPropertyOffer',
  undefined
)

// Read-write wrapper atom to update or read selected offer conveniently
export const selectedPropertyOfferReadWriteAtom = atom(
  (get) => get(selectedPropertyOfferAtom),
  (get, set, newOffer) => {
    set(selectedPropertyOfferAtom, newOffer)
  }
)
