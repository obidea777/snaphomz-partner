'use client'

import Carousel from 'components/common/carousel/Carousel'
import { FeatureList } from 'components/dashboard/sell/listingPreview/FeatureList'
import { Header } from 'components/dashboard/sell/listingPreview/Header'
import { Highlights } from 'components/dashboard/sell/listingPreview/Highlights'
import { HomeFeatures } from 'components/dashboard/sell/listingPreview/HomeFeatures'
import { Location } from 'components/dashboard/sell/listingPreview/Location'
import { PropertyAgentCard } from 'components/dashboard/sell/listingPreview/PropertyAgentCard'
import { PropertyDetails } from 'components/dashboard/sell/listingPreview/PropertyDetails'
import { PropertyOverview } from 'components/dashboard/sell/listingPreview/PropertyOverview'
import { SchoolsNearby } from 'components/dashboard/sell/listingPreview/SchoolsNearby'
import { useSingleProperty } from 'hooks/usePropertyOffer'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useState } from 'react'

const ListingPreview = () => {
  const params = useParams()
  const id = params?.id
  const { data: singleProperty, isLoading: singlePropertyLoading } =
    useSingleProperty(id as string)

  const [activeTab, setActiveTab] = useState('Statistics')
  const [activeStatTab, setActiveStatTab] = useState(0)

  const lineChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  const lineChartData = [
    {
      label: 'Average Sale Price',
      data: [1.47, 1.48, 1.49, 1.48, 1.49, 1.51, 1.55],
      fill: false,
      borderColor: '#000000',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0
    }
  ]
  const property = singleProperty?.data?.property
  console.log({ propertyImages: property?.data?.property })

  return (
    <section className="rounded-t-3xl px-12 pb-16 w-full overflow-hidden pt-32">
      <Header />
      <section className="grid grid-cols-3 gap-8 h-full pt-10">
        {property ? (
          <>
            <div className="col-span-2">
              <section className="h-[24rem] w-ful mb-5">
                <Carousel>
                  {property?.images?.map((image, index) => (
                    <div
                      className="relative flex flex-none flex-wrap lg:flex-nowrap w-full h-full items-center justify-center"
                      key={index}>
                      <Image
                        src={image?.url}
                        fill
                        alt={image.url}
                        className="object-fill"
                      />
                    </div>
                  ))}
                </Carousel>
              </section>

              <section className="pt-4">
                <PropertyOverview
                  name={property.propertyName}
                  address={property.propertyAddressDetails.formattedAddress}
                  price={property.price?.amount}
                  city={property.propertyAddressDetails.city}
                  postalCode={property.propertyAddressDetails.postalCode}
                  numberOfBathroom={property.numBathroom}
                  numberOfBedroom={property.numBedroom}
                  lotSizeUnit={property.lotSizeUnit}
                  lotSizeValue={property.livingArea}
                  propertyType={property.propertyType}
                  currentStatus={property.currentStatus}
                />
                <FeatureList />
                <div className="border-[0.05rem] border-solid border-grey-850 my-10" />
                <PropertyDetails description={property.propertyDescription} />
              </section>
              <div className="border-[0.05rem] border-solid border-grey-850 my-10" />
              <Location
                province={property.propertyAddressDetails.province}
                latitude={property.propertyAddressDetails.latitude}
                longitude={property.propertyAddressDetails.longitude}
                city={property.propertyAddressDetails.city}
                postalCode={property.propertyAddressDetails.postalCode}
                formattedAddress={
                  property.propertyAddressDetails.formattedAddress
                }
              />
              <HomeFeatures />
              <SchoolsNearby />
              <h2 className="text-xl text-black font-bold my-6">
                Property Analytics
              </h2>
              <section className="border-b border-solid border-[#707070] flex items-center justify-between w-full mb-8">
                {[
                  'Statistics',
                  'Property Projections',
                  'Payment Calculation'
                ].map((item) => (
                  <section
                    onClick={() => setActiveTab(item)}
                    className={`${
                      activeTab === item
                        ? 'border-b-4 border-solid border-black'
                        : 'border-b-4 border-solid border-transparent'
                    } px-5 pb-3 cursor-pointer`}
                    key={item}>
                    <p className="font-bold text-md">{item}</p>
                  </section>
                ))}
              </section>
              <h2 className="text-lg font-medium">Estimated Home Value</h2>
              <p className="font-medium text-md text-[#BABABA] mb-8">
                Range of Values: $1,473,000 - $1,554,412
              </p>
              <section className="border-b border-solid border-[#707070} flex items-center justify-between w-full mb-12">
                {[
                  { name: 'Average Sale Price', value: '$1,518,000' },
                  { name: 'Homes Sold', value: '6' },
                  { name: 'Sale-to-list', value: '107.3%' }
                ].map((item, i) => (
                  <section
                    onClick={() => setActiveStatTab(i)}
                    className={`${
                      activeStatTab === i
                        ? 'border-b-4 border-solid border-black bg-[#F5F6F9]'
                        : 'border-b-4 border-solid border-transparent'
                    } px-5 py-3 w-full cursor-pointer`}
                    key={i}>
                    <p className="font-bold text-lg">{item.value}</p>
                    <p className="font-medium text-xs text-grey-450">
                      {item.name}
                    </p>
                  </section>
                ))}
              </section>
            </div>
            <section>
              <Highlights />
              <PropertyAgentCard />
            </section>
          </>
        ) : null}
      </section>
    </section>
  )
}

export default ListingPreview
