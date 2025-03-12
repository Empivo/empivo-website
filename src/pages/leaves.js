import React, { useState, useEffect, useContext } from "react";
import { Container, Breadcrumb, Row, Col, Button, Form, Table, Modal } from "react-bootstrap";
import ProfileSidebar from "./components/ProfileSidebar";
import Image from "next/image";
import dayjs from "dayjs";
import apiPath from "../utils/pathObj";
import { apiPost, apiPut } from "../utils/apiFetch";
import { isEmpty, startCase } from "lodash";
import ErrorMessage from "@/pages/components/ErrorMessage";
import ODateRangePicker from "./components/common/ODateRangePicker";
import classNames from "classnames";
import AuthContext from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import useToastContext from "@/hooks/useToastContext";
import Helpers from "@/utils/helpers";
import { preventMaxInput } from "@/utils/constants";
import { BiMenuAltRight } from "react-icons/bi";

function Leaves() {
  const [page, setPage] = useState(1);
  const { leavesData, filterData, setFilterData, leaveList, pagination, applyJobApi } = useContext(AuthContext);
  const [applyJob, setApplyJob] = useState("");
  const [type, setType] = useState("fullDay");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [totalDay, setTotalDay] = useState(0);
  const [currentItem, setCurrentItem] = useState("");
  const [jobsView, setJobsView] = useState(false);
  const notification = useToastContext();
  const [isLoader, setIsLoader] = useState(false);
  const [dateErrors, setDateErrors] = useState({
    startDate: "",
    endDate: "",
  });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const loadMore = () => {
    setPage(page + 1);
    leaveList(page + 1);
  };

  const handleViewMore = (item) => {
    setCurrentItem(item);
    setJobsView(!jobsView);
  };

  const withdraw = async (id) => {
    try {
      const path = `${apiPath.withdrawList}/${id}`;
      const result = await apiPut(path, {});
      if (result?.status === 200) {
        notification.success(result.data.message);
        leaveList();
      } else {
        notification.success(result.data.message);
      }
    } catch (error) {
      console.log("error in get all leaves list==>>>>", error.message);
    }
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
  const handleDateChangeAdd = (start, end) => {
    setFromDate(start);
    setToDate(end);
  };
  const totalDays = () => {
    if (type == "halfDay") {
      setTotalDay(0.5);
    } else {
      const parsedDate1 = new Date(fromDate);
      const parsedDate2 = new Date(toDate);

      const timeDifference = parsedDate2 - parsedDate1;

      const difference = timeDifference / (1000 * 60 * 60 * 24) + 1;
      if (fromDate && toDate) {
        setTotalDay(difference);
      } else {
        setTotalDay(0);
      }
    }
  };
  const validateFunc = () => {
    if (!fromDate && !toDate) {
      setDateErrors({
        startDate: "Please select from date.",
        endDate: "Please select to date.",
      });
      return false;
    }
    if (!fromDate) {
      setDateErrors({
        ...dateErrors,
        startDate: "Please select from date.",
      });
      return false;
    } else {
      setDateErrors({
        ...dateErrors,
        startDate: "",
      });
    }
    if (!toDate) {
      if (type == "fullDay") {
        setDateErrors({
          ...dateErrors,
          endDate: "Please select to date.",
        });
        return false;
      }
    } else {
      setDateErrors({
        ...dateErrors,
        endDate: "",
      });
    }
    setDateErrors({});
    return true;
  };
  const handleView = (item) => {
    setCurrentItem(item);
    setApplyJob(!applyJob);
    reset();
  };

  const handleClose = () => {
    setApplyJob(false);
    setTotalDay(0);
    setToDate(null);
    setFromDate(null);
    setType("fullDay");
    leaveList();
  };
  const handleCloseMore = () => {
    setJobsView(false);
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

  const onSubmit = async (data) => {
    setIsLoader(true);
    const isValid = validateFunc();
    if (!isValid) return;
    try {
      fromDate.setDate(fromDate.getDate() + 1);
      if (toDate) {
        toDate.setDate(toDate.getDate() + 1);
        const formattedToDate = toDate.toISOString().split("T")[0];
        data.toDate = formattedToDate;
      }
      const formattedFromDate = fromDate.toISOString().split("T")[0];
      data.leaveType = type;
      data.fromDate = formattedFromDate;
      if (type == "halfDay") {
        data.toDate = formattedFromDate;
      }
      let res = await apiPost(apiPath.applyLeave, data);
      if (res.data.success === true) {
        setApplyJob(false);
        setTotalDay(0);
        setToDate(null);
        setFromDate(null);
        setType("fullDay");
        setValue("reason", "");
        leaveList();
        notification.success(res?.data?.message);
        setApplyJob(false);
        setIsLoader(false);
      } else {
        setIsLoader(false);
        notification.error(res?.data?.message);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    leaveList();
  }, [filterData?.isReset]);

  useEffect(() => {
    if (dateErrors.startDate || dateErrors.endDate) {
      validateFunc();
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    totalDays();
  }, [fromDate, toDate, type]);

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
              <Breadcrumb.Item active>Leaves</Breadcrumb.Item>
            </Breadcrumb>
            <div className="job_applied">
              <Form className="job_filter mobile_align_fix">
                <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
                <div className="filter_action mb-3 ">
                  <Button className="py-1 px-4 outline_blue_btn rounded_5 withdraw-focus" onClick={handleReset} type="button">
                    Clear
                  </Button>
                  <Button className="py-1 px-4 theme_blue_btn rounded_5 withdraw-focus" onClick={() => leaveList()}>
                    Apply
                  </Button>
                  <Button className="py-1 px-4 theme_blue_btn rounded_5 withdraw-focus" onClick={() => handleView()}>
                    Apply New Leave
                  </Button>
                </div>
              </Form>

              <Table responsive className="theme_lg_table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Total Days</th>
                    <th>Reason</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leavesData?.length > 0 &&
                    leavesData?.map((item, index) => {
                      return (
                        <>
                          <tr>
                            <td>
                              <div className="job_company_info" key={index}>
                                {index + 1 + 10 * (page - 1)}
                              </div>
                            </td>
                            <td>{dayjs(item?.fromDate).format("MM-DD-YYYY")}</td>
                            <td>{dayjs(item?.toDate).format("MM-DD-YYYY")}</td>
                            <td>{item?.noOfDays}</td>
                            <td>
                              {item?.reason.split(" ").slice(0, 1).join(" ")}
                              .... &nbsp;{" "}
                              <span title="View more" className="text-green-600 cursor-pointer" onClick={() => handleViewMore(item)}>
                                {"view more"}
                              </span>
                            </td>
                            <td>{startCase(item?.leaveType)} </td>
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
                                {startCase(item.status)}{" "}
                              </span>
                            </td>
                            <td className="text-center">
                              {item.status === "pending" ? (
                                <span className="cursor-pointer">
                                  <Button className="py-1 px-4 theme_blue_btn rounded_5 withdraw-focus" onClick={() => Helpers.alertFunction(`Are you sure you want to withdraw leave`, item._id, withdraw)}>
                                    Withdraw
                                  </Button>
                                </span>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>{" "}
                        </>
                      );
                    })}
                  {isEmpty(leavesData) ? (
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
      <Modal show={applyJob} onHide={handleClose} centered className="agent-modal view-info-modal">
        <Modal.Header className="d-flex justify-content-center" closeButton>
          <Modal.Title>Apply New Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="job_listing_main">
            <div className="jobs_list">
              <div className="detail_body">
                <Row className="">
                  <Col md={8}>
                    <Row>
                      <Col lg={12} md={6}>
                        <div className="theme-form-group d-block mb-2">
                          <Form.Label>Type</Form.Label>

                          <Form.Select className="floating_select_left_space border border border-bottom-none rounded" aria-label="Floating label select example " onChange={(e) => setType(e.target.value)}>
                            <option value="fullDay">Full Day</option>
                            <option value="halfDay">Half Day</option>
                          </Form.Select>
                        </div>
                      </Col>
                      <Col sm="12">
                        <div className="detail_box mb-3">
                          <ODateRangePicker handleDateChange={handleDateChangeAdd} errors={dateErrors} type="apply-leave" isDisabled={type == "halfDay" ? true : false} minDate={true} />
                        </div>
                      </Col>
                      <Col sm="12">
                        <div className="detail_box d-block mt-0">
                          <label className="mb-2">Reason </label>
                          <Form.Control
                            as="textarea"
                            className="w-100"
                            style={{ height: "100px" }}
                            onInput={(e) => preventMaxInput(e, 200)}
                            {...register("reason", {
                              required: {
                                value: true,
                                message: "Please enter reason.",
                              },
                              validate: (value) => {
                                const words = value.trim().split(" ");
                                return words.length <= 9 ? "Reason should contains at least 10 words." : words.length <= 199 ? true : "Reason should not exceed 200 words.";
                              },
                            })}
                          />
                          <ErrorMessage message={errors?.reason?.message} />
                        </div>
                      </Col>
                      <button
                        disabled={isLoader}
                        className="btn theme_md_btn text-white"
                        onClick={handleSubmit(onSubmit, () => {
                          const isValid = validateFunc();
                          if (!isValid) return;
                        })}
                      >
                        {" "}
                        Submit
                      </button>
                    </Row>
                  </Col>
                  <Col md={4}>
                    <div className="text-center text-black border-start ms-3 mt-5">
                      <h4>Total Days</h4>
                      <span className="fs-4">{totalDay}</span>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={jobsView} onHide={handleCloseMore} centered className="agent-modal view-info-modal">
        <Modal.Header className="d-flex justify-content-center" closeButton>
          <Modal.Title>View reason</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="job_listing_main">
            <div className="jobs_list">
              <div className="detail_body">{currentItem?.reason}</div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
}

export default Leaves;
