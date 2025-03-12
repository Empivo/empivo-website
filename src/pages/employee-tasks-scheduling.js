import React, { useState, useEffect, useContext } from "react";
import { Container, Breadcrumb, Row, Col, Button, Form, Table, Modal, Dropdown, Badge } from "react-bootstrap";
import ProfileSidebar from "./components/ProfileSidebar";
import { BsChatDots } from "react-icons/bs";
import Image from "next/image";
import dayjs from "dayjs";
import { isEmpty, startCase } from "lodash";
import { useRouter } from "next/router";
import ODateRangePicker from "./components/common/ODateRangePicker";
import { AiOutlineDownload } from "react-icons/ai";
import { BiMenuAltRight } from "react-icons/bi";
import apiPath from "../utils/pathObj";
import { apiGet, apiPost } from "../utils/apiFetch";
import { saveAs } from "file-saver";
import AuthContext from "@/context/AuthContext";
import Collaborate from "./components/Collaborate";
import { IoDocumentTextOutline } from "react-icons/io5";
import useToastContext from "@/hooks/useToastContext";
import { MdAttachFile, MdAssignmentAdd } from "react-icons/md";
import { LuEye, LuFileX } from "react-icons/lu";
import { VscDebugStart } from "react-icons/vsc";
import { IoIosPause, IoMdMore } from "react-icons/io";
import Helpers from "@/utils/helpers";
import EmployeeTaskView from "./components/EmployeeTaskView";
import NoteView from "./components/NoteView";
import { FaRegStopCircle } from "react-icons/fa";
import io from "socket.io-client";
import UploadDocumentView from "./components/UploadDocumentView";

function EmployeeTasksScheduling() {
  const router = useRouter();
  const notification = useToastContext();
  const { applyJobApi, user } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState();
  const [taskList, setTaskList] = useState([]);
  const [taskCount, setTaskCount] = useState({});
  const [currentItem, setCurrentItem] = useState("");
  const [fileView, setFileView] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [filterData, setFilterData] = useState({
    isReset: false,
    isFilter: false,
    startDate: "",
    endDate: "",
    category: "",
    tagsCategory: "",
    searchKey: "",
  });

  const [collaborateView, setCollaborateView] = useState(false);
  const [taskID, setTaskID] = useState({});
  const [viewData, setViewData] = useState(false);
  const [noteViewData, setNoteViewData] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [socket, setSocket] = useState(false);
  const [uploadDocument, setUploadDocument] = useState(false);
  const [selectDocument, setSelectDocument] = useState("");

  const employeeTaskList = async () => {
    try {
      const { category, tagsCategory, startDate, endDate } = filterData;
      let payload = {
        page: page || 1,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        status: category,
        tags: tagsCategory,
        keyword: searchTerm?.trim(),
      };
      const path = apiPath.employeeTaskList;
      const result = await apiGet(path, payload);
      const response = result?.data?.results;
      setTaskCount(response);
      if (page > 1) {
        if (taskList.length <= page * 10) setTaskList([...taskList, ...response?.docs]);
      } else setTaskList(response?.docs);
      setPagination(response);
    } catch (error) {
      console.log("error in get all task list==>>>>", error.message);
    }
  };

  useEffect(() => {
    employeeTaskList();
  }, [page, filterData]);

  const loadMore = () => {
    setPage(page + 1);
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

  const tagsPage = (e) => {
    setFilterData({
      ...filterData,
      tagsCategory: e.target.value,
      isFilter: true,
    });
    setPage(1);
  };

  const handleView = (item) => {
    setCurrentItem(item);
    setViewData(!viewData);
  };

  const handleDocumentView = (item) => {
    setCurrentItem(item);
    setUploadDocument(!uploadDocument);
  };

  const handleNoteView = (item) => {
    setCurrentItem(item);
    setNoteViewData(!noteViewData);
    setSelectedTask(item);
  };

  const handleReset = () => {
    setFilterData({
      isReset: true,
      isFilter: false,
      startDate: "",
      endDate: "",
      category: "",
      tagsCategory: "",
      searchKey: "",
    });
    setPage(1);
    setSearchTerm("");
    router.push(`/employee-tasks-scheduling`);
  };
  const openProfileSidebar = () => {
    if (document.body) {
      let element = document.body;
      const classesToToggle = "remover-sidebar";
      element.classList.toggle(classesToToggle);
    }
  };

  const handleFile = (element) => {
    setCurrentItem(element);
    setFileView(!fileView);
  };

  const handleCloseFile = () => {
    setFileView(false);
  };

  const downloadDocuments = (values) => {
    saveAs(values, "documents.pdf");
  };

  useEffect(() => {
    applyJobApi();
  }, []);

  const startBreakTime = async (item) => {
    try {
      const formData = new FormData();
      formData.append("taskId", item._id);
      formData.append("actionType", item.actionType);

      const result = await apiPost(apiPath.timeLogs, formData);
      if (result?.data?.success) {
        notification.success(result?.data?.message);
        employeeTaskList();
      } else {
        notification.error(result?.data?.message);
      }
    } catch (error) {}
  };

  const pauseBreakTime = async (item, data) => {
    try {
      const formData = new FormData();
      formData.append("taskId", item._id);
      formData.append("actionType", data.actionType);

      const result = await apiPost(apiPath.timeLogs, formData);
      if (result?.data?.success) {
        notification.success(result?.data?.message);
        employeeTaskList();
      } else {
        notification.error(result?.data?.message);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const newSocket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL_SOCKET}`, {
        transports: ["websocket"],
        query: {
          token: token,
        },
      });
      newSocket.on("connect", () => {
        console.log("connect with server==>>123");
      });

      setSocket(newSocket);
    }
  }, []);

  if (taskList && socket) {
    socket.off("groupReceiveMessage").on("groupReceiveMessage", (data) => {
      const index = taskList && taskList?.findIndex((item) => item?._id === data?.data?.taskId);

      let arr = [...taskList];
      arr[index].unSeenCount = arr[index]?.unSeenCount + 1;
      setTaskList(arr);
    });
  }

  return (
    <section className="profile_main_wrap">
      <Container>
        <div className="account_row_emp">
          <ProfileSidebar />

          <div className="account_content_right emp-task-sec">
            <button className="open_sidebar_mobile" onClick={openProfileSidebar}>
              <BiMenuAltRight />
            </button>
            <div className="d-flex justify-content-between top-bred-sec">
              <Breadcrumb className="">
                <Breadcrumb.Item href="#">
                  <Image src="/images/home.svg" width={15} height={14} alt="" />
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Employee tasks scheduling</Breadcrumb.Item>
              </Breadcrumb>
              <Button className="py-2 px-3 outline_blue_btn rounded_5 assignTask_btn" type="button" onClick={() => router.push("/assign-task-request")}>
                Assign task request
                <Badge className="rounded-circle ms-2">{taskCount?.taskRequestCount}</Badge>
              </Button>
            </div>

            <div className="job_applied">
              <Form className="job_filter mobile_align_fix d-block">
                <Row>
                  <Col lg={5} sm={12} className="mb-lg-0 mb-3">
                    <Form.Control placeholder="Search by task name" className="job_search_form" aria-describedby="basic-addon1" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></Form.Control>
                  </Col>
                  <Col lg={7} sm={12} className="d-flex flex-lg-wrap assign-task-datepicker flex-row justify-content-sm-between justify-content-lg-end emp-task-select-datepicker">
                    <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
                  </Col>
                </Row>

                <div className="d-flex tag-collaborate-sec">
                  <div className="flex items-center  ml-3 mb-3">
                    <select id="" className="form-select" type="text " name="tags" placeholder=" " onChange={(e) => tagsPage(e)} value={filterData?.tagsCategory}>
                      <option selected value="">
                        Tags
                      </option>
                      <option value="assigned">Assigned</option>
                      <option value="reAssigned">Reassigned</option>
                      <option value="collaborated">Collaborated</option>
                    </select>
                  </div>
                  <div className="filter_action mb-3 emp-task-filter-btn">
                    <Button className="py-1 px-4 outline_blue_btn rounded_5" onClick={handleReset} type="button">
                      Clear
                    </Button>
                    <Button className="py-1 px-4 theme_blue_btn rounded_5" onClick={() => employeeTaskList()}>
                      Apply
                    </Button>
                  </div>
                </div>
              </Form>

              <Table responsive className="theme_lg_table scheduled-table">
                <thead>
                  <tr>
                    <th>Task Name </th>
                    <th>Task description</th>
                    <th>Attached file</th>
                    <th>Task start date/ time</th>
                    <th>Task end date/ time</th>
                    <th>Task state</th>
                    <th>Tags</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskList?.length > 0 &&
                    taskList?.map((item, index) => {
                      return (
                        <>
                          <tr>
                            <td>{item?.name}</td>
                            <td>{item?.description}</td>
                            <td>
                              {item?.documents && item?.documents?.length > 0 ? (
                                <div className="item object-cover w-24 h-24 overflow-hidden cursor-pointer" key="index">
                                  <MdAttachFile className="text-lg" onClick={() => handleFile(item)} />
                                </div>
                              ) : (
                                <div className="item object-cover w-24 h-24 overflow-hidden">
                                  <LuFileX className="text-lg" />
                                </div>
                              )}
                            </td>
                            <td> {dayjs(item?.startDateTime).format("MM-DD-YYYY h:mm A")}</td>
                            <td>{dayjs(item?.endDateTime).format("MM-DD-YYYY h:mm A")} </td>
                            <td>
                              {user?._id === item?.collaboratedEmployeeId ? startCase(item?.collaborationState) : startCase(item?.state)}
                              {/* {startCase(item?.state)} */}
                            </td>
                            <td>{startCase(item?.tags)}</td>
                            <td className="text-end">
                              <Dropdown className="collabrate-btn disable-btn-task">
                                <Dropdown.Toggle variant="link" id="dropdown-basic">
                                  <IoMdMore className="text-lg" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item>
                                    {item?.collaboratedEmployeeId === null && item?.collaborationStatus === null && item?.state !== "notStarted" && item?.tags !== "collaborated" && item?.currentState !== "end" ? (
                                      <span
                                        title="Collaborate"
                                        className="border-0 bg-transparent cursor-pointer me-2"
                                        onClick={() => {
                                          setCollaborateView(true);
                                          setTaskID({
                                            _id: item._id,
                                            employeeId: item?.employeeId,
                                          });
                                        }}
                                      >
                                        <MdAssignmentAdd className="me-2" />
                                        Collaboration
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <button
                                      title={item?.currentState === "end" ? "You have already ended this task." : "Start task"}
                                      onClick={() =>
                                        Helpers.alertFunction(
                                          "Are you sure you want to start task?",
                                          {
                                            _id: item?._id,
                                            actionType: "start",
                                          },
                                          startBreakTime
                                        )
                                      }
                                      className={
                                        user?._id === item?.collaboratedEmployeeId
                                          ? `bg-transparent border-0 cursor-pointer m-0 p-0 ${
                                              item?.collaborationCurrentState == "end" ? "disable_break_button" : item?.collaborationCurrentState == "start" ? "disable_break_button" : item?.collaborationCurrentState == "pause" ? "" : ""
                                            }`
                                          : `bg-transparent border-0 cursor-pointer m-0 p-0 ${item?.currentState == "end" ? "disable_break_button" : item?.currentState == "start" ? "disable_break_button" : item?.currentState == "pause" ? "" : ""}`
                                      }
                                      disabled={
                                        user?._id === item?.collaboratedEmployeeId
                                          ? item?.collaborationCurrentState === "end"
                                            ? true
                                            : item?.collaborationCurrentState === "start"
                                            ? true
                                            : item?.collaborationCurrentState === "pause"
                                            ? false
                                            : ""
                                          : item?.currentState === "end"
                                          ? true
                                          : item?.currentState === "start"
                                          ? true
                                          : item?.currentState === "pause"
                                          ? false
                                          : ""
                                      }
                                    >
                                      <VscDebugStart className="me-2" />
                                      Start Task
                                    </button>
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <button
                                      title={item?.currentState === "end" ? "You have already ended this task." : "Pause"}
                                      onClick={() =>
                                        pauseBreakTime(item, {
                                          actionType: "pause",
                                        })
                                      }
                                      className={
                                        user?._id === item?.collaboratedEmployeeId
                                          ? `bg-transparent border-0 cursor-pointer m-0 p-0 ${
                                              item?.collaborationCurrentState == "end"
                                                ? "disable_break_button"
                                                : item?.collaborationCurrentState == "start"
                                                ? ""
                                                : item?.collaborationCurrentState == "pause"
                                                ? "disable_break_button"
                                                : item?.collaborationState === "notStarted"
                                                ? "disable_break_button"
                                                : ""
                                            }`
                                          : `bg-transparent border-0 cursor-pointer m-0 p-0 ${
                                              item?.currentState == "end"
                                                ? "disable_break_button"
                                                : item?.currentState == "start"
                                                ? ""
                                                : item?.currentState == "pause"
                                                ? "disable_break_button"
                                                : item?.state === "notStarted"
                                                ? "disable_break_button"
                                                : ""
                                            }`
                                      }
                                      disabled={
                                        user?._id === item?.collaboratedEmployeeId
                                          ? item?.collaborationCurrentState === "end"
                                            ? true
                                            : item?.collaborationCurrentState === "start"
                                            ? false
                                            : item?.collaborationCurrentState === "pause"
                                            ? true
                                            : item?.collaborationState === "notStarted"
                                            ? true
                                            : ""
                                          : item?.currentState === "end"
                                          ? true
                                          : item?.currentState === "start"
                                          ? false
                                          : item?.currentState === "pause"
                                          ? true
                                          : item?.state === "notStarted"
                                          ? true
                                          : ""
                                      }
                                    >
                                      <IoIosPause className="me-2" />
                                      Pause Task
                                    </button>
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <button
                                      title={item?.currentState === "end" ? "You have already ended this task." : "End task"}
                                      onClick={() => {
                                        setUploadDocument(true);
                                        setSelectDocument({
                                          _id: item._id,
                                        });
                                      }}
                                      className={
                                        user?._id === item?.collaboratedEmployeeId
                                          ? `bg-transparent border-0 cursor-pointer m-0 p-0  ${
                                              item?.collaborationCurrentState == "end"
                                                ? "disable_break_button"
                                                : item?.collaborationCurrentState == "start"
                                                ? ""
                                                : item?.collaborationCurrentState == "pause"
                                                ? ""
                                                : item?.collaborationState === "notStarted"
                                                ? "disable_break_button"
                                                : ""
                                            }`
                                          : `bg-transparent border-0 cursor-pointer m-0 p-0  ${
                                              item?.currentState == "end" ? "disable_break_button" : item?.currentState == "start" ? "" : item?.currentState == "pause" ? "" : item?.state === "notStarted" ? "disable_break_button" : ""
                                            }`
                                      }
                                      disabled={
                                        user?._id === item?.collaboratedEmployeeId
                                          ? item?.collaborationCurrentState === "end"
                                            ? true
                                            : item?.collaborationCurrentState === "start"
                                            ? false
                                            : item?.collaborationCurrentState === "pause"
                                            ? false
                                            : item?.collaborationState === "notStarted"
                                            ? true
                                            : ""
                                          : item?.currentState === "end"
                                          ? true
                                          : item?.currentState === "start"
                                          ? false
                                          : item?.currentState === "pause"
                                          ? false
                                          : item?.state === "notStarted"
                                          ? true
                                          : ""
                                      }
                                    >
                                      {/* End task */}
                                      <FaRegStopCircle className="me-2" />
                                      End Task
                                    </button>
                                  </Dropdown.Item>
                                  <Dropdown.Item title="View" onClick={() => handleView(item)}>
                                    <LuEye className="me-2 text-md" />
                                    View
                                  </Dropdown.Item>
                                  {((item?.collaboratedEmployeeId === null || item?.collaborationCurrentState === "end") && item?.currentState === "end") || item?.status !== "accepted" || item?.state === "notStarted" ? (
                                    ""
                                  ) : (
                                    <Dropdown.Item
                                      title="Notes"
                                      onClick={() => {
                                        handleNoteView(item);
                                        let arr = [...taskList];
                                        arr[index].unSeenCount = 0;
                                        setTaskList(arr);
                                      }}
                                    >
                                      <div className="position-relative">
                                        <BsChatDots title="Note" className="me-2" />
                                        Notes
                                        {item?.unSeenCount !== 0 ? <p className="msgCount">{item?.unSeenCount}</p> : ""}
                                      </div>
                                    </Dropdown.Item>
                                  )}
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>{" "}
                        </>
                      );
                    })}

                  {isEmpty(taskList) ? (
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
      <Modal show={fileView} onHide={handleCloseFile} centered className="agent-modal view-info-modal">
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
      {collaborateView && <Collaborate open={collaborateView} taskID={taskID} setCollaborateView={setCollaborateView} onHide={() => setCollaborateView(false)} />}
      {viewData && <EmployeeTaskView open={viewData} currentItem={currentItem} setViewData={setViewData} onHide={() => setViewData(false)} handleView={handleView} />}

      {noteViewData && <NoteView socket={socket} open={noteViewData} currentItem={currentItem} setNoteViewData={setNoteViewData} onHide={() => setNoteViewData(false)} handleNoteView={handleNoteView} selectedTask={selectedTask} />}
      {uploadDocument && (
        <UploadDocumentView
          open={uploadDocument}
          currentItem={currentItem}
          setUploadDocument={setUploadDocument}
          onHide={() => setUploadDocument(false)}
          handleDocumentView={handleDocumentView}
          employeeTaskList={employeeTaskList}
          selectDocument={selectDocument}
        />
      )}
    </section>
  );
}

export default EmployeeTasksScheduling;
