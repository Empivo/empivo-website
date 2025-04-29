import React, { useEffect, useRef, useState } from 'react'
import { geocodeByLatLng } from 'react-google-places-autocomplete'
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow
} from '@react-google-maps/api'
import { Button } from 'react-bootstrap'
import { MdOutlineMyLocation } from 'react-icons/md'
import useToastContext from '@/hooks/useToastContext'

const AddressMap = ({ setValue }) => {
  const notification = useToastContext()
  const [selected, setSelected] = useState({})
  const [center, setCenter] = useState({
    lat: 39.900883, // Default coordinates for 525 NJ-73 Ste 104
    lng: -74.936890
  })
  const [address, setAddress] = useState("525 NJ-73 Ste 104, Marlton, NJ 08053, USA")

  useEffect(() => {
    // Set the default address in the form when component mounts
    if (setValue) {
      setValue('gps', address)
    }
    getMyLocation()
  }, [])

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_GOOGLE_MAP_KEY,
    libraries: ['places']
  })

  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const originRef = useRef()

  const handleGeolocationSuccess = async position => {
    const { latitude, longitude } = position.coords
    setCenter({ lat: latitude, lng: longitude })
    try {
      const results = await geocodeByLatLng({ lat: latitude, lng: longitude })
      if (results && results.length > 0) {
        const formattedAddress = results[0].formatted_address
        originRef.current = formattedAddress
        setValue('gps', formattedAddress)
        setAddress(formattedAddress)
        handleHide()
      } else {
        console.error('Geocoding failed: No results found.')
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
  }

  const handleGeolocationError = error => {
    notification.error(error.message)
    // Fall back to default location if geolocation fails
    setCenter({
      lat: 39.900883,
      lng: -74.936890
    })
    setAddress("525 NJ-73 Ste 104, Marlton, NJ 08053, USA")
    if (setValue) {
      setValue('gps', "525 NJ-73 Ste 104, Marlton, NJ 08053, USA")
    }
  }

  const handleHide = () => {
    setSelected({})
  }

  const getMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationError
      )
    } else {
      notification.error('Geolocation is not supported by your browser.')
      // Fall back to default location
      setCenter({
        lat: 39.900883,
        lng: -74.936890
      })
      setAddress("525 NJ-73 Ste 104, Marlton, NJ 08053, USA")
      if (setValue) {
        setValue('gps', "525 NJ-73 Ste 104, Marlton, NJ 08053, USA")
      }
    }
  }

  if (!isLoaded) {
    return <p>Loading Map...</p>
  }

  return (
    <div style={{ width: '100%' }}>
      <div className='flex justify-between items-center position-relative mb-4 theme-form-group'>
        <Button
          type='button'
          onClick={getMyLocation}
          className='end-0 top-0 mt-2 me-1 bg-transparent border-0 position-absolute'
        >
          <MdOutlineMyLocation className='fs-4' />
        </Button>
      </div>
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{ width: '100%', height: '450px', zIndex: '0' }}
        onLoad={map => {
          setMap(map)
          // Set marker to default location
          setMarker({
            lat: 39.900883,
            lng: -74.936890
          })
        }}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >
        <Marker
          position={center}
          onClick={() => {
            setSelected(center)
          }}
          draggable={false}
        >
          {selected && (
            <InfoWindow
              position={center}
              onCloseClick={() => {
                setSelected(null)
              }}
            >
              <div>
                <p>{address}</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    </div>
  )
}

export default AddressMap