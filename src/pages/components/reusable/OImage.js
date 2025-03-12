import React from 'react'
import errorIcon from '../../../images/error.svg'
const OImage = ({ src, fallbackUrl, ...rest }) => {
  return (
    <>
      <img
        src={src}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null // prevents looping
          currentTarget.src = fallbackUrl ? fallbackUrl : errorIcon
        }}
        {...rest}
      />
    </>
  )
}

export default OImage
