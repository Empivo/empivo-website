import { apiGet } from "@/utils/apiFetch";
import React, { useEffect, useState } from "react";
import apiPath from "@/utils/pathObj";
import useToastContext from "@/hooks/useToastContext";
import Accordion from "react-bootstrap/Accordion";
import { Container } from "react-bootstrap";
import { isEmpty } from "lodash";

const Faqs = () => {
  const notification = useToastContext();
  const [content, setContent] = useState([]);

  const getContent = async () => {
    const { status, data } = await apiGet(apiPath.faqs, {});
    if (status === 200) {
      if (data.success) {
        setContent(data.results);
      } else {
        notification.error(data?.message);
      }
    } else {
      notification.error(data?.message);
    }
  };

  useEffect(() => {
    getContent();
  }, []);
  return (
    <>
      <section className="faq_page_wrap">
        <Container>
          <h1>FAQs</h1>
          <div>
            <Accordion defaultActiveKey="0">
              {content?.map((i, key) => (
                <Accordion.Item eventKey={key} key={key}>
                  <Accordion.Header> {i?.title}</Accordion.Header>
                  <Accordion.Body>{i?.content}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
          {isEmpty(content) ? (
            <div className="bg-white d-flex border-b align-center justify-content-center">
              <span className="py-4 px-6 border-r">No FAQs found</span>
            </div>
          ) : null}
        </Container>
      </section>
    </>
  );
};
export default Faqs;
