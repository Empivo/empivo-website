import React, { useState, useEffect, useContext } from "react";
import { Container, Breadcrumb, Row, Col, Button, Form, Table, Modal, Figure } from "react-bootstrap";
import ProfileSidebar from "./components/ProfileSidebar";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { isEmpty, startCase } from "lodash";
import { useRouter } from "next/router";
import ODateRangePicker from "./components/common/ODateRangePicker";
import classNames from "classnames";
import user from "../images/user.png";
import AuthContext from "@/context/AuthContext";
import { BiMenuAltRight } from "react-icons/bi";

function JobApplied() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { applyJobsData, filterData, setFilterData, applyJobList, pagination, setIsActive } = useContext(AuthContext);
  const [jobView, setJobView] = useState("");
  const [jobViewDetail, setJobViewDetail] = useState("");
  const [currentItem, setCurrentItem] = useState("");
  const [currentItemJob, setCurrentItemJob] = useState("");

  const loadMore = () => {
    setPage(page + 1);
    applyJobList(page + 1);
  };

  const handleDateChange = (start, end) => {
    setPage(1);
    setFilterData({
      ...filterData,
      startDate: start,
      endDate: end,
      isFilter: true,
    });
  };

  const handleView = (item) => {
    setCurrentItem(item);
    setJobView(!jobView);
  };

  const handleViewJob = (item) => {
    setCurrentItemJob(item);
    setJobViewDetail(!jobViewDetail);
  };

  const handleClose = () => {
    setJobView(false);
  };
  const handleCloseJob = () => {
    setJobViewDetail(false);
  };

  const handleReset = () => {
    setFilterData({
      isReset: true,
      isFilter: false,
      startDate: "",
      endDate: "",
    });
    setPage(1);
  };
  const openProfileSidebar = () => {
    if (document.body) {
      let element = document.body;
      const classesToToggle = "remover-sidebar";
      element.classList.toggle(classesToToggle);
    }
  };
  useEffect(() => {
    applyJobList();
  }, [filterData]);

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
              <Breadcrumb.Item active>Job Applied</Breadcrumb.Item>
            </Breadcrumb>
            <div className="job_applied">
              {applyJobsData?.map((applyJobs) =>
                applyJobs?.status == "accepted" ? (
                  <>
                    <div className="job_applide_row position-relative">
                      <figure>
                        <Image src={applyJobs?.CompanyLogo} width={40} height={40} alt="" />
                      </figure>
                      <figcaption>
                        <ul>
                          <li>
                            <strong>Company Name </strong>
                            <span>{applyJobs?.Company?.name}</span>
                          </li>

                          <li>
                            <strong>Country/City</strong>
                            <span> {applyJobs?.JobCountry?.name + ", " + applyJobs?.JobCity?.name}</span>
                          </li>

                          <li>
                            <strong>Department</strong>
                            <span>{applyJobs?.Department?.name}</span>
                          </li>

                          <li>
                            <strong>Applied Date</strong>
                            <span> {dayjs(applyJobs?.createdAt).format("MM-DD-YYYY h:mm A")}</span>
                          </li>

                          <li>
                            <strong>Category </strong>
                            <span> {applyJobs?.Category?.name}</span>
                          </li>

                          <li>
                            <strong>Subcategory </strong>
                            <span>{applyJobs?.subCategory?.name}</span>
                          </li>

                          <li>
                            <strong>Status</strong>
                            <span className="text-green">{startCase(applyJobs?.status)}</span>
                          </li>
                          <li>
                            <strong>Form Status</strong>
                            <span
                              className={classNames({
                                "text-green": applyJobs?.formStatus === "accepted",
                                "text-danger": applyJobs?.formStatus === "pending",
                              })}
                            >
                              {startCase(applyJobs?.formStatus)}
                            </span>
                          </li>

                          <li>
                            <Button
                              className="theme_lg_btn  btn btn-primary bg-orange px-3 w-100 w-sm-auto"
                              onClick={() => {
                                setIsActive("forms");
                                router.push("/forms");
                              }}
                            >
                              View Forms
                            </Button>
                          </li>
                        </ul>
                      </figcaption>
                      <Button className="bg-transparent border-0 p-0  view-job-icon">
                        <Image onClick={() => handleViewJob(applyJobs)} src="/images/eye.svg" width={16} height={13} alt="" />
                      </Button>
                    </div>
                  </>
                ) : (
                  ""
                )
              )}

              <Form className="job_filter mobile_align_fix job_applied_datepicker">
                <div className="d-flex ">
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
                </div>
                <div className="filter_action mb-3">
                  <Button className="py-1 px-4 outline_blue_btn rounded_5" onClick={handleReset} type="button">
                    Clear
                  </Button>
                  <Button className="py-1 px-4 theme_blue_btn rounded_5" onClick={() => applyJobList()}>
                    Apply
                  </Button>
                </div>
              </Form>

              <Table responsive className="theme_lg_table">
                <thead>
                  <tr>
                    <th>Company Name </th>
                    <th>Country/City</th>
                    <th>Department</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applyJobsData?.length > 0 &&
                    applyJobsData?.map((item, index) => {
                      return (
                        <>
                          {" "}
                          {item.status !== "accepted" && (
                            <>
                              <tr>
                                <td>
                                  <div className="job_company_info" key={index}>
                                    <span>
                                      <Image className="rounded-circle" src={item.CompanyLogo} width={32} height={32} alt="" fallbackSrc="/images/user.png" />
                                    </span>
                                    {item?.Company?.name}
                                  </div>
                                </td>
                                <td>{item?.JobCountry?.name + ", " + item?.JobCity?.name}</td>
                                <td>{item?.Department?.name}</td>
                                <td>{item?.Category?.name}</td>
                                <td>{item?.subCategory?.name} </td>
                                <td>{dayjs(item?.createdAt).format("MM-DD-YYYY h:mm A")}</td>
                                <td>
                                  <span
                                    title={startCase(item.status)}
                                    className={classNames({
                                      "text-green-600": item.status === "accepted",
                                      "text-red-600": item.status === "rejected",
                                      "text-orange-600": item.status === "pending",
                                    })}
                                  >
                                    {" "}
                                    {item.status === "pending" ? startCase(item.status) : ["blocked", "reassigned"].includes(item.formStatus) ? "Rejected" : item?.autoReject ? "Rejected" : "Auto Rejected"}{" "}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="cursor-pointer">
                                    <Image onClick={() => handleView(item)} src="/images/eye.svg" width={16} height={13} alt="" />
                                  </span>
                                </td>
                              </tr>{" "}
                            </>
                          )}
                        </>
                      );
                    })}
                  {isEmpty(applyJobsData) ? (
                    <tr className="bg-white border-b text-center dark:bg-gray-800 dark:border-gray-700">
                      <td className="py-4 px-6 border-r" colSpan={8}>
                        No record found
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </Table>
            </div>
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
      </Container>
      <Modal show={jobView} onHide={handleClose} centered className="agent-modal view-info-modal">
        <Modal.Header className="d-flex justify-content-center" closeButton>
          <Modal.Title>View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="job_listing_main">
            <div className="jobs_list">
              <div className="job_list_head d-flex justify-content-between align-items-center">
                <div className="company_info_left d-flex align-items-center">
                  <Figure className="mb-0">
                    <Image src={currentItem?.CompanyLogo || user} width={52} height={52} alt="" />
                  </Figure>

                  <figcaption>
                    <h3 className="text-md mb-1">
                      <Link href="#" className="text-link text-black text-md">
                        {currentItem?.Company?.name}
                      </Link>
                    </h3>
                  </figcaption>
                </div>
              </div>
              <div className="detail_body">
                <Row>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Category</span>
                        <strong className="d-block text-black fw-normal">{currentItem?.Category?.name}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Sub Category </span>
                        <strong className="d-block text-black fw-normal">{currentItem?.subCategory?.name}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Department</span>
                        <strong className="d-block text-black fw-normal">{currentItem?.Department?.name}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Country/City</span>
                        <strong className="d-block text-black fw-normal">{currentItem?.JobCountry?.name + ", " + currentItem?.JobCity?.name}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Applied Date</span>
                        <strong className="d-block text-black fw-normal">{dayjs(currentItem?.createdAt).format("MM-DD-YYYY h:mm A")}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Status</span>
                        <strong className="d-block text-black fw-normal">
                          {currentItem.status === "pending" ? startCase(currentItem.status) : ["blocked", "reassigned"].includes(currentItem.formStatus) ? "Rejected" : currentItem?.autoReject ? "Rejected" : "Auto Rejected"}
                        </strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Reason</span>
                        <strong className="d-block text-black fw-normal">{currentItem?.rejectionReason}</strong>
                      </figcaption>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={jobViewDetail} onHide={handleCloseJob} centered className="agent-modal view-info-modal job_modal">
        <Modal.Header className="d-flex justify-content-center" closeButton>
          <Modal.Title>View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="job_listing_main">
            <div className="jobs_list">
              <div className="detail_body">
                <Row>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Job title</span>
                        <strong className="d-block text-black fw-normal">{currentItemJob?.Job?.name}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Category</span>
                        <strong className="d-block text-black fw-normal">{currentItemJob?.Category?.name}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Subcategory </span>
                        <strong className="d-block text-black fw-normal">{currentItemJob?.subCategory?.name}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Department</span>
                        <strong className="d-block text-black fw-normal">{currentItemJob?.Department?.name}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Country, City</span>
                        <strong className="d-block text-black fw-normal">{currentItemJob?.JobCountry?.name + ", " + currentItemJob?.JobCity?.name}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Employment length [In days]</span>
                        <strong className="d-block text-black fw-normal">{currentItemJob?.Job?.employmentLength}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Company name</span>
                        <strong className="d-block text-black fw-normal">{startCase(currentItemJob?.Company?.name)}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Company logo</span>
                        <strong className="d-block text-black fw-normal">
                          <Figure className="mb-0">
                            <Image src={currentItemJob?.CompanyLogo} width={52} height={52} alt="" />
                          </Figure>
                        </strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Company address</span>
                        <strong className="d-block text-black fw-normal">{currentItemJob?.Company?.address}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Skills selected by employee</span>
                        <strong className="d-block text-black fw-normal">{currentItemJob.EmployeeSelectedSkills?.map((item) => item?.name).join(", ") || ""}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Year of experience</span>
                        <strong className="d-block text-black fw-normal">{currentItemJob?.yearOfExperiece}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Job applied date</span>
                        <strong className="d-block text-black fw-normal">{dayjs(currentItemJob?.createdAt).format("MM-DD-YYYY h:mm A")}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Required skills</span>
                        <strong className="d-block text-black fw-normal">{currentItemJob.RequiredSkills?.map((item) => item?.name).join(", ") || ""}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Accepted/rejected/ or auto rejected date</span>
                        <strong className="d-block text-black fw-normal">{dayjs(currentItemJob?.acceptedRejectedAt).format("MM-DD-YYYY h:mm A")}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Status</span>
                        <strong className="d-block text-black fw-normal">{startCase(currentItemJob?.status)}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="12">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Job description</span>
                        <strong className="d-block text-black fw-normal">{currentItemJob?.Job?.description}</strong>
                      </figcaption>
                    </div>
                  </Col>
                  <Col sm="12">
                    <div className="detail_box">
                      <figcaption>
                        <span className="text-gray">Termination conditions</span>
                        <strong className="d-block text-black fw-normal">{currentItemJob?.Job?.terminationCondition}</strong>
                      </figcaption>
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

export default JobApplied;
