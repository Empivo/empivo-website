import React, { useEffect, useState } from "react";
import { Table, Modal, Col, Row, Button } from "react-bootstrap";
import { apiGet } from "@/utils/apiFetch";
import apiPath from "@/utils/pathObj";
import { startCase } from "lodash";
import dayjs from "dayjs";
import { AiOutlineDownload } from "react-icons/ai";
import { IoArrowBack, IoDocumentTextOutline } from "react-icons/io5";
import Helpers from "@/utils/helpers";
import { LuFileX } from "react-icons/lu";
import { saveAs } from "file-saver";
import TimeLogs from "./reusable/TimeLogs";

const EmployeeTaskView = ({ open, onHide, setJobView, currentItem }) => {
  const [viewLogData, setViewLogData] = useState([]);
  const [viewLog, setViewLog] = useState(false);
  const [taskID, setTaskID] = useState({});
  const [timeLogDataCollaborated, setTimeLogDataCollaborated] = useState([]);
  const [collaborateTimeLogData, setCollaborateTimeLogData] = useState("");

  const getTimeLogList = async () => {
    try {
      let payload = {
        taskId: taskID?._id,
      };
      const res = await apiGet(apiPath.getTimeLogList, payload);
      setViewLogData(res?.data?.results);
      setTimeLogDataCollaborated(res?.data?.results?.collabEmployeeLogs);
      setJobView(false);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    getTimeLogList();
  }, [taskID]);

  const employeeDownloadFile = (val) => {
    saveAs(val, "endTaskDocuments.pdf");
  };

  const downloadEmployeeFile = (val) => {
    saveAs(val, "endTaskCollaborationDocuments.pdf");
  };

  return (
    <div>
      <Modal show={open} onHide={onHide} centered className="agent-modal emp-task-modal">
        <Modal.Header className="d-flex justify-content-center" closeButton>
          <div className="d-flex justify-content-between w-100 me-4 align-items-center">
            <div className="d-flex align-items-center">
              {!viewLog ? "" : <IoArrowBack title="Back" onClick={() => setViewLog(false)} className="text-dark me-2 text-lg cursor-pointer" />}
              <span className="modal-title h4 mb-0">View</span>
            </div>
          </div>
        </Modal.Header>
        {!viewLog ? (
          <Modal.Body>
            <div className="job_listing_main">
              <div className="d-flex justify-content-end pb-3">
                <Button
                  className="cursor-pointer text-success bg-light p-2 px-4 border border-success rounded me-3"
                  onClick={() => {
                    setViewLog(true);
                    setCollaborateTimeLogData("timeLogData");
                    setTaskID({
                      _id: currentItem._id,
                    });
                  }}
                >
                  View time log
                </Button>
                <Button className="cursor-pointer text-success bg-light p-2 px-4 border border-success rounded me-3 opacity-100" disabled>
                  Total time spend: {Helpers.calculateTotalBreakTime(currentItem?.timeLogs)}
                </Button>
                <Button className="cursor-pointer text-success bg-light p-2 px-4 border border-success rounded opacity-100" disabled>
                  Status: {startCase(currentItem?.status)}
                </Button>
              </div>

              <div className="jobs_list border-0 p-0">
                <div className="detail_body">
                  <Row>
                    <Col sm={6}>
                      <div className="detail_box d-block">
                        <span className="text-dark fw-bold d-block">Task name</span>
                        <strong className="d-block text-black fw-normal">{currentItem?.name}</strong>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="detail_box d-block">
                        <span className="d-block fw-bold  text-dark">Task address </span>
                        <strong className="d-block text-black fw-normal">{currentItem?.address}</strong>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="detail_box d-block">
                        <span className="d-block fw-bold  text-dark">Task description</span>
                        <strong className="d-block text-black fw-normal">{currentItem?.description}</strong>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="detail_box d-block">
                        <span className="d-block fw-bold  text-dark">Select start date/ time</span>
                        <strong className="d-block text-black fw-normal">{dayjs(currentItem?.startDateTime).format("MM-DD-YYYY h:mm A")}</strong>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="detail_box d-block">
                        <span className="d-block fw-bold  text-dark">Select end date/ time</span>
                        <strong className="d-block text-black fw-normal">{dayjs(currentItem?.endDateTime).format("MM-DD-YYYY h:mm A")}</strong>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="detail_box d-block">
                        <span className="d-block fw-bold  text-dark">Task state</span>
                        <strong className="d-block text-black fw-normal">{startCase(currentItem?.state)}</strong>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="detail_box d-block">
                        <span className="d-block fw-bold  text-dark">Tags</span>
                        <strong className="d-block text-black fw-normal">{startCase(currentItem?.tags)}</strong>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="detail_box d-block">
                        <span className="d-block fw-bold  text-dark">Total time spender on the task</span>
                        <strong className="d-block text-black fw-normal">{Helpers.calculateTotalBreakTime(currentItem?.timeLogs)}</strong>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="detail_box d-block">
                        <span className="d-block fw-bold  text-dark">Status</span>
                        <strong className="d-block text-black fw-normal">{startCase(currentItem?.status)}</strong>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="detail_box d-block">
                        <span className="d-block fw-bold  text-dark">Employee task started date/ time</span>
                        <strong className="d-block text-black fw-normal">{Helpers.ternaryCondition(currentItem?.timeLogs?.[0]?.startTime, dayjs(currentItem?.timeLogs?.[0]?.startTime).format("MM-DD-YYYY h:mm A"), "N/A")}</strong>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="detail_box d-block">
                        <span className="d-block fw-bold  text-dark">Employee task end date/ time</span>
                        <strong className="d-block text-black fw-normal">{Helpers.ternaryCondition(currentItem?.taskEndDateTime, dayjs(currentItem?.taskEndDateTime).format("MM-DD-YYYY h:mm A"), "N/A")}</strong>
                      </div>
                    </Col>

                    <Col sm="12">
                      <div className="detail_box d-block">
                        <span className="d-block fw-bold  text-dark">Assign task document</span>
                        <Row className="">
                          {Helpers.ternaryCondition(
                            currentItem?.documents && currentItem?.documents?.length > 0,
                            currentItem?.documents?.map((val, index) => (
                              <Col sm={4} key="index">
                                <div className="me-2 border d-flex align-items-center rounded p-2 justify-content-between mt-3">
                                  <div className="item object-cover w-24 h-24 overflow-hidden  m-2">
                                    <IoDocumentTextOutline className="fs-2" />
                                  </div>
                                  <button title="Download" onClick={() => downloadFile(val)} type="button" className="btn border rounded border-dark">
                                    <AiOutlineDownload style={{ width: "15px", fontWeight: 800 }} />
                                  </button>
                                </div>
                              </Col>
                            )),
                            <div className="item object-cover w-24 h-24 overflow-hidden  m-2">
                              <LuFileX className="fs-2" />
                            </div>
                          )}
                        </Row>
                      </div>
                    </Col>
                    <Col sm="12">
                      <div className="detail_box d-block">
                        <span className="d-block fw-bold  text-dark">Upload employee task document</span>
                        <Row className="">
                          {Helpers.ternaryCondition(
                            currentItem?.endTaskDocuments && currentItem?.endTaskDocuments?.length > 0,
                            currentItem?.endTaskDocuments?.map((val, index) => (
                              <Col sm={4} key="index">
                                <div className="me-2 border d-flex align-items-center rounded p-2 justify-content-between mt-3">
                                  <div className="item object-cover w-24 h-24 overflow-hidden  m-2">
                                    <IoDocumentTextOutline className="fs-2" />
                                  </div>
                                  <button title="Download" onClick={() => employeeDownloadFile(val)} type="button" className="btn border rounded border-dark">
                                    <AiOutlineDownload
                                      style={{
                                        width: "15px",
                                        fontWeight: 800,
                                      }}
                                    />
                                  </button>
                                </div>
                              </Col>
                            )),
                            <div className="item object-cover w-24 h-24 overflow-hidden  m-2">
                              <LuFileX className="fs-2" />
                            </div>
                          )}
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
              {Helpers.ternaryCondition(
                currentItem?.collaborationStatus === "accepted",
                <>
                  <hr className="my-3" />
                  <div className="d-flex justify-content-end pb-3">
                    <Button
                      className="cursor-pointer text-success bg-light p-2 px-4 border border-success rounded me-3"
                      onClick={() => {
                        setViewLog(true);
                        setCollaborateTimeLogData("timeLogDataCollaborate");
                        setTaskID({
                          _id: currentItem._id,
                        });
                      }}
                    >
                      View time log
                    </Button>
                    <Button className="cursor-pointer text-success bg-light p-2 px-4 border border-success rounded me-3 opacity-100" disabled>
                      Total time spend: {Helpers.calculateTotalBreakTime(currentItem?.collaborationTimeLogs)}
                    </Button>
                    <Button className="cursor-pointer text-success bg-light p-2 px-4 border border-success rounded opacity-100" disabled>
                      Status: {startCase(currentItem?.collaborationStatus)}
                    </Button>
                  </div>

                  <div className="jobs_list border-0 p-0">
                    <div className="detail_body">
                      <Row>
                        <Col sm="6">
                          <div className="detail_box d-block">
                            <span className="text-dark fw-bold d-block">Task name</span>
                            <strong className="d-block text-black fw-normal">{currentItem?.name}</strong>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="detail_box d-block">
                            <span className="text-dark fw-bold d-block">Task address </span>
                            <strong className="d-block text-black fw-normal">{currentItem?.address}</strong>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="detail_box d-block">
                            <span className="text-dark fw-bold d-block">Task description</span>
                            <strong className="d-block text-black fw-normal">{currentItem?.description}</strong>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="detail_box d-block">
                            <span className="text-dark fw-bold d-block">Select start date/ time</span>
                            <strong className="d-block text-black fw-normal">{dayjs(currentItem?.startDateTime).format("MM-DD-YYYY h:mm A")}</strong>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="detail_box d-block">
                            <span className="text-dark fw-bold d-block">Select end date/ time</span>
                            <strong className="d-block text-black fw-normal">{dayjs(currentItem?.endDateTime).format("MM-DD-YYYY h:mm A")}</strong>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="detail_box d-block">
                            <span className="text-dark fw-bold d-block">Task state</span>
                            <strong className="d-block text-black fw-normal">{startCase(currentItem?.collaborationState)}</strong>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="detail_box d-block">
                            <span className="text-dark fw-bold d-block">Tags</span>
                            <strong className="d-block text-black fw-normal">{startCase(currentItem?.tags)}</strong>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="detail_box d-block">
                            <span className="text-dark fw-bold d-block">Total time spender on the task</span>
                            <strong className="d-block text-black fw-normal">{Helpers.calculateTotalBreakTime(currentItem?.collaborationTimeLogs)}</strong>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="detail_box d-block">
                            <span className="text-dark fw-bold d-block">Employee task started date/ time</span>
                            <strong className="d-block text-black fw-normal">
                              {Helpers.ternaryCondition(currentItem?.collaborationTimeLogs?.[0]?.startTime, dayjs(currentItem?.collaborationTimeLogs?.[0]?.startTime).format("MM-DD-YYYY h:mm A"), "N/A")}
                            </strong>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="detail_box d-block">
                            <span className="text-dark fw-bold d-block">Employee task end date/ time</span>
                            <strong className="d-block text-black fw-normal">{Helpers.ternaryCondition(currentItem?.taskEndDateTimeCollaboration, dayjs(currentItem?.taskEndDateTimeCollaboration).format("MM-DD-YYYY h:mm A"), "N/A")}</strong>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="detail_box d-block">
                            <span className="text-dark fw-bold d-block">Status</span>
                            <strong className="d-block text-black fw-normal">{startCase(currentItem?.collaborationStatus)}</strong>
                          </div>
                        </Col>
                        <Col sm="12">
                          <div className="detail_box d-block">
                            <span className="d-block fw-bold  text-dark">Assign task document</span>
                            <Row className="">
                              {Helpers.ternaryCondition(
                                currentItem?.documents && currentItem?.documents?.length > 0,
                                currentItem?.documents?.map((val, index) => (
                                  <Col sm={4} key="index">
                                    <div className="me-2 border d-flex align-items-center rounded p-2 justify-content-between mt-3">
                                      <div className="item object-cover w-24 h-24 overflow-hidden  m-2">
                                        <IoDocumentTextOutline className="fs-2" />
                                      </div>
                                      <button title="Download" onClick={() => downloadFile(val)} type="button" className="btn border rounded border-dark">
                                        <AiOutlineDownload
                                          style={{
                                            width: "15px",
                                            fontWeight: 800,
                                          }}
                                        />
                                      </button>
                                    </div>
                                  </Col>
                                )),
                                <div className="item object-cover w-24 h-24 overflow-hidden  m-2">
                                  <LuFileX className="fs-2" />
                                </div>
                              )}
                            </Row>
                          </div>
                        </Col>
                        <Col sm="12">
                          <div className="detail_box d-block">
                            <span className="d-block fw-bold  text-dark">Upload employee task document</span>
                            <Row className="">
                              {Helpers.ternaryCondition(
                                currentItem?.endTaskCollaborationDocuments && currentItem?.endTaskCollaborationDocuments?.length > 0,
                                currentItem?.endTaskCollaborationDocuments?.map((val, index) => (
                                  <Col sm={4} key="index">
                                    <div className="me-2 border d-flex align-items-center rounded p-2 justify-content-between mt-3">
                                      <div className="item object-cover w-24 h-24 overflow-hidden  m-2">
                                        <IoDocumentTextOutline className="fs-2" />
                                      </div>
                                      <button title="Download" onClick={() => downloadEmployeeFile(val)} type="button" className="btn border rounded border-dark">
                                        <AiOutlineDownload
                                          style={{
                                            width: "15px",
                                            fontWeight: 800,
                                          }}
                                        />
                                      </button>
                                    </div>
                                  </Col>
                                )),
                                <div className="item object-cover w-24 h-24 overflow-hidden  m-2">
                                  <LuFileX className="fs-2" />
                                </div>
                              )}
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </>,
                ""
              )}
            </div>
          </Modal.Body>
        ) : (
          <Modal.Body>
            <div className="job_listing_main">
              <div className="jobs_list border-0 p-0">
                <div className="detail_body">
                  <div className="">
                    <Table responsive className="theme_lg_table">
                      <thead>
                        <tr>
                          <th>S.no. </th>
                          <th>Date</th>
                          <th>Start time</th>
                          <th>End time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collaborateTimeLogData === "timeLogData" && <TimeLogs timeLogData={viewLogData} />}

                        {collaborateTimeLogData === "timeLogDataCollaborate" && <TimeLogs timeLogData={timeLogDataCollaborated} />}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeTaskView;
