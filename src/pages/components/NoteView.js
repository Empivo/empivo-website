import React, { useContext, useEffect, useState } from 'react'
import { Form, Modal, Button } from 'react-bootstrap'
import { FiSend } from 'react-icons/fi'
import dayjs from 'dayjs'
import AuthContext from '@/context/AuthContext'
import Helpers from '@/utils/helpers'
import relativeTime from 'dayjs/plugin/relativeTime'
import InfiniteScroll from 'react-infinite-scroll-component'
import { preventMaxInput } from '@/utils/constants'
import { useForm } from 'react-hook-form'

dayjs.extend(relativeTime)

const NoteView = ({ open, onHide, selectedTask, socket }) => {
  const { register, handleSubmit, clearErrors, setError, reset, setValue } =
    useForm({ mode: 'onChange', shouldFocusError: true, defaultValues: {} })
  const [messageData, setMessageData] = useState([])
  const [messages, setMessages] = useState('')
  const { user } = useContext(AuthContext)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [hasNextPage, setHasNextPage] = useState(false)

  const onSubmit = e => {
    let payload = {
      taskId: selectedTask?._id,
      message: messages?.trim()
    }
    socket.emit('groupSendMessage', payload, ackData => {
      setMessages('')
      reset()
      setMessageData(obj => [...obj, ackData?.data])
    })
  }

  useEffect(() => {
    // call only first time for get data
    let payload = { taskId: selectedTask?._id, page, limit: pageSize }
    socket.emit('getGroupInbox', payload, acknowledgmentData => {
      const data = acknowledgmentData?.data?.docs
      console.log('get data from first time', acknowledgmentData)
      setMessageData(data)
      setHasNextPage(acknowledgmentData?.data?.hasNextPage)
    })
  }, [])

  useEffect(() => {
    socket.off('groupReceiveMessage').on('groupReceiveMessage', data => {
      console.log('Received message from groupReceiveMessage:', data?.data)
      setMessageData(obj => [...obj, data?.data])
    })
  }, [socket])

  const loadMoreData = () => {
    const pageCount = page + 1
    setPage(pageCount)
    let payload = {
      taskId: selectedTask?._id,
      page: pageCount,
      limit: pageSize
    }
    socket.emit('getGroupInbox', payload, acknowledgmentData => {
      const data = acknowledgmentData?.data?.docs
      console.log('get data from first time', acknowledgmentData)
      setMessageData(obj => [...obj, ...data])
      setHasNextPage(acknowledgmentData?.data?.hasNextPage)
    })
  }

  const selectCategory = e => {
    if (e.target.value) {
      setMessages(e.target.value)
      clearErrors('message')
    } else {
      setMessages('')
      setError('message', {
        type: 'validation',
        message: 'Please enter message.'
      })
    }
  }

  if (socket) {
    socket.on('readMessage', data => {
      console.log('Receive message data', data)
    })
  }

  return (
    <div>
      <Modal
        show={open}
        onHide={onHide}
        size='lg'
        centered
        className='agent-modal secondaryModal chat_modal'
      >
        <Modal.Header className='d-flex justify-content-center' closeButton>
          <div className='d-flex justify-content-between w-100 me-4 align-items-center'>
            <Modal.Title>Notes</Modal.Title>
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className='p-0'>
            <div className='job_listing_main'>
              <div className='jobs_list2'>
                <div className='chatdetail_body'>
                  <div
                    id='scrollableDiv'
                    style={{
                      height: 500,
                      overflow: 'auto',
                      display: 'flex',
                      flexDirection: 'column-reverse'
                    }}
                  >
                    <InfiniteScroll
                      dataLength={messageData?.length}
                      next={loadMoreData}
                      style={{
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        padding: '20px'
                      }}
                      inverse={true}
                      hasMore={hasNextPage}
                      scrollableTarget='scrollableDiv'
                    >
                      {messageData &&
                        messageData?.length > 0 &&
                        messageData
                          ?.sort(
                            (a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                          )
                          ?.map((item, index) => {
                            const date = dayjs(item?.createdAt)
                            const formattedDate = date?.fromNow()
                            return (
                              <>
                                <div className='mb-3'>
                                  {Helpers?.ternaryCondition(
                                    item?.type === 'heading',
                                    <div className='text text-center p-2 text-sm fw-bold text-dark'>
                                      {formattedDate}
                                    </div>,
                                    <>
                                      {item?.userId !== user?._id ? (
                                        <div className='w-50 me-auto receive_msg'>
                                          <span className='Name mb-1 ps-2 d-block text-dark'>
                                            {item?.senderDetail?.name}
                                          </span>
                                          <div className='chatList bg-white'>
                                            <p className='mb-0'>
                                              {item?.message}
                                            </p>
                                          </div>
                                          <span className='time'>
                                            {' '}
                                            {dayjs(item?.createdAt).format(
                                              'h:mm A'
                                            )}
                                          </span>
                                        </div>
                                      ) : (
                                        <div
                                          key={index}
                                          className='w-50 ms-auto send_msg'
                                        >
                                          <div className='chatList'>
                                            <p className='mb-0'>
                                              {item?.message}
                                            </p>
                                          </div>
                                          <span className='time text-end d-block'>
                                            {dayjs(item?.createdAt).format(
                                              'h:mm A'
                                            )}
                                          </span>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </>
                            )
                          })}
                    </InfiniteScroll>
                  </div>

                  <div className='msgChatAction'>
                    <Form.Control
                      type='text'
                      placeholder='Message'
                      value={messages}
                      {...register('message', {
                        required: 'Please enter message.'
                      })}
                      name='message'
                      onInput={e => preventMaxInput(e)}
                      onChange={e => {
                        selectCategory(e)
                        setValue('message', e?.target?.value)
                      }}
                    />

                    <Button
                      type='submit'
                      className='rounded-circle msg_send_btn d-flex justify-content-center align-items-center ms-3'
                    >
                      <FiSend />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </form>
      </Modal>
    </div>
  )
}

export default NoteView
