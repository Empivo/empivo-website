import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import apiPath from "../../utils/pathObj";
import { apiGet } from "../../utils/apiFetch";
import { useRouter } from "next/router";

function Footer() {
  let { isFromMobileApps } = useContext(AuthContext);
  const router = useRouter();
  const { config } = useContext(AuthContext);
  const [contentData, setContentData] = useState([]);
  const [page, setPage] = useState(1); // Changed to let it be updatable
  const [pagination, setPagination] = useState({});
  const [pageSize] = useState(5);
  const [route, setRoute] = useState("/");
  
  const getSlug = (slug) => {
    const obj = config?.staticContent?.find((s) => s.slug === slug);
    return `/${obj?.publicSlug}`;
  };

  const staticContentList = async (pageNum = page) => {
    try {
      const payload = {
        page: pageNum,
        pageSize,
      };
      var path = apiPath.getStatic;
      const result = await apiGet(path, payload, false);
      var response = result?.data?.results;
      
      if (pageNum === 1) {
        setContentData(response.docs);
      } else {
        setContentData(prev => [...prev, ...response.docs]);
      }
      
      setPagination(response);
    } catch (error) {
      console.log("error in get all static list==>>>>", error.message);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    staticContentList(nextPage);
  };

  useEffect(() => {
    staticContentList();
  }, []);

  useEffect(() => {
    setRoute(router.asPath);
  }, [router.asPath]);

  if (isFromMobileApps) {
    return <></>;
  }

  return (
    <footer>
      <div className="footer">
        <Image width={0} height={0} src="images/Group 14.png" className="img-fluid" alt="Footer Logo" />
        <p>Welcome to Empivo - Your Comprehensive HR Solution and more!</p>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xm-12 col-sm-12 col-md-6 col-lg-9 col-xl-9 col-xxl-9">
            <div className="footer-left">
              <ul>
                <li>USEFUL LINKS</li>
                <li>
                  <Link href="/faqs">
                    <span className="me-2">
                      <Image src="/images/right-arrow.png" width={5} height={11} alt="" />
                    </span>
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us">
                    <span className="me-2">
                      <Image src="/images/right-arrow.png" width={5} height={11} alt="" />
                    </span>
                    Contact Us
                  </Link>
                </li>
                
                {contentData?.length > 0 && contentData.map((item, index) => (
                  <li key={index}>
                    <Link href={getSlug(item.slug)}>
                      <span className="me-2">
                        <Image src="/images/right-arrow.png" width={5} height={11} alt="" />
                      </span>
                      {item?.title}
                    </Link>
                  </li>
                ))}
                
                {pagination?.hasNextPage && (
                  <li>
                    <button 
                      className="theme_lg_btn text-decoration-none subscription-btn py-1 px-3 mt-2" 
                      onClick={loadMore}
                    >
                      Load more
                    </button>
                  </li>
                )}
                
               
              </ul>
              <p>© 2025 empivo.com All Rights Reserved</p>
            </div>
          </div>
          <div className="col-xm-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
            <div className="footer-right">
              <p>
                PHONE <span>1-888-533-0059</span>
              </p>
              <p>
                EMAIL <span>support@empivo.com</span>
              </p>
              <span className="follow">Follow us on</span>
              <i className="fa fa-facebook-official" />
              <i className="fa fa-twitter" />
              <i className="fa fa-google-plus" />
              <i className="fa fa-linkedin-square" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;