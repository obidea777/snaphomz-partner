import { Property } from 'app/listing/page'
import { atomWithMutation } from 'jotai-tanstack-query'
import { Client } from 'lib/baseUrlClient'

export const createProperty = atomWithMutation(() => ({
  mutationKey: ['create-property'],
  mutationFn: async (_propertyDetails: Property) => {
    const formattedPropertyDetails = {
      propertyAddressDetails: {
        formattedAddress:
          _propertyDetails.propertyAddressDetails.formattedAddress,

        placeId: '',
        streetNumber: '',
        streetName: '',
        city: _propertyDetails.propertyAddressDetails.city,
        province: '',
        state: '',
        postalCode: _propertyDetails.propertyAddressDetails.postalCode,
        country: '',
        seller: '65af4f272ee63e9ecce25e94'
      },
      propertyName: _propertyDetails.propertyName,
      images: _propertyDetails.images ?? [],
      videos: _propertyDetails.videos ?? [],
      features: null,
      propertyDescription: _propertyDetails.propertyDescription
        ? _propertyDetails.propertyDescription
        : '',
      lotSizeValue: `${_propertyDetails.lotSizeValue}`,
      lotSizeUnit: 'sqft',
      numBathroom: _propertyDetails.numBathroom
        ? `${_propertyDetails.numBathroom}`
        : '0',
      numBedroom: _propertyDetails.numBedroom
        ? `${_propertyDetails.numBedroom}`
        : '0',
      price: _propertyDetails.price,
      propertyTaxes: [],
      propertyType: _propertyDetails.propertyType,
      latitude: `${_propertyDetails.latitude}`,
      longitude: `${_propertyDetails.longitude}`,
      propertyDocument: _propertyDetails.propertyDocument || [],
      brokers: [],
      listed: false,
      seller: '65af4f272ee63e9ecce25e94'
    }

    const convertedString = JSON.stringify(formattedPropertyDetails)

    return await Client.post(`property/agent/create`, {
      body: convertedString,
      headers: {
        role: 'agent'
      }
    })
  }
}))
