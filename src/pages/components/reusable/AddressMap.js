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
  const [center, setCenter] = useState()
  const [address, setAddress] = useState(null)

  useEffect(() => {
    getMyLocation()
  }, [])
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_GOOGLE_MAP_KEY,
    libraries: ['places']
  })
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [marker, setMarker] = useState(/** @type google.maps.marker */ (null))

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
        // setLocation([latitude, longitude])
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
  }

  useEffect(() => {
    if (isLoaded) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords
            setCenter({
              lat: latitude,
              long: longitude
            })

            const geocoder = new window.google.maps.Geocoder()
            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results, status) => {
                if (status === 'OK') {
                  if (results[0]) {
                    setAddress(results[0].formatted_address)
                  } else {
                    console.error('No results found for reverse geocoding.')
                  }
                } else {
                  console.error('Geocoder failed due to:', status)
                }
              }
            )
          },
          error => {
            console.error('Error getting current location:', error)
          }
        )
      } else {
        console.error('Geolocation is not supported by your browser.')
      }
    }
  }, [isLoaded])

  const getMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationError
      )
    } else {
      console.error('Geolocation is not supported by your browser.')
    }
  }

  if (!isLoaded) {
    return <p>Loading</p>
  }

  return (
    <div style={{ width: '100%' }}>
      <div className='flex justify-between items-center position-relative mb-4 theme-form-group'>
        <Button
          type='button'
          label={'Current location'}
          onClick={() => getMyLocation()}
          className='end-0 top-0 mt-2 me-1 bg-transparent border-0 position-absolute'
        >
          {' '}
          <MdOutlineMyLocation className='fs-4' />
        </Button>
      </div>
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{ width: '100%', height: '378px', zIndex: '0' }}
        onLoad={map => setMap(map)}
      >
        <Marker
          onClick={() => {
            setSelected(marker)
            setCenter(center)
          }}
          draggable={false}
          position={center}
        >
          {marker == selected && (
            <InfoWindow
              onCloseClick={() => {
                setSelected({})
              }}
            >
              <div>
                <a target='_blank' href=''></a>
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
