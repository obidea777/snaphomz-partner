import { IBuyer } from './buyerOffer'
import { IFormattedProperty } from './formattedProperty'

export interface ITour {
  buyer?: IBuyer
  createdAt?: string
  eventDate?: IEventDate[]
  fullName?: string
  phoneNumber?: string
  property?: IFormattedProperty
  seller?: IBuyer
  sellerAgent?: string
  updatedAt?: string
  __v?: number
  _id?: string
}

interface IEventDate {
  eventDate: string
  tourTime: string
  _id: string
}
