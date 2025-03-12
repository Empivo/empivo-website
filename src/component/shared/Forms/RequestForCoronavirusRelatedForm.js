import React, { useState, useRef, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { Col, Row } from "react-bootstrap";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import { preventMaxInput } from "@/utils/constants";
import SignPage from "@/pages/components/SignPage";
import RedStar from "@/pages/components/common/RedStar";

const RequestForCoronavirusRelatedForm = ({ formCategoryType, formList, formView, indexForm, isLastForm, formLength, currentItem }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const notification = useToastContext();
  const { acceptedJobs, currentFormItem, setCurrentItem } = useContext(AuthContext);

  const [preview, setPreview] = useState({
    employeeSign: null,
    managerSignature: null,
    HRManagerSignature: null,
  });
  const [src, setSrc] = useState(null);
  const [imageName, setImageName] = useState({
    employeeSign: null,
    managerSignature: null,
    HRManagerSignature: null,
  });
  const [imageData, setImageData] = useState({
    employeeSign: null,
    managerSignature: null,
    HRManagerSignature: null,
  });
  const [modalOpen, setModalOpen] = useState({
    employeeSign: false,
    managerSignature: false,
    HRManagerSignature: false,
  });
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);
  const imageRef3 = useRef(null);

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

  const [checkboxesLeave, setCheckboxesLeave] = useState([
    { label: "I am experiencing symptoms of COVID–19.", value: false },
    {
      label: "I have tested positive for COVID-19 (with or without symptoms).",
      value: false,
    },
    { label: "I am obtaining a COVID-19 vaccination.", value: false },
    {
      label: "I am recovering from an illness related to receiving a COVID-19 vaccination.",
      value: false,
    },
    {
      label: "I am caring for an individual who is experiencing symptoms of COVID-19 or has tested positive for COVID-19.",
      value: false,
    },
    {
      label: "I have been advised by a health care provider to self-quarantine due to concerns related to COVID–19.",
      value: false,
    },
    { label: "Other", value: false },
  ]);

  const onSubmit = async (data) => {
    try {
      data.sickLeaveDue = checkboxesLeave?.find((i) => i.value === true)?.label || "";
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          employeeSign: JSON.stringify({
            employeeSign: imageData.employeeSign,
          }),
          managerSignature: JSON.stringify({
            managerSignature: imageData.managerSignature,
          }),
          HRManagerSignature: JSON.stringify({
            HRManagerSignature: imageData.HRManagerSignature,
          }),
        },
      };
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

  const handleCheckboxLeave = (index) => {
    let checkbox = [...checkboxesLeave];
    checkbox?.map((i) => (i.value = false));
    checkbox[index].value = !checkbox[index].value;
    setCheckboxesLeave(checkbox);
  };

  const commonFunction = (check, setState, value) => {
    let checkBox = [...check];
    const i = checkBox.findIndex((item) => item.label === value);
    if (i !== -1) checkBox[i].value = true;
    setState(checkBox);
  };

  const setFileImage = async (text1, image1, text2, image2, text3, image3) => {
    if (image1 && image2 && image3) {
      const imageData1 = JSON.parse(image1)[text1];
      const imageData2 = JSON.parse(image2)[text2];
      const imageData3 = JSON.parse(image3)[text3];
      setPreview({
        [text1]: imageData1,
        [text2]: imageData2,
        [text3]: imageData3,
      });
      setImageData({
        [text1]: imageData1,
        [text2]: imageData2,
        [text3]: imageData3,
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
      commonFunction(checkboxesLeave, setCheckboxesLeave, currentFormItem.data?.sickLeaveDue);
      setFileImage("employeeSign", currentFormItem.data?.employeeSign, "managerSignature", currentFormItem.data?.managerSignature, "HRManagerSignature", currentFormItem.data?.HRManagerSignature);
      reset(currentFormItem.data);
      setValue("employeeSign", "");
      setValue("managerSignature", "");
      setValue("HRManagerSignature", "");
    }
  }, [currentFormItem.data]);

  const handleObjectLength = (obj) => Object.keys(obj || {})?.length;

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper">
          <div className="employee_application_form_wrap">
            <div className="text_wrap_row text-center text-dark bg-light p-3">
              <strong className="text-dark text-lg d-block">Request for Coronavirus-Related Paid Sick Leave</strong>
            </div>

            <div className="text_wrap_row">
              <p>
                To request paid sick leave for absences related to the coronavirus, please complete the following request form, and submit to your manager or the human resources department either prior to leave or as soon as possible after leave
                commences. Verbal notice will be accepted until a form can be completed.
              </p>

              <strong>Documentation supporting the need for leave must be included with this request. </strong>

              <div className="d-flex flex-wrap">
                <div className="form_group d-flex flex-wrap align-items-center pe-3">
                  <label className="me-2">
                    Employee name: <RedStar />
                  </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form_input flex-grow-1"
                      maxLength={15}
                      disabled={formView}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("employeeName", {
                        required: {
                          value: true,
                          message: "Please enter employee name.",
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
                    <ErrorMessage message={errors?.employeeName?.message} />
                  </div>
                </div>

                <div className="form_group d-flex align-items-center ">
                  <label className="me-2">
                    Department: <RedStar />
                  </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form_input flex-grow-1"
                      disabled={formView}
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("department", {
                        required: {
                          value: true,
                          message: "Please enter department.",
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
                    <ErrorMessage message={errors?.department?.message} />
                  </div>
                </div>
              </div>
              <div className="form_group d-flex align-items-center ">
                <label className="me-2">
                  Manager: <RedStar />
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form_input flex-grow-1"
                    maxLength={15}
                    disabled={formView}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("manager", {
                      required: {
                        value: true,
                        message: "Please enter manager.",
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
                  <ErrorMessage message={errors?.manager?.message} />
                </div>
              </div>

              <div className="d-flex flex-wrap">
                <div className="form_group d-flex align-items-center  pe-3">
                  <label className="me-2">Requested leave start date: </label>
                  <div className="position-relative">
                    <input
                      type="date"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("createdAt", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter requested leave start date.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.createdAt?.message} /> */}
                  </div>
                </div>
                <div className="form_group d-flex align-items-center ">
                  <label className="me-2">End date: </label>
                  <div className="position-relative">
                    <input
                      type="date"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("updatedAt", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter requested end date.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.updatedAt?.message} /> */}
                  </div>
                </div>
              </div>

              <div className="form_group d-flex flex-wrap align-items-center ">
                <label className="me-2">Number of hours of paid sick leave requested: </label>
                <div className="position-relative">
                  <input
                    type="number"
                    className="form_input flex-grow-1"
                    maxLength={15}
                    disabled={formView}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("sickLeaveHours", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter number of hours.'
                      // },
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
                  <ErrorMessage message={errors?.sickLeaveHours?.message} />
                </div>
              </div>
            </div>

            <div className="text_wrap_row">
              <strong>I am requesting this paid sick leave due to my inability to work (or telework) because (check the appropriate reason below):</strong>

              <div className="telework">
                {checkboxesLeave?.map((item, index) => (
                  <>
                    <label>
                      <input type="checkbox" disabled={formView} checked={item?.value} onChange={() => handleCheckboxLeave(index)} />
                      {item?.label}
                    </label>
                  </>
                ))}
              </div>
            </div>

            <div className="text_wrap_row">
              <strong>I have attached appropriate documentation supporting my need for leave.</strong>

              <Row>
                <Col xl={6}>
                  <div className="form_group d-sm-flex align-items-center ">
                    <label className="me-2">
                      Employee signature: <RedStar />
                    </label>
                    <div className="position-relative">
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
                        errors={<ErrorMessage message="Please select employeeSign." />}
                      />
                    </div>
                  </div>
                </Col>

                <Col xl={6}>
                  <div className="form_group d-sm-flex align-items-center ">
                    <label className="me-2">
                      Date <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("date", {
                          required: {
                            value: true,
                            message: "Please enter date.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.date?.message} />
                    </div>
                  </div>
                </Col>

                <Col xl={6}>
                  <div className="form_group d-sm-flex align-items-center ">
                    <label className="me-2">
                      Manager signature: <RedStar />{" "}
                    </label>
                    <div className="position-relative">
                      <SignPage
                        imageName={imageName.managerSignature}
                        register={register("managerSignature", {
                          required: {
                            value: preview.managerSignature ? false : true,
                            message: "Please select signature",
                          },
                        })}
                        imageRef={imageRef2}
                        formView={formView}
                        handleImgChange={handleImgChange}
                        modalOpen={modalOpen}
                        handleSave={handleSave}
                        src={src}
                        text={"managerSignature"}
                        image={preview?.managerSignature}
                        errorCond={errors?.managerSignature}
                        imageShow={handleObjectLength(currentFormItem.data)}
                        errors={<ErrorMessage message="Please select managerSignature." />}
                      />
                    </div>
                  </div>
                </Col>

                <Col xl={6}>
                  <div className="form_group d-sm-flex align-items-center ">
                    <label className="me-2">
                      Date: <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("dates", {
                          required: {
                            value: true,
                            message: "Please enter date.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.dates?.message} />
                    </div>
                  </div>
                </Col>

                <Col xl={6}>
                  <div className="form_group d-sm-flex align-items-center ">
                    <label className="me-2">
                      HR Manager signature: <RedStar />
                    </label>
                    <div className="position-relative">
                      <SignPage
                        imageName={imageName.HRManagerSignature}
                        register={register("HRManagerSignature", {
                          required: {
                            value: preview.HRManagerSignature ? false : true,
                            message: "Please select signature",
                          },
                        })}
                        imageRef={imageRef3}
                        formView={formView}
                        handleImgChange={handleImgChange}
                        modalOpen={modalOpen}
                        handleSave={handleSave}
                        src={src}
                        text={"HRManagerSignature"}
                        image={preview?.HRManagerSignature}
                        errorCond={errors?.HRManagerSignature}
                        imageShow={handleObjectLength(currentFormItem.data)}
                        errors={<ErrorMessage message="Please select HRManagerSignature." />}
                      />
                    </div>
                  </div>
                </Col>

                <Col xl={6}>
                  <div className="form_group d-sm-flex flex-wrap align-items-center ">
                    <label className="me-2">
                      Employee name: <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form_input flex-grow-1"
                        maxLength={15}
                        disabled={formView}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("employName", {
                          required: {
                            value: true,
                            message: "Please enter employee name.",
                          },
                          minLength: {
                            value: 2,
                            message: "Minimum length must be 2.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.employName?.message} />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
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
            <div className="d-flex pt-4">
              {formView !== true && (
                <button className="btn theme_md_btn text-white" onClick={handleSubmit(onSubmit)}>
                  {" "}
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForCoronavirusRelatedForm;
