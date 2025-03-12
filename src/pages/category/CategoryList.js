import React, { useEffect, useState } from 'react'
import apiPath from '../../utils/pathObj'
import { apiGet } from '../../utils/apiFetch'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'
import { isEmpty } from 'lodash'

const CategoryList = () => {
  const [page] = useState(1)
  const [pageSize] = useState(8)
  const [categoryData, setCategoryData] = useState([])
  const CategoryLists = async () => {
    try {
      const payload = {
        page,
        pageSize
      }
      var path = apiPath.categoryList
      const result = await apiGet(path, payload)
      var response = result?.data?.results
      setCategoryData(response.docs)
    } catch (error) {
      console.log('error in get all category list==>>>>', error.message)
    }
  }

  useEffect(() => {
    CategoryLists()
  }, [page])

  return (
    <>
      <Row>
        {categoryData?.length > 0
          ? categoryData?.map((item, index) => {
              return (
                <Col lg={3} md={4} xs={6} key={index}>
                  <Link
                    href={{
                      pathname:
                        item?.subCategoryCount == 0
                          ? '/job-seeker'
                          : '/subCategories',
                      query: { category: item?.slug }
                    }}
                    className='categoery_outer transition'
                  >
                    <div>
                      <figure>
                        <Image
                          src='/images/career.svg'
                          width='27'
                          height='30'
                          alt=''
                        />
                      </figure>
                      <h5 className='text-black'>{item?.name}</h5>
                    </div>
                  </Link>
                </Col>
              )
            })
          : null}
      </Row>
      {isEmpty(categoryData) ? (
        <div className='bg-white border-b text-center dark:bg-gray-800 dark:border-gray-700'>
          <p className='py-4 px-6 border-r'>No category data found</p>
        </div>
      ) : (
        <div className='text-center mt-3'>
          <Link
            href='/categories'
            className='theme_lg_btn text-decoration-none category-btn'
          >
            View All Category
          </Link>
        </div>
      )}
    </>
  )
}
export default CategoryList
