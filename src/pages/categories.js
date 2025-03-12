import React, { useEffect, useState } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import apiPath from '../utils/pathObj'
import { apiGet } from '../utils/apiFetch'
import Link from 'next/link'
import Image from 'next/image'

function Categories () {
  const [categoryData, setCategoryData] = useState([])
  const [pagination, setPagination] = useState()
  const [page, setPage] = useState(1)
  const [filterData] = useState({
    category: '',
    searchKey: '',
    isReset: false,
    isFilter: false
  })
  const [pageRecord] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })

  const categoryList = async (pageNumber = pageRecord.page) => {
    try {
      let condition = {
        page: pageNumber || 1
      }
      var path = apiPath.categoryList
      const result = await apiGet(path, condition)
      var response = result?.data?.results
      setCategoryData([...categoryData, ...response.docs])
      setPagination(response)
    } catch (error) {
      console.log('error in get all category list==>>>>', error.message)
    }
  }

  const loadMore = () => {
    setPage(page + 1)
    categoryList(page + 1)
  }

  useEffect(() => {
    categoryList()
  }, [filterData])

  return (
    <div className='main_wrap blog-main'>
      <section className='serach_result'>
        <Container>
          <Row className='mb-3 mb-sm-4'>
            <Col md={7}>
              <div className='inner_heading mb-md-0 mb-3'>
                <p className='fw-normal mb-0'>
                  {pagination?.totalDocs} results
                </p>
              </div>
            </Col>
          </Row>
          <Row className='gy-3'>
            {categoryData?.length > 0 &&
              categoryData?.map((item, index) => {
                return (
                  <div className='col-lg-3 col-md-4 col-6' key={index}>
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
                  </div>
                )
              })}
          </Row>
          {pagination?.hasNextPage && page <= pagination?.page && (
            <div className='text-center pt-3 pt-md-5'>
              <button
                className='theme_lg_btn text-decoration-none subscription-btn'
                onClick={() => loadMore()}
              >
                {' '}
                Load more
              </button>
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}
export default Categories
