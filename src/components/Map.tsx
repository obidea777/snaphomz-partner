'use client'

type Props = {
  width?: string
  height?: string
  coord?: {
    lat: number
    lng: number
  }[]
  zoom?: number
}

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import React from 'react'
import { googleMapsApiKey } from 'shared/constants/env'

function Map({ width, height, coord, zoom = 10 }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey!
  })

  const containerStyle = {
    minHeight: height ? height : '350px',
    height: '100%',
    width: '100%',
    minWidth: width ? width : '500px'
  }

  const coordinates = coord ? coord : []

  const [map, setMap] = React.useState<google.maps.Map | null>(null)

  const onLoad = React.useCallback(
    function callback(mapInstance: google.maps.Map) {
      const bounds = new window.google.maps.LatLngBounds()
      coordinates.forEach(({ lat, lng }) => bounds.extend({ lat, lng }))
      if (mapInstance) {
        mapInstance.fitBounds(bounds)
        setMap(mapInstance)
      }
    },
    [coordinates]
  )

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={coordinates[0]}
      zoom={zoom}
      onLoad={onLoad as any}
      onUnmount={onUnmount}>
      {/* Child components, such as markers, info windows, etc. */}
      {/* <Marker position={coordinate} /> */}
      {coordinates.map((coordinate, index) => (
        <Marker key={index} position={coordinate} />
      ))}
    </GoogleMap>
  ) : null
}

export default React.memo(Map)
