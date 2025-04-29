import { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { Card, Container } from "react-bootstrap";
import { apiGet } from "../utils/apiFetchServer";
import apiPath from "../utils/pathObj";
import noImageFound from "../../src/images/No-image-found.jpg";
import Head from "next/head";

const Slug = ({ data }) => {
  const [image, setImage] = useState("");
  const content = data?.results || [];

  useEffect(() => {
    if (!isEmpty(content?.StaticContentImage)) {
      if (content?.StaticContentImage !== "https://octal-dev.s3.ap-south-1.amazonaws.com/No-image-found.jpg") {
        setImage(content?.StaticContentImage);
      } else {
        setImage("../images/No-image-found.jpg");
      }
    }

    // Initialize Owl Carousel after DOM is ready
    if (typeof window !== "undefined" && window.$) {
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
      });
    }
  }, [content?.StaticContentImage]);

  return (
    <div className="main_wrap blog-main">
      <Head>
        {/* Owl Carousel & jQuery CDN (only if not already loaded globally) */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" />
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>
      </Head>

      <section>
        <Container>
          <Card className="border-0 blog-detail-card">
            <Card.Body className="pb-sm-4">
              <h2 className="mb-3 mb-lg-4">{content?.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: content?.description }}></div>
            </Card.Body>
          </Card>
        </Container>

        {/* Add Owl Carousel section */}
        <div id="Journey-part" className="owl-carousel">
          {/* Example static items — replace or loop through actual content */}
          <div className="item"><h4>1</h4></div>
          <div className="item"><h4>2</h4></div>
          <div className="item"><h4>3</h4></div>
          <div className="item"><h4>4</h4></div>
        </div>
      </section>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const { slug } = params;
  const { status, data } = await apiGet(apiPath.getContent, {
    publicSlug: slug,
  });

  return {
    props: {
      status,
      data,
    },
  };
};

export default Slug;
