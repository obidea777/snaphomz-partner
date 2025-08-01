import { IFormattedProperty } from 'interfaces/formattedProperty'
import { IBuyerOffer } from 'interfaces/buyerOffer'
import { atom } from 'jotai'

import { atomWithStorage } from 'jotai/utils'

const propertyDetailsAtom = atomWithStorage('selectedProperty', null)
const agentType = atom('')
const agentEmailAtom = atom('')
const loginAtom = atom({})
const propertyOfferAtom = atom<any>({} as IBuyerOffer)
export {
  agentType,
  agentEmailAtom,
  propertyDetailsAtom,
  propertyOfferAtom,
  loginAtom
}
