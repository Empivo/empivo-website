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
  const [page] = useState(1);
  const [pagination, setPagination] = useState();
  const [pageSize] = useState(5);
  const [route, setRoute] = useState("/");
  const getSlug = (slug) => {
    const obj = config?.staticContent?.find((s) => s.slug === slug);
    return `/${obj?.publicSlug}`;
  };

  const staticContentList = async () => {
    try {
      const payload = {
        page,
        pageSize,
      };
      var path = apiPath.getStatic;
      const result = await apiGet(path, payload, false);
      var response = result?.data?.results;
      setContentData(response.docs);
      setPagination(response);
    } catch (error) {
      console.log("error in get all static list==>>>>", error.message);
    }
  };

  useEffect(() => {
    staticContentList();
  }, [page]);

  useEffect(() => {
    setRoute(router.asPath);
  }, [router.asPath]);

  if (isFromMobileApps) {
    return <></>;
  }

  return (
    <footer className="page_footer ">
      <Container>
        <Row>
          <Col md={5} xs={12}>
            <div className="footer_cols footer_about">
              <Link href="/">
                <Image className="mb-4" src="/images/logo_white.svg" width={196} height={57} alt="" />
              </Link>
              <p className="text-white">Welcome to Empivo - Your Comprehensive HR Solution and more!</p>
            </div>
          </Col>
          <Col md={4} xs={6}>
            <div className="footer_cols footer_nav">
              <h4>USEFUL LINKS</h4>

              <Link href="/faqs">
                <span className="me-2">
                  <Image src="/images/right-arrow.png" width={5} height={11} />
                </span>
                FAQs
              </Link>
              <Link href="/contact-us">
                <span className="me-2">
                  <Image src="/images/right-arrow.png" width={5} height={11} />
                </span>
                Contact us
              </Link>

              {contentData?.length
                ? contentData?.map((item, index) => {
                    return (
                      <>
                        <Link href={getSlug(item.slug)} key={index}>
                          <span className="me-2">
                            <Image src="/images/right-arrow.png" width={5} height={11} alt="" />
                          </span>
                          {item?.title}
                        </Link>
                      </>
                    );
                  })
                : null}
              {pagination?.hasNextPage && page <= pagination?.page && (
                <div className="">
                  <button className="theme_lg_btn text-decoration-none subscription-btn py-1 px-3 mt-2" onClick={() => router.push("/staticContent")}>
                    {" "}
                    Load more
                  </button>
                </div>
              )}
            </div>
          </Col>

          <Col md={3} xs={6}>
            <div className="footer_cols footer_social">
              <h4 className="mb-3">Follow us on</h4>
              <Link href="https://www.facebook.com/empivo/" target="_blank" className="ms-0">
                <img src="/images/facebook.png" width={34} height={34} alt="" />
              </Link>
              <Link href="https://twitter.com/i/flow/login?redirect_after_login=%2F" target="_blank">
                <img src="/images/twiter.png" width={34} height={34} alt="" />
              </Link>
              <Link href="https://myaccount.google.com/" target="_blank">
                <img src="/images/google.png" width={34} height={34} alt="" />
              </Link>
              <Link href="https://www.linkedin.com/company/empivo" target="_blank">
                <img src="/images/linkdin.png" width={34} height={34} alt="" />
              </Link>
              <Link href="https://www.instagram.com/empivohr/" target="_blank">
                <img src="/images/Instagram.png" width={34} height={34} alt="" />
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="copyright">© 2023 empivo.com</div>
    </footer>
  );
}

export default Footer;
