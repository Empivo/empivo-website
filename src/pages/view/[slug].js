import React, { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { Container, Breadcrumb, Card } from "react-bootstrap";
import ProfileSidebar from "@/pages/components/ProfileSidebar";
import FormComponent from "@/component/shared/Forms/FormComponent";
import Image from "next/image";
import { BiMenuAltRight } from "react-icons/bi";

const ViewSlug = () => {
  const { currentFormItem, isFromMobileApps } = useContext(AuthContext);

  const openProfileSidebar = () => {
    if (document.body) {
      let element = document.body;
      const classesToToggle = "remover-sidebar";
      element.classList.toggle(classesToToggle);
    }
  };

  return (
    <section className="profile_main_wrap">
      <Container>
        <div className="account_row">
          <ProfileSidebar />
          <div className="account_content_right">
            {isFromMobileApps ? (
              ""
            ) : (
              <button className="open_sidebar_mobile" onClick={openProfileSidebar}>
                <BiMenuAltRight />
              </button>
            )}
            <Breadcrumb className="">
              <Breadcrumb.Item href="#">
                <Image src="/images/home.svg" width={15} height={14} alt="" />
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Forms</Breadcrumb.Item>
            </Breadcrumb>
            <div className="p-4 px-0 my-account-form">
              <Card className="border-0 blog-detail-card">
                <Card.Body className="pb-sm-4">
                  <FormComponent formCategoryType={currentFormItem?.formCategoryType} />
                </Card.Body>
              </Card>
            </div>{" "}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ViewSlug;
