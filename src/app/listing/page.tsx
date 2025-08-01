'use client'

import { Button } from 'components/common/buttons/Button'
import SearchComponent from 'components/common/SearchComponent'
import PropertySearch from 'components/ui/property-search'
import { claimPropertyAtom } from 'hooks/claimPropertyAtom'
import { createProperty } from 'hooks/useCreateProperty'
import { useMLSProperties } from 'hooks/useMLSProperties'
import { IProperty, PropertyAddressDetails } from 'interfaces'
import { useAtom } from 'jotai'
import { useSellerPropertyApi } from 'lib/api/useAddProperty'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { showToast } from 'utils/toastHelper'
import { Autocomplete, Libraries, useJsApiLoader } from "@react-google-maps/api";
import { success, error } from 'components/alert/notify'
import axios from 'axios'
import { googleMapsApiKey } from 'shared/constants/env'

export type Property = IProperty & {
  propertyAddressDetails?: PropertyAddressDetails;
  mls_data?: any;
  images?: {
    url: string;
    highRes?: string;
    lowRes?: string;
    midRes?: string;
  }[]; // Allowing multiple resolutions for each image
  videos?: {
    url: string;
    title?: string; // Optional video title
  }[]; // Video data includes title
  propertyDocument?: string[]; // Array of document URLs or filenames
  propertyName: string; // Property name is essential (not optional)
  longitude: number; // Longitude should always be a number
  latitude: number; // Latitude should always be a number
  price: {
    amount: number; // Price amount is a number
    currency: string; // Currency type (USD, EUR, etc.)
  };
  propertyType?: string; // Optional field if the property type is available
  propertyDescription?: string; // Optional description for the property
  lotSizeValue?: string; // The lot size value, could be numeric or string-based
  lotSizeUnit?: string; // Unit of measurement (e.g., sqft, acres)
  numBathroom?: string; // Number of bathrooms (as a number)
  numBedroom?: string; // Number of bedrooms (as a number)
  yearBuild?: number; // The year the property was built
  isListed?: boolean; // Whether the property is listed for sale or not
  status?: string[]; // Property status (Active, Pending, Sold)
  listingAgent?: {
    fullName: string;
    contact: string; // Agent's contact number or email
  }; // Optional agent details
  listingUrl?: string; // Optional URL for the property listing
  amenities?: string[]; // List of amenities such as pool, garage, etc.
  lotSizeSquareFeet?: number; // Size of the lot in square feet
  stories?: number; // Number of stories in the building
};

const libraries: Libraries = ['places'];

const EmptyListingDashboard = () => {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [address, setAddress] = useState<any>('')
  const [showDropdown, setShowDropdown] = useState(true)
  const [showButton, setShowButton] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [agentData] = useAtom(agentReadWriteAtom);
  const userData: any = agentData.user;
  const [{ mutate, status, data: createdProperty }] = useAtom(createProperty)
  const { createSellerPropertyMutation } = useSellerPropertyApi()
  const { mutatePropertySearch, status: propertySearchStatus, data } = useMLSProperties()
  const [_, setPropertyToStorage] = useAtom(claimPropertyAtom)
  const [loading, setLoading] = useState(false)
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null,);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  });
  const [searchedProperty, setSearchedProperty] = useState<any>()

  const onLoad = (autoCompletePlaces: google.maps.places.Autocomplete) => (autoCompleteRef.current = autoCompletePlaces);

  console.log(propertySearchStatus, userData)
  // Effect for mutation success
  useEffect(() => {
    if (createSellerPropertyMutation.status === 'success') {
      showToast('success', createdProperty.data.message, {
        className: 'bg-green-500',
      })
      setPropertyToStorage(createdProperty?.data?.data.property)
      router.push('/listing/listing-process')
    }
  }, [status, createdProperty, setPropertyToStorage, router])

  // Trigger property search when search term changes
  useEffect(() => {
    if (searchTerm) {
      setIsFetching(true)
      mutatePropertySearch(searchTerm)

      // Trigger search with the term
    } else {
      setIsFetching(false)
    }
  }, [searchTerm, mutatePropertySearch])


  useEffect(() => {
    if (propertySearchStatus === 'success') {
      setIsFetching(false)
    }
  }, [propertySearchStatus])

  const onPressItem = (item: any) => {
    setSelectedItem(item)
    setSearchTerm(item?.listing?.address?.unparsedAddress || '')
    setShowDropdown(false)
    setShowButton(true)
  }

  const handlePlaceChanged = () => {
    if (autoCompleteRef.current) {
      const place = autoCompleteRef.current.getPlace();
      const fullAddress = place?.formatted_address;

      // You can also parse components like city, state, zip here if needed
      setAddress(fullAddress || '');

      console.log('Selected place:', place);
    }
  };


  const handleSubmit = async () => {
    if (searchedProperty) {
      // mutate(selectedItem)
      console.log(searchedProperty)
      const data = searchedProperty
      // Dynamically creatihe payload based on the provided data
      const payload: any = {

        name: data.listing.courtesyOf, // Use the unparsed address as the property name
        address: data.address.unparsedAddress, // Address
        city: data.address.city, // City
        zipCode: data.address.zipCode, // ZipCode
        price: data.mlsListingPrice, // Listing price
        image: data.media.primaryListingImageUrl, // Primary image URL
        bedRooms: data.property?.bedroomsTotal || "0", // Bedrooms
        bathRooms: data.property?.bathroomsTotal || "0", // Bathrooms
        sqft: data.property?.livingArea?.toString() || "0", // Square footage
        listingId: data?.listingId?.toString(), // Listing ID
        propertyId: data?.reapiId?.toString(), // Property ID
        status: 'Pending',
        userId: userData?.id, // Status // Replace with actual userId if available
        // agentId: userData?.id, // Optional field
        ownershipProof: "ownership-proof-placeholder", // Optional field
      };
      // const response = await createSellerPropertyMutation.mutateAsync(payload)
      // console.log(payload, createSellerPropertyMutation.data, response)
      setPropertyToStorage(payload)
      router.push(`/listing/${data?.listingId?.toString()}/listing-process`)
      // Call the mutation to create a property
    }
  }

  // const handleClaimHome = async () => {
  //   setLoading(true);
  //   try {
  //     const body = {
  //       address: address,
  //     }
  //     const response = await axios.post(
  //       `${PROPERTY_SEARCH_AI_URL}/address` || 'http://13.60.114.186:9000/api/search/address',
  //       body
  //     );
  //     if (response.data) {
  //       console.log(response?.data.data)
  //       success({
  //         message: 'Found the property that matches your criteria',
  //       });
  //       const payload = {
  //         ...response?.data?.data,
  //         public:{
  //           imageUrl:''
  //         },
  //         listing:{
  //           courtesyOf:response?.data?.data?.propertyInfo?.address?.address,
  //           listPriceLow:response?.data?.data?.estimatedValue,
  //           address:{
  //             unparsedAddress:response?.data?.data?.propertyInfo?.address?.address
  //           },
  //           property:{
  //             bedroomsTotal:response?.data?.data?.propertyInfo?.bedrooms,
  //             bathroomsTotal:response?.data?.data?.propertyInfo?.bathrooms,
  //             pricePerSqFt:''
  //           }
  //         }
  //       }
  //       dispatch(setClaimProperty(payload));
  //       router?.push(`/dashboard/seller/listing/listing-empty`);
  //     } else {
  //       error({
  //         message: 'Property not found',
  //       });
  //     }
  //     // dispatch(setPropertyQuery(response.data?.result.search_query));
  //     // addProperties(response.data?.result.records);
  //   } catch (err: any) {
  //     console.error("Search request failed:", err);
  //     error({
  //       message:
  //         err?.response?.data?.error || "An unexpected error occurred.",
  //     });
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  console.log(searchedProperty, searchedProperty)

  const searchProperty = async () => {
    setLoading(true)
    try {
      const body = {
        address: address,
      }
      const response = await axios.post('https://preprod-ai.snaphomz.com/api/search/address', body);
      if (response.data) {
        console.log(response?.data)

        const property = response?.data?.searchAddressResult?.data
        const mlsResult = response?.data?.mlsDetailResult?.data
        const extraInfoProperty = response?.data?.mlsDetailResult?.data
        console.log(property, extraInfoProperty?.media?.primaryListingImageUrl)

        success({
          message: 'Found the property that matches your criteria',
        });
        const payload = {
          ...property,
          ...extraInfoProperty,
          public: {
            primaryListingImageUrl: extraInfoProperty?.media?.primaryListingImageUrl
          },
          listing: {
            courtesyOf: mlsResult.courtesyOf,
            listPriceLow: property.estimatedValue,
            address: {
              unparsedAddress: property.propertyInfo?.address?.address
            },
            property: {
              bedroomsTotal: mlsResult.property?.bedroomsTotal,
              bathroomsTotal:mlsResult.property?.bathroomsTotal,
              pricePerSqFt: mlsResult.property?.livingArea
            }
          }
        }
        setSearchedProperty(payload)
        // router?.push(`/dashboard/seller/listing/listing-empty`);
      } else {
        error({
          message: 'Property not found',
        });
      }
      setLoading(false)
      // dispatch(setPropertyQuery(response.data?.result.search_query));
      // addProperties(response.data?.result.records);
    } catch (err: any) {
      console.error("Search request failed:", err);
      error({
        message:
          err?.response?.data?.error || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false)
    }
  }

  console.log(searchedProperty)

  return (
    <section className="flex-col items-center justify-center flex min-h-[calc(100vh)]">
      <h1 className="text-4xl font-semibold text-center mb-4 mt-16">Listing Dashboard</h1>

      {/* <SearchComponent
        onSearch={setSearchTerm} // Update search term
        inputSearchString={searchTerm}
        loading={isFetching}
      />
      <div className="relative w-3/5">
        {showDropdown && data && (
          <div className="absolute max-h-56 overflow-auto top-full left-0 w-full border-b border-r border-l border-solid border-[#D5D9DC] rounded-b-md bg-transparent z-10 shadow-md">
            {Array.isArray(data) && data.map((item, index) => (
                <div
                  onClick={() => onPressItem(item)}
                  key={index}
                  className="p-2 cursor-pointer items-center flex gap-2 text-left hover:bg-gray-100">
                  <Image src={item?.listing?.media?.primaryListingImageUrl} alt="" width={50} height={32} className=' rounded-md w-20 h-12 ' />
                  <p className='text-sm font-bold'>{item?.listing?.address?.unparsedAddress}</p>
                </div>
              ))}
          </div>
        )}
      </div> */}
      {/* <PropertySearch
          value={address} 
          setValue={setAddress} 
       /> */}


      {
        searchedProperty && (
          <div

            className="cursor-pointer w-[300px] mb-4 flex flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white border border-gray-100 hover:border-ocOrange hover:scale-[1.02] group"
          >
            <div className="relative h-60 w-full overflow-hidden">
              <div className="relative h-full w-full">
                <Image
                  className="h-full w-full object-cover object-center"
                  fill
                  // loader={imageLoader}
                  alt="snaphomz-property-image"
                  src={searchedProperty?.public.primaryListingImageUrl ?? '/assets/images/placeholder.svg'}
                  unoptimized
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-4 space-y-2 group-hover:bg-gray-50 transition-colors duration-300">
              <p className="text-sm text-gray-600 line-clamp-2">
                <span className="font-medium">{searchedProperty.listing?.address?.unparsedAddress}</span>,{' '}
                {searchedProperty.listing?.address?.city}, {searchedProperty.listing?.address?.stateOrProvince}{' '}
                {searchedProperty.listing?.address?.zipCode}
              </p>

              <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
                {[
                  {
                    iconAlt: '🛏️',
                    value: searchedProperty.listing?.property?.bedroomsTotal || 0,
                    unit: 'Bed',
                  },
                  {
                    iconAlt: '🚿',
                    value: searchedProperty.listing?.property?.bathroomsTotal || 0,
                    unit: 'Bath',
                  },
                  {
                    iconAlt: '📏',
                    value: searchedProperty.property?.livingArea || 0,
                    unit: searchedProperty.listing?.pricePerSqFt || 'sqft',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={
                      index === 1
                        ? 'flex flex-1 flex-col items-center justify-center px-4'
                        : 'flex flex-col items-center'
                    }
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{item.iconAlt}</span>
                      <span className="text-base font-semibold text-gray-800">{item.value}</span>
                    </div>
                    <span className="text-xs text-gray-500">{item.unit}</span>
                  </div>
                ))}
              </div>

              <Button
                className="rounded-full"
                type="submit"
                onClick={handleSubmit}
              >
                Claim home
              </Button>
            </div>
          </div>
        )
      }
      <div className='flex gap-2'>
        {isLoaded && (
          <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceChanged}>
            <input
              type="text"
              className="text-gray-700 peer autofill:bg-transparent outline-none w-[600px] rounded-md px-4 py-4 bg-white border border-gray-300 focus:outline-none"
              name="streetAddress1"
              id="streetAddress1"
              placeholder="Start typing address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              data-type="streetAddress1"
            />
          </Autocomplete>
        )}
        <Button className='px-4 text-sm rounded-md' onClick={searchProperty}>Search Property</Button>
      </div>



      {/* 
      {searchedProperty && (
        <Button
          className="text-white bg-black font-medium text-base mt-6 w-44"
          type="submit"
          disabled={!selectedItem}
          onClick={handleSubmit}>
          Claim home
        </Button>
      )} */}
    </section>
  )
}

export default EmptyListingDashboard
