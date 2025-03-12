import { useState, useEffect, useContext } from "react";
import { Container, Breadcrumb, Card, Modal, Button, Row, Col, Table } from "react-bootstrap";
import ProfileSidebar from "./components/ProfileSidebar";
import Image from "next/image";
import { startCase } from "lodash";
import { useRouter } from "next/router";
import { BsEyeFill } from "react-icons/bs";
import { BiSolidPencil, BiMenuAltRight } from "react-icons/bi";
import dayjs from "dayjs";
import AuthContext from "@/context/AuthContext";
import FormComponent from "@/component/shared/Forms/FormComponent";
import { formCategory } from "@/utils/constants";
import classNames from "classnames";

const Forms = () => {
  const router = useRouter();
  const { applyJobApi, applyJobsData, setCurrentItem, currentFormItem, formList, formLists, isFromMobileApps } = useContext(AuthContext);
  const [formsDetail, setFormsDetail] = useState({});
  const [indexForm, setIndexForm] = useState(0);
  const [open] = useState(false);

  const handleNextButton = () => {
    if (formsDetail?.assignedForms?.length > currentFormItem?.indexForm + 1)
      setCurrentItem({
        ...currentFormItem,
        data: {},
        indexForm: currentFormItem?.indexForm + 1,
      });
  };

  const handlePrevButton = () => {
    setCurrentItem({
      ...currentFormItem,
      data: {},
      indexForm: currentFormItem?.indexForm - 1,
    });
  };

  const handleView = (item, i) => {
    const payload = {
      data: {},
      formCategoryType: item?.formType,
      view: true,
      edit: false,
      indexForm: i,
      formLength: formsDetail?.assignedForms?.length,
    };
    setCurrentItem(payload);
    if (typeof window !== undefined) console.log("JSON.stringify(payload)", JSON.stringify(payload));
    localStorage["currentItem"] = JSON.stringify(payload);
    router.push(`/view/${item?.formType}`);
  };

  const handleEdit = (item, i) => {
    const payload = {
      data: {},
      formCategoryType: item?.formType,
      edit: true,
      view: false,
      indexForm: i,
      formLength: formsDetail?.assignedForms?.length,
    };
    setCurrentItem(payload);
    if (typeof window !== undefined) localStorage.setItem("currentItem", JSON.stringify(payload));
    router.push(`/edit/${item?.formType}`);
  };

  const formTitle = (title) => formCategory.find((item) => item.formType === title)?.title;

  useEffect(() => {
    formList();
    applyJobApi();
  }, []);

  useEffect(() => {
    const allForm = applyJobsData.find((item) => item.status === "accepted");
    setFormsDetail(allForm);
    setCurrentItem({
      ...currentFormItem,
      formLength: allForm?.assignedForms?.length,
    });
  }, [applyJobsData]);

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

            {formLists?.fillForms?.length === formsDetail?.assignedForms?.length ? (
              <div className="p-4 px-0 my-account-form overflow-hidden">
                <div className="d-sm-flex justify-content-between text-dark mb-5">
                  <div>
                    <div className="me-4 fw-bold">Forms Submitted Date: {dayjs(applyJobsData[indexForm]?.createdAt).format("MM-DD-YYYY h:mm A")}</div>
                    <div className="fw-bold">
                      Forms {startCase(applyJobsData[indexForm]?.formStatus)} Date: {applyJobsData[indexForm]?.acceptedRejectedAt ? dayjs(applyJobsData[indexForm]?.acceptedRejectedAt).format("MM-DD-YYYY h:mm A") : "N/A"}
                    </div>
                  </div>
                  <div className="mt-3 mt-sm-0">
                    <div>
                      <strong>Status : </strong>
                      <span
                        className={classNames({
                          "text-green": applyJobsData[indexForm]?.formStatus === "accepted",
                          "text-black": applyJobsData[indexForm]?.formStatus === "pending",
                          "text-danger": applyJobsData[indexForm]?.formStatus === "reassigned",
                        })}
                      >
                        {startCase(applyJobsData[indexForm]?.formStatus)}
                      </span>
                    </div>
                  </div>
                </div>
                <Row className="gx-5 mb-4">
                  <Col xxl={6} md={12} className="mb-3">
                    <div>
                      <h6 className="mb-3">
                        <strong className="text-dark">Forms</strong>
                      </h6>

                      <Table bordered className="mb-2 align-middle">
                        <thead>
                          <tr>
                            <th className="p-3">S.No</th>
                            <th className="p-3">Form Title</th>
                            <th className="p-3 text-end">Action Item</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formLists?.fillForms &&
                            formLists?.fillForms?.length > 0 &&
                            formLists?.fillForms?.map((item, i) => {
                              return (
                                <tr key={i}>
                                  <td className="p-3 py-1">{i + 1} </td>
                                  <td className="p-3 py-1">{formTitle(item?.formType)}</td>
                                  <td className="p-3 py-1 text-end">
                                    <button className="as_link text-dark p-2 fs-4">
                                      <BsEyeFill onClick={() => handleView(item, i)} />
                                    </button>
                                    {applyJobsData[indexForm]?.formStatus === "reassigned" &&
                                    formLists?.reassignComment?.formReassignComment?.length > 0 &&
                                    new Date(new Date(formLists?.reassignComment?.updatedAt).setMinutes(new Date(formLists?.reassignComment?.updatedAt).getMinutes() + formLists?.hrHour?.allowedHrs)) > new Date() ? (
                                      <button className="as_link text-dark p-2 fs-4">
                                        <BiSolidPencil onClick={() => handleEdit(item, i)} />
                                      </button>
                                    ) : (
                                      new Date(new Date(item?.createdAt).setMinutes(new Date(item?.createdAt).getMinutes() + formLists?.hrHour?.allowedHrs)) > new Date() && (
                                        <button className="as_link text-dark p-2 fs-4">
                                          <BiSolidPencil onClick={() => handleEdit(item, i)} />
                                        </button>
                                      )
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
                {formLists?.reassignComment?.formReassignComment?.length > 0 && (
                  <Row>
                    <Col md={8}>
                      <div>
                        <h6 className="mb-3">
                          <strong className="text-dark">HR Feedback</strong>
                        </h6>

                        <div className="mb-4">
                          <div className="mb-3 text-end">
                            <strong>Date: </strong> {formLists?.reassignComment?.updatedAt ? dayjs(formLists?.reassignComment?.updatedAt).format("MM-DD-YYYY h:mm A") : "N/A"}
                          </div>
                          <ol>
                            <li>{formLists?.reassignComment?.formReassignComment}</li>
                          </ol>
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            ) : (
              <div className="p-4 px-0 my-account-form">
                <Card className="border-0 blog-detail-card">
                  <Card.Body className="pb-sm-4">
                    {formsDetail?.assignedForms && formsDetail?.assignedForms[currentFormItem?.indexForm] && (
                      <FormComponent
                        formCategoryType={formsDetail?.assignedForms[currentFormItem?.indexForm]}
                        handleNextButton={handleNextButton}
                        handlePrevButton={handlePrevButton}
                        formLength={formsDetail?.assignedForms?.length}
                        formList={formList}
                        formLists={formLists?.fillForms}
                        indexForm={indexForm}
                        setIndexForm={setIndexForm}
                      />
                    )}
                  </Card.Body>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Container>
      <Modal show={open} centered className="agent-modal view-info-modal">
        <Modal.Header className="d-flex justify-content-center" closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="success_modal">
            <figure className="success_tic">
              <Image src="/images/success.svg" width={56} height={56} alt="" />
            </figure>
            <figcaption>
              <p>The forms has been submitted successfully. The company will review and approve the forms.</p>
              <Button className="theme_md_blue_btn mt-3">OK</Button>
            </figcaption>
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Forms;
