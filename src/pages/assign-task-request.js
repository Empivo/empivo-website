import React, { useState, useEffect, useContext } from "react";
import { Container, Breadcrumb, Card, Button, Row, Col, Modal } from "react-bootstrap";
import ProfileSidebar from "./components/ProfileSidebar";
import Image from "next/image";
import apiPath from "../utils/pathObj";
import { apiGet, apiPost } from "../utils/apiFetch";
import { useRouter } from "next/router";
import { BiMenuAltRight } from "react-icons/bi";
import dayjs from "dayjs";
import Helpers from "@/utils/helpers";
import { isEmpty, startCase } from "lodash";
import { AiOutlineDownload } from "react-icons/ai";
import { saveAs } from "file-saver";
import useToastContext from "@/hooks/useToastContext";
import AuthContext from "@/context/AuthContext";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuFileX } from "react-icons/lu";

function AssignTaskRequest() {
  const router = useRouter();
  const { applyJobApi } = useContext(AuthContext);
  const notification = useToastContext();
  const [pagination, setPagination] = useState();
  const [page, setPage] = useState(1);
  const [taskData, setTaskData] = useState([]);
  const [jobView, setJobView] = useState("");
  const [currentItem, setCurrentItem] = useState("");
  const [fileView, setFileView] = useState("");

  const assignTaskRequestList = async () => {
    try {
      let payload = {
        page: page || 1,
      };
      var path = apiPath.assignTaskRequestList;
      const result = await apiGet(path, payload);
      var response = result?.data?.results;
      if (page > 1) {
        if (taskData.length <= page * 10) setTaskData([...taskData, ...response?.docs]);
      } else setTaskData(response?.docs);
      setPagination(response);
    } catch (error) {
      console.log("error in get all task list11==>>>>", error.message);
    }
  };

  useEffect(() => {
    assignTaskRequestList();
  }, [page]);

  const loadMore = () => {
    setPage(page + 1);
  };

  const openProfileSidebar = () => {
    if (document.body) {
      let element = document.body;
      const classesToToggle = "remover-sidebar";
      element.classList.toggle(classesToToggle);
    }
  };
  const changeStatus = async (item) => {
    try {
      const payload = {
        status: item?.status,
        taskId: item?._id,
        type: item?.type,
      };
      const path = apiPath.ChangeTaskRequest;
      const result = await apiPost(path, payload);
      if (result?.data?.success) {
        notification.success(result.data.message);
        router.push("/employee-tasks-scheduling");
      } else {
        notification.error(result?.data?.message);
      }
    } catch (error) {
      console.error("error in get all task list22==>>>>", error);
    }
  };

  const handleView = (item) => {
    setCurrentItem(item);
    setJobView(!jobView);
  };

  const handleFile = (element) => {
    setCurrentItem(element);
    setFileView(!fileView);
  };

  const handleClose = () => {
    setJobView(false);
  };

  const handleCloseFile = () => {
    setFileView(false);
  };

  const downloadFile = (val) => {
    saveAs(val, "documents.pdf");
  };

  const downloadEmployeeFile = (val) => {
    saveAs(val, "endTaskDocuments.pdf");
  };

  const downloadDocuments = (values) => {
    saveAs(values, "documents.pdf");
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
              <Breadcrumb.Item active>Assign task request</Breadcrumb.Item>
            </Breadcrumb>

            <div className="job_applied p-2">
              <Row>
                {taskData?.length > 0 &&
                  taskData?.map((item, index) => {
                    return (
                      <>
                        <Col xl={6} md={12} className="position-relative mb-3 d-flex">
                          <Card className="p-3 w-100 d-flex flex-column justify-content-between bg-light ">
                            <div>
                              <div className="d-flex px-3 align-items-center justify-content-end position-absolute end-0 top-0">
                                <span>Attached file</span>
                                {item?.documents && item?.documents?.length > 0 ? (
                                  <>
                                    <div className="item object-cover w-24 h-24 overflow-hidden  m-2" key={index}>
                                      <IoDocumentTextOutline className="cursor-pointer fs-3" onClick={() => handleFile(item)} />
                                    </div>
                                  </>
                                ) : (
                                  <Image src={"/images/no_file_found.png"} alt="" className="w-16 h-16 rounded-full" width={32} height={32} />
                                )}
                              </div>
                              <div className="d-flex mt-3">
                                <Card.Body className="px-0">
                                  <Card.Text className="mb-3">
                                    <strong className="d-block">Task name:</strong> {item?.name}
                                  </Card.Text>
                                  <Card.Text className="mb-3">
                                    <strong className="d-block">Task description:</strong> {item?.description}
                                  </Card.Text>
                                  <Card.Text className="mb-3">
                                    <strong className="d-block">Start date/ time:</strong> {dayjs(item?.startDateTime).format("MM-DD-YYYY h:mm A")}
                                  </Card.Text>
                                  <Card.Text className="mb-3">
                                    <strong className="d-block">End date/ time:</strong> {dayjs(item?.endDateTime).format("MM-DD-YYYY h:mm A")}
                                  </Card.Text>
                                  <Card.Text>
                                    <strong className="d-block">Task address:</strong> {item?.address}
                                  </Card.Text>
                                </Card.Body>
                              </div>
                            </div>

                            <div className="">
                              <Card.Text className="ps-4 text-success">Tag: {startCase(item?.tags)}</Card.Text>
                              <div className="d-flex justify-content-between accept-reject-sec">
                                <Button
                                  className="py-1 px-4 theme_blue_btn"
                                  variant="primary"
                                  onClick={() =>
                                    Helpers.alertFunction(
                                      "Are you sure you want to accept Task Request?",
                                      {
                                        _id: item?._id,
                                        status: "accepted",
                                        type: item?.collaboratedEmployeeId === null ? "employee" : "collaborator",
                                      },
                                      changeStatus
                                    )
                                  }
                                >
                                  Accept
                                </Button>
                                <Button
                                  className="py-1 px-4 theme_blue_btn"
                                  variant="primary"
                                  onClick={() =>
                                    Helpers.alertFunction(
                                      "Are you sure you want to reject Task Request?",
                                      {
                                        _id: item?._id,
                                        status: "rejected",
                                        type: item?.collaboratedEmployeeId === null ? "employee" : "collaborator",
                                      },
                                      changeStatus
                                    )
                                  }
                                >
                                  Reject
                                </Button>
                                <Button variant="primary" onClick={() => handleView(item)} className="theme_blue_btn">
                                  View detail
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </Col>
                      </>
                    );
                  })}
              </Row>

              {isEmpty(taskData) ? (
                <div className="bg-white d-flex border-b align-center justify-content-center">
                  <span className="py-4 px-6 border-r">No record found</span>
                </div>
              ) : null}
              {pagination?.hasNextPage && page <= pagination?.page && (
                <div className="text-center pt-3 pt-md-5">
                  <button className="theme_lg_btn text-decoration-none subscription-btn" onClick={() => loadMore()}>
                    {" "}
                    Load more
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
      <Modal show={jobView} onHide={handleClose} centered className="agent-modal view-info-modal emp-task-modal">
        <Modal.Header className="d-flex justify-content-center" closeButton>
          <Modal.Title>View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="job_listing_main">
            <div className="jobs_list">
              <div className="detail_body">
                <Row>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Task name</span>
                        <strong className="d-block text-black fw-normal">{currentItem?.name}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Task address </span>
                        <strong className="d-block text-black fw-normal">{currentItem?.address}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Task description</span>
                        <strong className="d-block text-black fw-normal">{currentItem?.description}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Select start date/ time</span>
                        <strong className="d-block text-black fw-normal">{dayjs(currentItem?.startDateTime).format("MM-DD-YYYY h:mm A")}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Select end date/ time</span>
                        <strong className="d-block text-black fw-normal">{dayjs(currentItem?.endDateTime).format("MM-DD-YYYY h:mm A")}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Task state</span>
                        <strong className="d-block text-black fw-normal">{startCase(currentItem?.state)}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Tags</span>
                        <strong className="d-block text-black fw-normal">{startCase(currentItem?.tags)}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Total time spender on the task</span>
                        <strong className="d-block text-black fw-normal">{Helpers.calculateTotalBreakTime(currentItem?.timeLogs)}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Employee task started date/ time</span>
                        <strong className="d-block text-black fw-normal">{currentItem?.timeLogs ? dayjs(currentItem?.timeLogs?.[0]?.startTime).format("MM-DD-YYYY h:mm A") : "N/A"}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Employee task end date/ time</span>
                        <strong className="d-block text-black fw-normal">{currentItem?.taskEndDateTime ? dayjs(currentItem?.taskEndDateTime).format("MM-DD-YYYY h:mm A") : "N/A"}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="12">
                    <div className="detail_box d-block">
                      <figcaption>
                        <span className="text-gray">Assign task document</span>
                        <Row className="">
                          {currentItem?.documents && currentItem?.documents?.length > 0 ? (
                            currentItem?.documents?.map((val, index) => (
                              <Col sm={4} key={index} className="me-2 border d-flex align-items-center rounded p-2 justify-content-between mt-3">
                                <div className="item object-cover w-24 h-24 overflow-hidden  m-2">
                                  <IoDocumentTextOutline className="fs-2" />
                                </div>
                                <button title="Download" onClick={() => downloadFile(val)} type="button" className="btn border rounded border-dark">
                                  <AiOutlineDownload style={{ width: "15px", fontWeight: 800 }} />
                                </button>
                              </Col>
                            ))
                          ) : (
                            <Image src={"/images/no_file_found.png"} alt="" className="w-16 h-16 rounded-full" width={32} height={32} />
                          )}
                        </Row>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="12">
                    <div className="detail_box d-block">
                      <figcaption>
                        <span className="text-gray">Upload employee task document</span>
                        <Row className="">
                          {currentItem?.endTaskDocuments && currentItem?.endTaskDocuments?.length > 0 ? (
                            currentItem?.endTaskDocuments?.map((val, index) => (
                              <Col sm={4} key={index} className="me-2 border d-flex align-items-center rounded p-2 justify-content-between mt-3">
                                <div className="item object-cover w-24 h-24 overflow-hidden  m-2">
                                  <IoDocumentTextOutline className="fs-2" />
                                </div>
                                <button title="Download" onClick={() => downloadEmployeeFile(val)} type="button" className="btn border rounded border-dark">
                                  <AiOutlineDownload style={{ width: "15px", fontWeight: 800 }} />
                                </button>
                              </Col>
                            ))
                          ) : (
                            <div className="item object-cover w-24 h-24 overflow-hidden  m-2">
                              <LuFileX className="fs-2" />
                            </div>
                          )}
                        </Row>
                      </figcaption>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={fileView} onHide={handleCloseFile} centered className="agent-modal view-info-modal ">
        <Modal.Header className="d-flex justify-content-center" closeButton>
          <Modal.Title>Document files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="job_listing_main">
            <div className="jobs_list">
              <div className="detail_body">
                <Row>
                  <Col sm="12">
                    <div className="">
                      <Row>
                        {currentItem?.documents && currentItem?.documents?.length > 0 ? (
                          currentItem?.documents?.map((values, index) => (
                            <Col sm={4} xs={6} key={index} className="mb-3">
                              <div className="border p-3 d-flex align-items-center justify-content-between rounded">
                                <div className="item object-cover w-24 h-24 overflow-hidden  m-2">
                                  <IoDocumentTextOutline className="fs-2" />
                                </div>
                                <button title="Download" onClick={() => downloadDocuments(values)} type="button" className="btn border rounded border-dark">
                                  <AiOutlineDownload style={{ width: "15px", fontWeight: 800 }} />
                                </button>
                              </div>
                            </Col>
                          ))
                        ) : (
                          <Image src={"/images/no_file_found.png"} alt="" className="w-16 h-16 rounded-full" width={32} height={32} />
                        )}
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
}

export default AssignTaskRequest;
