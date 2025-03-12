import { apiGet } from "../utils/apiFetchServer";
import { Card, Container } from "react-bootstrap";
import apiPath from "../utils/pathObj";
import noImageFound from "../../src/images/No-image-found.jpg";
import { useState, useEffect } from "react";
import { isEmpty } from "lodash";

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
  }, [content?.StaticContentImage]);
  return (
    <div className="main_wrap blog-main">
      <section>
        <Container>
          <Card className="border-0 blog-detail-card">
            <figure>
              <Card.Img src={image} fallbackUrl={noImageFound?.src} className="card-img-top w-100" />
            </figure>
            <Card.Body className="pb-sm-4">
              <h2 className="mb-3 mb-lg-4">{content?.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: content?.description }}></div>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </div>
  );
};

// export async function getStaticPaths() {
//   const { data } = await apiGet(apiPath.getAllPages);
//   let slugs = data.results;
//   slugs = slugs.filter((s) => "publicSlug" in s);
//   const paths = slugs.map(({ publicSlug }) => ({
//     params: { slug: publicSlug },
//   }));
//   return { paths, fallback: "blocking" };
// }

// export const getServerSideProps = async ({ locale }) => {
//   const result = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `${apiPath.getContent}?publicSlug=privacy-policy`).then(response => response.json())

//   return {
//       props: {
//           ...(await serverSideTranslations(locale, ['common'])),
//           result
//       },
//   };
// }

// export async function getStaticProps({ params }) {
//   const { slug } = params;
//   const { status, data } = await apiGet(apiPath.getContent, {
//     publicSlug: slug,
//   });

export const getServerSideProps = async ({ params }) => {
  const { slug } = params;
  const { status, data } = await apiGet(apiPath.getContent, {
    publicSlug: slug,
  });

  console.log("data----------------------->>>>>>>>>>>>>>>>", data);
  // console.log("desc----------------------->>>>>>>>>>>>>>>>", data?.description);
  return {
    props: {
      status,
      data,
    },
  };
  // return {
  //   props: { status, data },
  //   revalidate: 2,
  // };
};

export default Slug;
