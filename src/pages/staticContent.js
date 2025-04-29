import React, { useContext, useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import apiPath from '../utils/pathObj'
import { apiGet } from '../utils/apiFetch'
import Link from 'next/link'
import AuthContext from '@/context/AuthContext'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'

let $ = null // jQuery placeholder

function StaticContent () {
  const [contentData, setContentData] = useState([])
  const [pagination, setPagination] = useState()
  const [page, setPage] = useState(1)
  const { config } = useContext(AuthContext)
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

  const getSlug = slug => {
    const obj = config?.staticContent?.find(s => s.slug === slug)
    return `/pages/${obj?.publicSlug}`
  }

  const staticContentList = async (pageNumber = pageRecord.page) => {
    try {
      let condi = {
        page: pageNumber || 1
      }
      var path = apiPath.getStatic
      const result = await apiGet(path, condi)
      var response = result?.data?.results
      setContentData(prev => [...prev, ...response.docs])
      setPagination(response)
    } catch (error) {
      console.log('error in get all static list==>>>>', error.message)
    }
  }

  const loadMore = () => {
    setPage(prev => prev + 1)
    staticContentList(page + 1)
  }

  useEffect(() => {
    staticContentList()
  }, [filterData])

  // Initialize jQuery Owl Carousel
  useEffect(() => {
    (async () => {
      const jQuery = (await import('jquery')).default
      $ = jQuery
      require('owl.carousel')

      setTimeout(() => {
        $('#Journey-part').owlCarousel({
          loop: true,
          margin: 5,
          nav: true,
          dots: false,
          responsive: {
            0: { items: 1 },
            600: { items: 3 },
            1000: { items: 6 }
          }
        })
      }, 100) // Delay to ensure DOM is ready
    })()
  }, [contentData])

  return (
    <div className='main_wrap blog-main'>
      <section className='serach_result'>
        <Container>
          <div id='Journey-part' className='owl-carousel owl-theme'>
            {contentData?.length > 0 &&
              contentData?.map((item, index) => (
                <div key={index} className='item static-menu'>
                  <Link
                    href={getSlug(item.slug)}
                    className='categoery_outer transition'
                  >
                    <div>
                      <h5 className='text-black'>{item?.title}</h5>
                    </div>
                  </Link>
                </div>
              ))}
          </div>

          {pagination?.hasNextPage && page <= pagination?.page && (
            <div className='text-center pt-3 pt-md-5'>
              <button
                className='theme_lg_btn text-decoration-none subscription-btn'
                onClick={() => loadMore()}
              >
                Load more
              </button>
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}

export default StaticContent
