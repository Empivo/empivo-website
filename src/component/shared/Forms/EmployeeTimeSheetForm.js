import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import { Table, Col, Row } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import Flatpickr from "react-flatpickr";
import SignPage from "@/pages/components/SignPage";
import RedStar from "@/pages/components/common/RedStar";

const EmployeeTimeSheetForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const notification = useToastContext();
  const router = useRouter();
  const { acceptedJobs, currentFormItem, setCurrentItem } = useContext(AuthContext);
  const [totalWeekHours, setTotalWeekHours] = useState(0);

  const [preview, setPreview] = useState({
    employeeSign: null,
    supervisorSign: null,
  });
  const [src, setSrc] = useState(null);
  const [imageName, setImageName] = useState({
    employeeSign: null,
    supervisorSign: null,
  });
  const [imageData, setImageData] = useState({
    employeeSign: null,
    supervisorSign: null,
  });
  const [modalOpen, setModalOpen] = useState({
    employeeSign: false,
    supervisorSign: false,
  });
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);

  const handleImgChange = (e, text) => {
    const fileSize = (e.target.files[0]?.size / 1024).toFixed(2);
    if (fileSize > 10) {
      notification.error("Please select image below 10 kb");
    } else {
      setSrc(URL?.createObjectURL(e.target.files[0]));
      setModalOpen({ ...modalOpen, [text]: true });
      setImageName({ ...imageName, [text]: e.target.files[0]?.name });
    }
  };

  const [hoursTable, setHoursTable] = useState([
    {
      label: "Saturday",
      startDate: "",
      endDate: "",
      totaldiff: 0,
    },
    { label: "Sunday", startDate: "", endDate: "", totaldiff: 0 },
    { label: "Monday", startDate: "", endDate: "", totaldiff: 0 },
    {
      label: "Tuesday",

      startDate: "",
      endDate: "",
      totaldiff: 0,
    },
    {
      label: "Wednesday",

      startDate: "",
      endDate: "",
      totaldiff: 0,
    },
    {
      label: "Thursday",

      startDate: "",
      endDate: "",
      totaldiff: 0,
    },
    { label: "Friday", startDate: "", endDate: "", totaldiff: 0 },
  ]);

  const onSubmit = async (data) => {
    try {
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          employeeSign: JSON.stringify({
            employeeSign: imageData.employeeSign,
          }),
          supervisorSign: JSON.stringify({
            supervisorSign: imageData.supervisorSign,
          }),
        },
      };
      payload.content.hours = hoursTable;
      payload.content.totalWeekHours = totalWeekHours;

      let res = {};
      if (Object.keys(currentFormItem.data || {})?.length > 0 || Object.keys(currentItem)?.length > 0) res = await apiPut(apiPath.editForms, payload);
      else res = await apiPost(apiPath.submitForm, payload);
      if (res.data.success === true) {
        if (!currentFormItem.edit) formList();
        if (Object.keys(currentFormItem?.data || {})?.length > 0) router.push("/forms");
        if (formLength > indexForm + 1)
          setCurrentItem({
            ...currentFormItem,
            indexForm: indexForm + 1,
          });
        notification.success(res?.data?.message);
      } else {
        notification.error(res?.data?.message);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const setFileImage = async (text1, image1, text2, image2) => {
    if (image1 && image2) {
      const imageData1 = JSON.parse(image1)[text1];
      const imageData2 = JSON.parse(image2)[text2];
      setPreview({
        [text1]: imageData1,
        [text2]: imageData2,
      });
      setImageData({
        [text1]: imageData1,
        [text2]: imageData2,
      });
    }
  };

  const handleSave = (value, text, cond) => {
    if (cond === "open") {
      setModalOpen({ ...modalOpen, [text]: false });
      return;
    }
    if (cond) {
      setPreview({ ...preview, [text]: value });
    } else {
      setImageData({ ...imageData, [text]: value });
    }
  };

  useEffect(() => {
    if (Object.keys(currentFormItem?.data || {})?.length) {
      setHoursTable(currentFormItem.data?.hours);
      setTotalWeekHours(currentFormItem.data?.totalWeekHours);
      setFileImage("employeeSign", currentFormItem.data?.employeeSign, "supervisorSign", currentFormItem.data?.supervisorSign);
      reset(currentFormItem.data);
      setValue("employeeSign", "");
      setValue("supervisorSign", "");
    }
  }, [currentFormItem.data]);

  const handleObjectLength = (obj) => Object.keys(obj || {})?.length;

  const handleKeyDown = (event) => {
    if (!["Backspace", "Delete", "Tab"].includes(event.key) && !/[0-9.]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const preventMaxHundred = (e) => {
    if (e.target.value > 100) {
      e.target.value = e.target.value.slice(0, 2);
    }
  };

  return (
    <div className="employee_application_form py-3">
      <div className="similar_wrapper text-dark">
        <div className="employee_application_form_wrap">
          <div className="text_wrap_row text-center text-dark bg-light mb-4">
            <strong className="text-lg">TIME SHEET</strong>
          </div>
          <h6 className="text-dark text-center mb-4 fw-bold">Weekly Work Report</h6>
        </div>
        <Row className="gy-4 mb-4">
          <Col md={4}>
            <label htmlFor="" className="m-0">
              Name <RedStar />
            </label>
            <div className="position-relative">
              <input
                type="text"
                className="form_input w-100"
                disabled={formView}
                maxLength={15}
                onInput={(e) => preventMaxInput(e, 15)}
                {...register("name", {
                  required: {
                    value: true,
                    message: "Please enter name.",
                  },
                  minLength: {
                    value: 2,
                    message: "Minimum length must be 2.",
                  },
                  maxLength: {
                    value: 15,
                    message: "Maximum length must be 15.",
                  },
                })}
              />
              <ErrorMessage message={errors?.name?.message} />
            </div>
          </Col>
          <Col md={4}>
            <label htmlFor="" className="m-0">
              Employee ID #: <RedStar />
            </label>
            <div className="position-relative">
              <input
                type="text"
                className="form_input w-100"
                disabled={formView}
                {...register("employeeID", {
                  required: {
                    value: true,
                    message: "Please enter employee ID.",
                  },
                  minLength: {
                    value: 2,
                    message: "Minimum length must be 2.",
                  },
                  maxLength: {
                    value: 15,
                    message: "Maximum length must be 15.",
                  },
                  // pattern: {
                  //   value: validationRules.characters
                  //   message: validationRules.charactersMessage
                  // }
                  // min: {
                  //   value: 0,
                  //   message: "Value can't be less than 0."
                  // }
                })}
              />
              <ErrorMessage message={errors?.employeeID?.message} />
            </div>
          </Col>
          <Col md={4}>
            <label htmlFor="" className="m-0">
              Week Ending <RedStar />
            </label>
            <div className="position-relative">
              <input
                type="number"
                className="form_input w-100"
                disabled={formView}
                onKeyDown={(event) => {
                  if (!["Backspace", "Delete", "Tab"].includes(event.key) && !/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                {...register("weekEnding", {
                  required: "Please enter week ending.",
                  pattern: {
                    value: /^(?:[1-9]\d*|0)$/,
                    message: "First character can not be 0.",
                  },
                })}
              />
              <ErrorMessage message={errors?.weekEnding?.message} />
            </div>
          </Col>
          <Col md={6}>
            <label htmlFor="" className="m-0">
              Name of Facility <RedStar />
            </label>
            <div className="position-relative">
              <input
                type="text"
                className="form_input w-100"
                disabled={formView}
                maxLength={15}
                onInput={(e) => preventMaxInput(e, 15)}
                {...register("facilityName", {
                  required: {
                    value: true,
                    message: "Please enter name of facility.",
                  },
                  minLength: {
                    value: 2,
                    message: "Minimum length must be 2.",
                  },
                  maxLength: {
                    value: 15,
                    message: "Maximum length must be 15.",
                  },
                })}
              />
              <ErrorMessage message={errors?.facilityName?.message} />
            </div>
          </Col>
          <Col md={6}>
            <label htmlFor="" className="m-0">
              Facility Location <RedStar />
            </label>
            <div className="position-relative">
              <input
                type="text"
                className="form_input w-100"
                disabled={formView}
                maxLength={15}
                onInput={(e) => preventMaxInput(e, 15)}
                {...register("facilityLocation", {
                  required: {
                    value: true,
                    message: "Please enter facility location.",
                  },
                  minLength: {
                    value: 2,
                    message: "Minimum length must be 2.",
                  },
                  maxLength: {
                    value: 15,
                    message: "Maximum length must be 15.",
                  },
                })}
              />
              <ErrorMessage message={errors?.facilityLocation?.message} />
            </div>
          </Col>
        </Row>

        <Table variant="light" bordered hover cellpadding="5px" className="mb-4" responsive>
          <thead>
            <tr>
              <th className="text-center">Day</th>
              <th className="text-center">In Time</th>
              <th className="text-center">Out Time</th>
              <th className="text-center">Daily Total</th>
            </tr>
          </thead>
          <tbody>
            {hoursTable?.map((item, index) => (
              <>
                <tr>
                  <td>{item.label}</td>
                  <td>
                    <div className="px-3">
                      <Flatpickr
                        className="form-control"
                        disabled={formView}
                        options={{
                          // enableTime: true,
                          options: "",
                          dateFormat: "d-m-Y",
                          minDate: item?.endDate,
                          maxDate: item?.endDate || "today",
                          // time_24hr: false
                        }}
                        value={item?.startDate || ""}
                        onChange={(date) => {
                          let selectedDate = new Date(date[0]);
                          const arr = [...hoursTable];
                          arr[index].startDate = selectedDate;
                          setHoursTable(arr);
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="px-3">
                      <Flatpickr
                        className="form-control"
                        disabled={formView}
                        options={{
                          // enableTime: true,
                          options: "",
                          dateFormat: "d-m-Y",
                          maxDate: item.startDate || "today",
                          minDate: item.startDate,
                          // time_24hr: false
                        }}
                        value={item?.endDate || ""}
                        onChange={(date) => {
                          let selectedDate = new Date(date[0]);
                          const arr = [...hoursTable];
                          arr[index].endDate = selectedDate;
                          setHoursTable(arr);
                          // setTime(selectedDate)
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="px-3">
                      <input
                        type="number"
                        disabled={formView}
                        className="form-control"
                        onInput={(e) => preventMaxHundred(e)}
                        onKeyDown={(event) => handleKeyDown(event)}
                        value={item?.totaldiff}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const updatedTable = [...hoursTable];
                          updatedTable[index].totaldiff = newValue;
                          let totalHour = 0;
                          updatedTable.forEach((data) => {
                            totalHour += +data.totaldiff || 0;
                          });

                          setHoursTable(updatedTable);
                          setTotalWeekHours(totalHour);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              </>
            ))}

            <tr>
              <td colSpan={3} className="text-end vertical-middle fw-bold">
                Week Total Hours
              </td>
              <td>
                <div className="px-3">
                  <input type="number" className="form-control" disabled value={totalWeekHours} />
                </div>
              </td>
            </tr>
          </tbody>
        </Table>

        <Row className="gy-4 mt-3">
          <Col md={6}>
            <label htmlFor="" className="m-0">
              Employees Signature: <RedStar />
            </label>
            <SignPage
              imageName={imageName.employeeSign}
              register={register("employeeSign", {
                required: {
                  value: preview.employeeSign ? false : true,
                  message: "Please select signature",
                },
              })}
              imageRef={imageRef1}
              formView={formView}
              handleImgChange={handleImgChange}
              modalOpen={modalOpen}
              handleSave={handleSave}
              src={src}
              text={"employeeSign"}
              image={preview?.employeeSign}
              errorCond={errors?.employeeSign}
              imageShow={handleObjectLength(currentFormItem.data)}
              errors={<ErrorMessage message="Please select employeeSign" />}
            />
          </Col>
          <Col md={6}>
            <label htmlFor="" className="m-0">
              Date: <RedStar />
            </label>
            <div className="position-relative">
              <input
                type="date"
                disabled={formView}
                className="form_input w-100"
                min={new Date().toISOString().split("T")[0]}
                {...register("employeeDate", {
                  required: {
                    value: true,
                    message: "Please enter date.",
                  },
                })}
              />
              <ErrorMessage message={errors?.employeeDate?.message} />
            </div>
          </Col>
          <Col md={6}>
            <label htmlFor="" className="m-0">
              Supervisor Signature: <RedStar />
            </label>
            <SignPage
              imageName={imageName.supervisorSign}
              register={register("supervisorSign", {
                required: {
                  value: preview.supervisorSign ? false : true,
                  message: "Please select signature",
                },
              })}
              imageRef={imageRef2}
              formView={formView}
              handleImgChange={handleImgChange}
              modalOpen={modalOpen}
              handleSave={handleSave}
              src={src}
              text={"supervisorSign"}
              image={preview?.supervisorSign}
              errorCond={errors?.supervisorSign}
              imageShow={handleObjectLength(currentFormItem.data)}
              errors={<ErrorMessage message="Please select supervisorSign" />}
            />
          </Col>
          <Col md={6}>
            <label htmlFor="" className="m-0">
              Date: <RedStar />
            </label>
            <div className="position-relative">
              <input
                type="date"
                disabled={formView}
                className="form_input w-100"
                min={new Date().toISOString().split("T")[0]}
                {...register("supervisorDate", {
                  required: {
                    value: true,
                    message: "Please enter date.",
                  },
                })}
              />
              <ErrorMessage message={errors?.supervisorDate?.message} />
            </div>
          </Col>
          <Col md={12}>
            <p className="text-center">(I certify that the above hours are correct)</p>
          </Col>
        </Row>
      </div>
      <div className="change_direction">
        {currentFormItem?.formLength === currentFormItem?.indexForm + 1 && (
          <isLastForm.lastForm
            length={currentFormItem?.formLength}
            index={currentFormItem?.indexForm}
            register={register("checkbox", {
              required: "Please select checkbox.",
            })}
            errors={errors}
          />
        )}
        <div className="d-flex pt-4 change_direction">
          {formView !== true && (
            <button className="btn theme_md_btn text-white" onClick={handleSubmit(onSubmit)}>
              {" "}
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTimeSheetForm;
