import React from 'react'
import CropperModalSign from '@/pages/components/CropperModalSign'
import { InputGroup, Form } from 'react-bootstrap'

const SignPage = ({
  imageName,
  register,
  imageRef,
  handleImgChange,
  modalOpen,
  handleSave,
  src,
  text,
  image,
  errors,
  errorCond,
  imageShow,
  formView
}) => {
  return (
    <>
      <div className='signature_pic'>
        <div className='position-relative me-3'>
          <InputGroup>
            <Form.Control
              type='text'
              className='border-end-0'
              name={text}
              {...register}
              accept='image/png, image/jpeg'
              placeholder={imageName || 'Upload'}
              onClick={e => (e.target.value = null)}
              disabled
            />

            <InputGroup.Text>
              <img src='../../../images/upload.svg' alt='image' />
            </InputGroup.Text>
          </InputGroup>

          <input
            type='file'
            name={text}
            accept='image/png, image/jpeg, image/jpg'
            ref={imageRef}
            disabled={formView}
            className='position-absolute top-0 left-0 opacity-0'
            onChange={e => handleImgChange(e, text)}
            style={{ width: '100%', height: '100%' }}
          />
          <CropperModalSign
            modalOpen={modalOpen}
            src={src}
            handleSaveFunction={handleSave}
            text={text}
          />
          {errorCond && !image && errors}
        </div>
        {image && imageShow > 0 && (
          <figure className='upload-img'>
            <img src={image} alt={text} />
          </figure>
        )}
      </div>
    </>
  )
}
export default SignPage
