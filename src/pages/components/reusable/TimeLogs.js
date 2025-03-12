import dayjs from 'dayjs'
import React, { Fragment } from 'react'
import { isEmpty } from 'lodash'

const TimeLogs = ({ timeLogData }) => {
  return (
    <>
      {timeLogData?.length > 0 &&
        timeLogData?.map((item, index) => {
          return (
            <Fragment key='index'>
              <tr>
                <td>{index + 1}</td>
                <td> {dayjs(item?.createdAt).format('MM-DD-YYYY')}</td>
                <td> {dayjs(item?.startTime).format('h:mm A')}</td>
                <td>
                  {item?.endTime
                    ? dayjs(item?.endTime).format('h:mm A')
                    : 'N/A'}
                </td>
              </tr>{' '}
            </Fragment>
          )
        })}

      {isEmpty(timeLogData) ? (
        <tr className='bg-white border-b text-center dark:bg-gray-800 dark:border-gray-700'>
          <td className='py-4 px-6 border-r' colSpan={5}>
            No record found
          </td>
        </tr>
      ) : null}
    </>
  )
}

export default TimeLogs
