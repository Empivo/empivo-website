import React, { useState } from 'react'
import { Modal, Col, Row, Button } from 'react-bootstrap'
import { apiPost } from '@/utils/apiFetch'
import apiPath from '@/utils/pathObj'
import Image from 'next/image'
import Helpers from '@/utils/helpers'
import { LuUpload } from 'react-icons/lu'
import photoClose from '../../images/photo_close.png'
import useToastContext from '@/hooks/useToastContext'
import { IoDocumentTextOutline } from 'react-icons/io5'

const UploadDocumentView = ({
  open,
  onHide,
  setUploadDocument,
  employeeTaskList,
  selectDocument
}) => {
  const notification = useToastContext()
  const [images, setImages] = useState([])

  const handleImageChange = e => {
    const selectedFiles = e.target.files

    const areAllImages = Array.from(selectedFiles).every(file =>
      ['pdf', 'txt', 'docx'].includes(
        file.name.split('.')[file.name.split('.').length - 1]
      )
    )

    if (areAllImages) {
      const newImages = Array.from(selectedFiles).slice(0, 5)
      const fileSize = (e.target.files[0]?.size / (1024 * 1024)).toFixed(2)
      if (fileSize > 15) {
        notification.error('Please select file below 15Mb.')
        return false
      }
      if (images.length + newImages.length <= 5) {
        setImages(prevImages => [...prevImages, ...newImages])
      } else {
        notification.error(`You can upload up to 5 File.`)
      }
    } else {
      notification.error(`Please select only pdf,txt and docs files.`)
    }
  }

  const handleRemoveImage = index => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
  }

  const endBreakTime = async data => {
    try {
      const formData = new FormData()
      formData.append('taskId', selectDocument._id)
      formData.append('actionType', data?.actionType)
      if (images?.length > 0) {
        images?.map(item => {
          formData.append('documents', item)
        })
      }

      const result = await apiPost(apiPath.timeLogs, formData)
      if (result?.data?.success) {
        notification.success(result?.data?.message)
        employeeTaskList()
        setUploadDocument(false)
      } else {
        notification.error(result?.data?.message)
      }
    } catch (error) {
      console.log('error')
    }
  }

  return (
    <div>
      <Modal
        show={open}
        onHide={onHide}
        centered
        className='agent-modal emp-task-modal'
      >
        <Modal.Header className='d-flex justify-content-center' closeButton>
          <div className='d-flex justify-content-between w-100 me-4 align-items-center'>
            <div className='d-flex flex-column'>
              <span className='modal-title h4 mb-1'>Upload documents</span>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className='job_listing_main'>
            <div className='jobs_list border-0'>
              <div className='detail_body'>
                <Row>
                  <div className=''>
                    <div className='relative z-0  w-full group mb-4'>
                      <label
                        htmlFor='uploadFile'
                        className='mb-3 fw-bold text-black'
                      >
                        {' '}
                        Upload File
                      </label>
                      <div className='upload-doc-file position-relative block py-4  px-0 w-full text-sm text-gray-900 bg-transparent  appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer'>
                        <input
                          type='file'
                          className='form-control opacity-0 position-absolute top-0 bottom-0 cursor-pointer z-index-small'
                          accept='application/pdf, text/plain, application/doc'
                          multiple={true}
                          onChange={handleImageChange}
                        />

                        <div className='d-flex align-items-center position-absolute top-0  cursor-pointer'>
                          <figure className='p-3 py-2 border rounded-lg me-3 mb-0'>
                            <LuUpload />
                          </figure>
                          <figcaption>Choose a file to upload</figcaption>
                        </div>
                      </div>

                      <Row>
                        {images?.map((image, index) => (
                          <Col md={4} className='mb-3' key={index}>
                            <div className='border border-2 p-3 rounded-lg position-relative report_img_h w-100 h-100 rounded-3 report_imag_resize'>
                              <button
                                variant='link'
                                className='position-absolute me-1 mt-1  border-0 p-0 close-doc-icon'
                                onClick={() => handleRemoveImage(index)}
                              >
                                <Image
                                  src={photoClose}
                                  width={24}
                                  alt=''
                                  height={24}
                                />
                              </button>

                              <div className=''>
                                <span className='block mr-3'>
                                  <IoDocumentTextOutline className='fs-1 mb-3' />
                                </span>
                                <span className='text-truncate d-block max-w-[160px]'>
                                  {image?.name}
                                </span>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                  <div className='d-flex align-items-center upload-doc-footer'>
                    <Button
                      type='submit'
                      className='w-100 me-2 py-1 px-4  outline_blue_btn rounded_5'
                      onClick={() => setUploadDocument(false)}
                    >
                      Back
                    </Button>
                    <Button
                      type='submit'
                      className='w-100 py-1 px-4  theme_blue_btn rounded_5'
                      onClick={() => {
                        Helpers.alertFunction(
                          'Are you sure you want to end task?',
                          {
                            actionType: 'end'
                          },
                          endBreakTime
                        )
                      }}
                    >
                      Ok
                    </Button>
                  </div>
                </Row>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default UploadDocumentView
