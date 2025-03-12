import { useState, useEffect, useContext } from "react";
import { Container, Breadcrumb, Row, Col, Button, Table } from "react-bootstrap";
import ProfileSidebar from "./components/ProfileSidebar";
import Image from "next/image";
import { BsHandIndexThumb, BsArrowRight } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import AuthContext from "@/context/AuthContext";
import { apiPost, apiGet } from "@/utils/apiFetch";
import pathObj from "@/utils/pathObj";
import useToastContext from "@/hooks/useToastContext";
import classNames from "classnames";
import { startCase } from "lodash";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { BiMenuAltRight } from "react-icons/bi";
import Helpers from "@/utils/helpers";

const Dashboard = () => {
  const { applyJobApi, applyJobsData, dateValues } = useContext(AuthContext);
  const notification = useToastContext();
  const [isShowDetail, setIsShowDetail] = useState(true);
  const [punch_In, setPunch_In] = useState(false);
  const [punch_Out, setPunch_Out] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [leaveData, setLeaveData] = useState({});
  const [punchData, setPunchData] = useState({});
  const [salaryEmployee, setSalaryEmployee] = useState({});

  const toggleShowDetail = () => {
    setIsShowDetail(!isShowDetail);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        // Use a geocoding API to get the address from the coordinates
        try {
          const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCyfi1GcGsUisGcHoaRNxTTq2VCoEXb1h8`);
          if (response.data.results.length > 0) {
            const address = response.data.results[8].formatted_address;
            setCurrentAddress(address);
          } else {
            console.error("No address found for the given coordinates.");
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      });
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  };

  const punchIn = async () => {
    try {
      const payload = {
        punchInLocation: currentAddress,
        actionType: "punchIn",
      };
      getCurrentLocation();
      const result = await apiPost(pathObj.biometricPunch, payload);
      if (result?.data?.success) {
        notification.success(result?.data?.message);
        employeeDayPunch();
        setPunch_In(true);
        setPunch_Out(false);
      }
    } catch (error) {}
  };
  const punchOut = async () => {
    try {
      const payload = {
        punchOutLocation: currentAddress,
        actionType: "punchOut",
      };
      getCurrentLocation();
      const result = await apiPost(pathObj.biometricPunch, payload);
      if (result?.data?.success) {
        notification.success(result?.data?.message);
        employeeDayPunch();
        setPunch_Out(true);
      }
    } catch (error) {}
  };
  const startBreakTime = async () => {
    try {
      const payload = {
        actionType: "start",
      };
      const result = await apiPost(pathObj.biometricPunch, payload);
      if (result?.data?.success) {
        notification.success(result?.data?.message);
        employeeDayPunch();
      }
    } catch (error) {}
  };
  const pauseBreakTime = async () => {
    try {
      const payload = {
        actionType: "pause",
      };
      const result = await apiPost(pathObj.biometricPunch, payload);
      if (result?.data?.success) {
        notification.success(result?.data?.message);
        employeeDayPunch();
      }
    } catch (error) {}
  };
  const endBreakTime = async () => {
    try {
      const payload = {
        actionType: "end",
      };
      const result = await apiPost(pathObj.biometricPunch, payload);
      if (result?.data?.success) {
        notification.success(result?.data?.message);
        employeeDayPunch();
      }
    } catch (error) {}
  };
  const employeeDayPunch = async () => {
    try {
      const result = await apiGet(pathObj.employeeDayPunch, {});
      const response = result?.data?.results;
      if (result?.data?.success) {
        setPunchData(response);
        if (result?.data?.results?.punchInDateTime && new Date() > new Date(result?.data?.results?.punchInDateTime)) setPunch_In(true);
        if (!result?.data?.results?.punchOutDateTime) setPunch_Out(false);
        else setPunch_Out(true);
      }
    } catch (error) {}
  };

  const employeeLeave = async () => {
    try {
      const result = await apiGet(pathObj.employeeLeave, {});
      const response = result?.data?.results;
      if (result?.data?.success) {
        setLeaveData(response);
        notification.success(result?.data?.message);
      }
    } catch (error) {}
  };

  const employeeSalary = async () => {
    try {
      const result = await apiGet(pathObj.employeeSalary, {});
      const response = result?.data?.results;
      if (result?.data?.success) {
        setSalaryEmployee(response);
        notification.success(result?.data?.message);
      }
    } catch (error) {}
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
    getCurrentLocation();
  }, []);

  useEffect(() => {
    employeeDayPunch();
    employeeLeave();
    employeeSalary();
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
              <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
            <div className="dashboard_page">
              <Row>
                <Col lg={8}>
                  <div className="dashboard_left_wrap">
                    <div className="punch_area">
                      <div className="punch_time">
                        <h4>Punch Time</h4>
                        <div className="d-flex">
                          <button className={`punch_circle ${punch_In && "punch_circle_disable"}`} type="button" onClick={() => punchIn()} disabled={punch_In}>
                            <BsHandIndexThumb />
                            <span className="d-block">Punch In</span>
                          </button>
                          <button
                            type="button"
                            className={punch_In ? `punch_circle ${punch_In && punch_Out && "punch_circle_disable"}` : `punch_circle punch_circle_disable`}
                            onClick={() => punchOut()}
                            disabled={Helpers.orCondition(!punch_In, punch_Out)}
                          >
                            <BsHandIndexThumb />
                            <span className="d-block">Punch Out</span>
                          </button>
                        </div>
                      </div>
                      <div className="breack_time">
                        <h4>BreakTime</h4>
                        <div className="break_time_point">
                          <button
                            title={Helpers.ternaryCondition(punchData?.currentState === "end", "You have already ended this break.", "Start break")}
                            type="button"
                            onClick={() => startBreakTime()}
                            className={`my-1 ${
                              punchData?.currentState === "end"
                                ? "disable_break_button"
                                : punchData?.currentState === "start"
                                ? "disable_break_button"
                                : punchData?.currentState === "pause"
                                ? ""
                                : punchData?.punchInDateTime === undefined
                                ? "disable_break_button"
                                : ""
                            }`}
                            disabled={punchData?.currentState === "end" ? true : punchData?.currentState === "start" ? true : punchData?.currentState === "pause" ? false : punchData?.punchInDateTime === undefined ? true : ""}
                          >
                            Start Break Time
                          </button>
                          <button
                            title={Helpers.ternaryCondition(punchData?.currentState === "end", "You have already ended this break.", "Pause")}
                            type="button"
                            onClick={() => pauseBreakTime()}
                            className={(() => {
                              switch (punchData?.currentState) {
                                case "end":
                                case "pause":
                                case undefined:
                                  return "my-1 disable_break_button";
                                case "start":
                                  return "my-1";
                                default:
                                  return "my-1";
                              }
                            })()}
                            disabled={(() => {
                              switch (punchData?.currentState) {
                                case "end":
                                case "pause":
                                case undefined:
                                  return true;
                                case "start":
                                  return false;
                                default:
                                  return "";
                              }
                            })()}
                          >
                            Pause Break Time
                          </button>
                          <button
                            title={Helpers.ternaryCondition(punchData?.currentState === "end", "You have already ended this break.", "End break")}
                            type="button"
                            onClick={() => endBreakTime()}
                            className={(() => {
                              switch (punchData?.currentState) {
                                case "end":
                                case undefined:
                                  return "my-1 disable_break_button";
                                case "start":
                                case "pause":
                                  return "my-1";
                                default:
                                  return "my-1";
                              }
                            })()}
                            disabled={(() => {
                              switch (punchData?.currentState) {
                                case "end":
                                case undefined:
                                  return true;
                                case "start":
                                case "pause":
                                  return false;
                                default:
                                  return "";
                              }
                            })()}
                          >
                            {" "}
                            End Break Time
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="dashboard_card">
                      <Row>
                        <Col xxl={6} md={12} className="mb-3 mb-lg-0">
                          <div className="dashboard_lg_card">
                            <h5>Latest Leave Applied</h5>
                            <strong className="status my-3 d-block">
                              Status
                              <span
                                className={classNames({
                                  "text-green": leaveData?.status === "accepted",
                                  "text-danger": leaveData?.status === "pending",
                                })}
                              >
                                {startCase(leaveData?.status)}
                              </span>
                            </strong>
                            <span className="d-block date_fix my-2">
                              {dayjs(leaveData?.fromDate).format("MM-DD-YYYY")} to {dayjs(leaveData?.toDate).format("MM-DD-YYYY")}
                            </span>

                            <div className="dayes_wrap mt-3">
                              <div className="days_cols">
                                <strong>{leaveData?.noOfDays} Days</strong>
                                <Link href="/leaves" className="view_leave">
                                  View Leaves
                                  <BsArrowRight />
                                </Link>
                              </div>

                              <AiOutlineCalendar className="card_pic" />
                            </div>
                          </div>
                        </Col>

                        <Col xxl={6} md={12} className="mt-xxl-0 mt-lg-3 mt-0">
                          <div className="dashboard_sm_card mb-3">
                            <div className="card_sm_left">
                              <h5>Forms Status</h5>
                              <strong className="status">
                                Status
                                {applyJobsData?.map(
                                  (applyJobs) =>
                                    applyJobs?.status == "accepted" && (
                                      <>
                                        <span
                                          className={classNames({
                                            "text-green": applyJobs?.status === "accepted",
                                            "text-danger": applyJobs?.status === "pending",
                                          })}
                                        >
                                          {startCase(applyJobs?.formStatus)}
                                        </span>
                                      </>
                                    )
                                )}
                              </strong>
                              <Link href="/forms" className="view_leave">
                                View Forms
                                <BsArrowRight />
                              </Link>
                            </div>
                            <AiOutlineCalendar className="card_sm_pic" />
                          </div>
                          {applyJobsData?.map(
                            (applyJobsDataStatus) =>
                              applyJobsDataStatus?.formStatus == "accepted" &&
                              dateValues?.length > 0 && (
                                <>
                                  <div className="dashboard_sm_card ">
                                    <div className="card_sm_left">
                                      <h5>Payslip</h5>
                                      <strong className="status">Payslip released</strong>
                                      <Link href="/pay-slip" className="view_leave">
                                        View payslip
                                        <BsArrowRight />
                                      </Link>
                                    </div>
                                    <AiOutlineCalendar className="card_sm_pic" />
                                  </div>
                                </>
                              )
                          )}
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="salary_structure">
                    <div className="salary_structure_head">
                      <h3>Salary Structure</h3>
                      <span>Duration Type: {salaryEmployee?.JobRequests?.duration}</span>
                    </div>
                    {salaryEmployee?.allowance?.length > 0 && (
                      <div className="detail_main">
                        <Button onClick={() => toggleShowDetail()}>{Helpers.ternaryCondition(isShowDetail, "Show Details", "Hide Details")}</Button>

                        <div className="detail_content">
                          {Helpers.ternaryCondition(
                            isShowDetail,
                            "",
                            <div>
                              <Table bordered hover className="mb-2">
                                <thead>
                                  <tr>
                                    <th colSpan={2}>Allowance (Basic)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {salaryEmployee.allowance?.map((data, index) => (
                                    <tr key="index">
                                      <td>Allowance {index + 1} </td>
                                      <td>{data?.allowanceChild}</td>
                                    </tr>
                                  ))}

                                  <tr className="total_calc">
                                    <td>Total </td>
                                    <td>${salaryEmployee?.totalAllowance}</td>
                                  </tr>
                                </tbody>
                              </Table>
                              <Table bordered hover className="mb-2">
                                <thead>
                                  <tr>
                                    <th colSpan={2}>Total deduction</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {salaryEmployee.deduction?.map((data, index) => (
                                    <tr key="index">
                                      <td>Deduction {index + 1} </td>
                                      <td>{data?.deductionChild}</td>
                                    </tr>
                                  ))}
                                  <tr className="total_calc">
                                    <td>Total </td>
                                    <td>${salaryEmployee?.totalDeduction}</td>
                                  </tr>
                                </tbody>
                              </Table>

                              <Table className="sub_total">
                                <tbody>
                                  <tr>
                                    <td>Net Salary </td>
                                    <td>
                                      <strong>${salaryEmployee?.totalAllowance - salaryEmployee?.totalDeduction}</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Dashboard;
