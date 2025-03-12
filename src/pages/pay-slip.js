import React, { useState, useContext, useEffect } from "react";
import { Container, Breadcrumb, Row, Col, Button, Form } from "react-bootstrap";
import ProfileSidebar from "./components/ProfileSidebar";
import Image from "next/image";
import { apiPost } from "@/utils/apiFetch";
import pathObj from "@/utils/pathObj";
import RedStar from "./components/common/RedStar";
import ErrorMessage from "./components/ErrorMessage";
import dayjs from "dayjs";
import { BiMenuAltRight } from "react-icons/bi";
import Helpers from "@/utils/helpers";
import AuthContext from "@/context/AuthContext";
function PaySlip() {
  const [experienceType, setExperienceType] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const { dateValues, applyJobApi } = useContext(AuthContext);
  const statusPage = (e) => {
    setExperienceType(e.target.value);
  };
  const checkFields = () => {
    let isValid = true;
    if (experienceType === "") {
      setExperienceError(true);
      isValid = false;
    } else {
      setExperienceError(false);
    }
    return isValid;
  };
  const handleSubmit = async () => {
    try {
      const isValid = checkFields();
      if (!isValid) return;
      const payload = {
        generateId: experienceType,
      };
      const res = await apiPost(pathObj.employeeSlip, payload);
      if (res.data.success === true) {
        Helpers.downloadFile(res?.data?.results?.file_path);
      } else {
        notification.error(res?.data?.message);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const openProfileSidebar = () => {
    if (document.body) {
      let element = document.body;
      const classesToToggle = "remover-sidebar";
      element.classList.toggle(classesToToggle);
    }
  };

  useEffect(() => {
    applyJobApi();
  }, []);
  return (
    <section className="profile_main_wrap">
      <Container>
        <div className="account_row">
          <ProfileSidebar />

          <div className="account_content_right">
            <button className="open_sidebar_mobile" onClick={openProfileSidebar}>
              <BiMenuAltRight />
            </button>
            <Breadcrumb className="">
              <Breadcrumb.Item href="#">
                <Image src="/images/home.svg" width={15} height={14} alt="" />
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Pay Slip</Breadcrumb.Item>
            </Breadcrumb>

            <div className="dashboard_page">
              <Row>
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Select Duration
                      <RedStar />
                    </Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      value={experienceType}
                      onChange={(e) => {
                        statusPage(e);
                        if (e) {
                          setExperienceError(false);
                        }
                      }}
                    >
                      <option value="">Please select duration</option>
                      {dateValues?.map((data, index) => {
                        return data?.status == "paid" ? (
                          <option key={index} value={data?._id}>
                            {dayjs(data?.fromDate).format("MM-DD-YYYY")} - {dayjs(data?.toDate).format("MM-DD-YYYY")}
                          </option>
                        ) : (
                          ""
                        );
                      })}
                    </Form.Select>
                    {experienceError && <ErrorMessage message="Please select duration." />}
                  </Form.Group>
                  <div className="text-center">
                    {" "}
                    <Button onClick={handleSubmit} type="button" className="theme_lg_btn text-decoration-none category-btn w-100">
                      Download Slip
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
export default PaySlip;
