import React, { useEffect, useState } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import apiPath from '../utils/pathObj'
import { apiGet } from '../utils/apiFetch'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

function SubCategories () {
  const [subCategoryData, setSubCategoryData] = useState([])
  const router = useRouter()
  const params = router.query.category
  const { category } = router.query
  const [pagination, setPagination] = useState()
  const [page, setPage] = useState(1)
  const [filterData] = useState({
    category: '',
    searchkey: '',
    isReset: false,
    isFilter: false
  })
  const [pageRecord] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })

  const subCategoryList = async (pageNumber = pageRecord.page) => {
    try {
      let condi = {
        page: pageNumber || 1,
        categorySlug: category
      }
      var path = apiPath.subCategoryList
      const result = await apiGet(path, condi)
      var response = result?.data?.results
      setSubCategoryData(response?.docs)
      setPagination(response)
    } catch (error) {
      console.log('error in get all subCategory list==>>>>', error.message)
    }
  }

  const loadMore = () => {
    setPage(page + 1)
    subCategoryList(page + 1)
  }

  useEffect(() => {
    if (router?.query?.category) subCategoryList()
  }, [filterData, category, router?.query?.category])

  return (
    <div className='main_wrap blog-main'>
      <section className='serach_result'>
        <Container>
          <Row className='mb-3 mb-sm-4'>
            <Col md={7}>
              <div className='inner_heading mb-md-0 mb-3'>
                <p className='fw-normal mb-0'>
                  {pagination?.totalDocs || 0} results
                </p>
              </div>
            </Col>
          </Row>
          <div className='job_categoery_link'>
            <Row className=' '>
              {subCategoryData?.length > 0 &&
                subCategoryData?.map((item, index) => {
                  return (
                    <Col lg={3} md={4} xs={6} key={index}>
                      <Link
                        href={{
                          pathname: '/job-seeker',
                          query: { category: params, subCategory: item?.slug }
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
                })}
            </Row>
          </div>
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
export default SubCategories
