import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import SignPage from "@/pages/components/SignPage";
import RedStar from "@/pages/components/common/RedStar";

const UnpaidLeaveForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
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

  const [preview, setPreview] = useState({
    image: null,
    supervisorSign: null,
    HRSign: null,
  });
  const [src, setSrc] = useState(null);
  const [imageName, setImageName] = useState({
    image: null,
    supervisorSign: null,
    HRSign: null,
  });
  const [imageData, setImageData] = useState({
    image: null,
    supervisorSign: null,
    HRSign: null,
  });
  const [modalOpen, setModalOpen] = useState({
    image: false,
    supervisorSign: false,
    HRSign: false,
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

  const [checkboxes, setCheckboxes] = useState([
    { label: "Exempt", value: false },
    { label: "Nonexempt", value: false },
    { label: "Full time", value: false },
    { label: "Part time", value: false },
  ]);

  const [radioButton, setRadioButton] = useState([
    {
      label: "Medical",
      radioBox: ["Yes", "No", "N/A"],
      type: "weeklyCost",
      value: undefined,
    },
    {
      label: "Dental",
      radioBox: ["Yes", "No", "N/A"],
      type: "weeklyCost1",
      value: undefined,
    },
    {
      label: "Other:",
      radioBox: ["Yes", "No", "N/A"],
      type: "weeklyCost2",
      value: undefined,
    },
  ]);

  const handleRadioChange = (index, data) => {
    let radioButtons = [...radioButton];
    radioButtons[index].value = data;
    setRadioButton(radioButtons);
  };

  const onSubmit = async (data) => {
    try {
      data.employeeStatus = checkboxes?.find((i) => i.value === true)?.label || "";
      data.weeklyCostEmployee = radioButton?.map((item) => {
        return { label: item?.label, value: item?.value };
      });
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          image: JSON.stringify({ image: imageData.image }),
          supervisorSign: JSON.stringify({
            supervisorSign: imageData.supervisorSign,
          }),
          HRSign: JSON.stringify({ HRSign: imageData.HRSign }),
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

  const handleCheckboxChange = (index) => {
    let checkbox = [...checkboxes];
    checkbox?.map((i) => (i.value = false));
    checkbox[index].value = !checkbox[index].value;
    setCheckboxes(checkbox);
  };

  const commonFunction = (check, setState, value) => {
    let checkBox = [...check];
    const i = checkBox.findIndex((item) => item.label === value);
    if (i !== -1) checkBox[i].value = true;
    setState(checkBox);
  };

  const setRadioBut = (data) => {
    const radioBut = [...radioButton];
    radioButton?.map((item, index) => {
      item.label = data ? data[index]?.label : "";
      item.value = data ? data[index]?.value : "";
    });
    setRadioButton(radioBut);
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
      setRadioBut(currentFormItem?.data?.weeklyCostEmployee);
      commonFunction(checkboxes, setCheckboxes, currentFormItem?.data?.employeeStatus);
      setFileImage("image", currentFormItem.data?.image, "supervisorSign", currentFormItem.data?.supervisorSign, "HRSign", currentFormItem.data?.HRSign);

      reset(currentFormItem.data);
      setValue("image", "");
      setValue("supervisorSign", "");
      setValue("HRSign", "");
    }
  }, [currentFormItem.data]);

  const handleKeyDown = (event) => {
    if (!["Backspace", "Delete", "Tab"].includes(event.key) && !/[0-9.]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleObjectLength = (obj) => Object.keys(obj || {})?.length;

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper">
          <div className="employee_application_form_wrap">
            <div className="text_wrap_row text-center text-dark bg-light p-3">
              <strong className="text-dark text-lg d-block">Unpaid Leave of Absence Request Form</strong>
            </div>

            <div className="text_wrap_row">
              <p>
                An unpaid leave of absence is available in certain circumstances as described in [Company name]’s [insert policy name]. Employees who meet the eligibility criteria for a leave of absence must complete this form at least 30 days prior
                to the commencement of leave or as soon as practicable in the event of an unforeseeable absence. Please note:
              </p>

              <ul>
                <li>All leaves of absence must be approved in advance by human resources (HR) and the employee’s supervisor. </li>

                <li>If the dates of requested leave change, a new leave of absence request form must be submitted for approval.</li>

                <li>Employees on an unpaid leave of absence are responsible for payment of insurance premiums as agreed upon with HR prior to the commencement of leave.</li>

                <li>Employees returning from a leave of absence must contact HR at least one week in advance of the projected return date.</li>
              </ul>

              <em>See [insert policy name] for the full details on unpaid leaves of absence, including eligibility. </em>

              <p>
                This form should not be used to request leave under the Family and Medical Leave Act (FMLA) or to request leave as an accommodation under the Americans with Disabilities Act (ADA). Employees should consult with HR to request leave
                under the FMLA or ADA.
              </p>

              <div className="py-3">
                <strong>To be completed by the employee: </strong>

                <div className="d-flex">
                  <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
                    <label className="me-2">
                      Date of request: <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("createdAT", {
                          required: {
                            value: true,
                            message: "Please enter date.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.createdAT?.message} />
                    </div>
                  </div>
                  <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                    <label className="me-2">
                      Employee name: <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form_input flex-grow-1"
                        disabled={formView}
                        maxLength={15}
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
                </div>

                <div className="d-flex">
                  <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
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
                  <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                    <label className="me-2">
                      Job title: <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form_input flex-grow-1"
                        disabled={formView}
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("jobTitle", {
                          required: {
                            value: true,
                            message: "Please enter job title.",
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
                      <ErrorMessage message={errors?.jobTitle?.message} />
                    </div>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
                    <label className="me-2">Date of hire:</label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("hireDate", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter date.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.hireDate?.message} /> */}
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-3 align-items-center">
                  <strong className="me-3">Employee status: </strong>
                  {checkboxes?.map((item, index) => (
                    <>
                      <label className="me-3" key={index}>
                        <input type="checkbox" disabled={formView} checked={item?.value} onChange={() => handleCheckboxChange(index)} />
                        {item?.label}
                      </label>
                    </>
                  ))}
                </div>

                <div className="d-flex">
                  <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
                    <label className="me-2">Requested leave dates (mm/dd/yy): </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("leaveDate", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter date.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.leaveDate?.message} /> */}
                    </div>
                  </div>
                  <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                    <label className="me-2">to </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("to", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter date.'
                          // }
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                    <label className="me-2">Reason for the leave of absence: </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form_input flex-grow-1"
                        disabled={formView}
                        maxLength={30}
                        onInput={(e) => preventMaxInput(e, 30)}
                        {...register("reasonLeave", {
                          // required: {
                          //   value: true,
                          //   message:
                          //     'Please enter Reason for the leave of absence.'
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
                      <ErrorMessage message={errors?.reasonLeave?.message} />
                    </div>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                    <label className="me-2" style={{ whiteSpace: "normal" }}>
                      I have read and fully understand the information contained in [Company name]’s leave of absence policy.
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form_input flex-grow-1"
                        disabled={formView}
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("companyName", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter company name.'
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
                      <ErrorMessage message={errors?.companyName?.message} />
                    </div>
                  </div>
                </div>

                <div className="text_wrap_row  ">
                  <div className="form_group d-flex flex-wrap align-items-center ">
                    <label className="me-3">
                      Signature of person completing this form: <RedStar />
                    </label>
                    {/* <input type='text' className='form_input flex-grow-1' /> */}
                    {console.log("preview.image", preview.image)}
                    <SignPage
                      imageName={imageName.image}
                      register={register("image", {
                        required: {
                          value: preview.image ? false : true,
                          // message: 'Please select signature'
                        },
                      })}
                      imageRef={imageRef1}
                      formView={formView}
                      handleImgChange={handleImgChange}
                      modalOpen={modalOpen}
                      handleSave={handleSave}
                      src={src}
                      text={"image"}
                      image={preview?.image}
                      errorCond={errors?.image}
                      imageShow={handleObjectLength(currentFormItem.data)}
                      errors={<ErrorMessage message="Please select image." />}
                    />
                  </div>
                  <div className="form_group d-flex align-items-center w-50 ps-3">
                    <label className="me-2">Date:</label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("signDate", {
                          required: {
                            value: true,
                            message: "Please enter date.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.signDate?.message} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <strong>To be completed by the employee’s supervisor:</strong>

                <div className="d-flex align-items-center">
                  <strong className="me-3">Leave request is: </strong>
                  <div className="form_group d-flex flex-wrap align-items-center flex-grow-1 me-3">
                    <label className="me-2">Not approved</label>
                    <input
                      type="text"
                      className="form_input flex-grow-1"
                      disabled={formView}
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("notApproved", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter not approved.'
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
                    <ErrorMessage message={errors?.notApproved?.message} />
                  </div>

                  <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                    <label className="me-2">Approved </label>
                    <input
                      type="text"
                      className="form_input flex-grow-1"
                      disabled={formView}
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("approved", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter approved.'
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
                    <ErrorMessage message={errors?.approved?.message} />
                  </div>
                </div>

                <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                  <label className="me-2">If not approved, provide an explanation: </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form_input flex-grow-1"
                      disabled={formView}
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("HRNotApprovedExplain", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter provide an explanation.'
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
                    <ErrorMessage message={errors?.HRNotApprovedExplain?.message} />
                  </div>
                </div>

                <div className="text_wrap_row d-xl-flex">
                  <div className="form_group d-flex align-items-center w-100 ">
                    <label className="me-2">
                      Supervisor signature: <RedStar />
                    </label>
                    {/* <input type='text' className='form_input flex-grow-1' /> */}
                    <SignPage
                      imageName={imageName.supervisorSign}
                      register={register("supervisorSign", {
                        required: {
                          value: preview.supervisorSign ? false : true,
                          message: "Please select signature",
                        },
                      })}
                      imageRef={imageRef2}
                      handleImgChange={handleImgChange}
                      formView={formView}
                      modalOpen={modalOpen}
                      handleSave={handleSave}
                      src={src}
                      text={"supervisorSign"}
                      image={preview?.supervisorSign}
                      errorCond={errors?.supervisorSign}
                      imageShow={handleObjectLength(currentFormItem.data)}
                      errors={<ErrorMessage message="Please select supervisorSign." />}
                    />
                  </div>
                  <div className="form_group d-flex align-items-center w-100 ps-3">
                    <label className="me-2">
                      Date: <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input flex-grow-1"
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
                  </div>
                </div>
              </div>

              <div className="py-2">
                <strong className="mb-2">To be completed by HR:</strong>

                <div className="d-flex align-items-center">
                  <strong className=" pe-3">Leave request is: </strong>
                  <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                    <label className="me-2">Not approved</label>
                    <input
                      type="text"
                      className="form_input flex-grow-1"
                      disabled={formView}
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("HRNotApproved", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter not approved.'
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
                    <ErrorMessage message={errors?.HRNotApproved?.message} />
                  </div>

                  <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                    <label className="me-2">Approved </label>
                    <input
                      type="text"
                      className="form_input flex-grow-1"
                      disabled={formView}
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("HRApproved", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter not approved.'
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
                    <ErrorMessage message={errors?.HRApproved?.message} />
                  </div>
                </div>

                <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                  <label className="me-2">If not approved, provide an explanation: </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form_input flex-grow-1"
                      disabled={formView}
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("HRNotApprovedExplains", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter provide an explanation.'
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
                    <ErrorMessage message={errors?.HRNotApprovedExplains?.message} />
                  </div>
                </div>

                <div className="text_wrap_row d-xl-flex">
                  <div className="form_group d-flex align-items-center w-100 ">
                    <label className="me-2">
                      HR employee signature: <RedStar />{" "}
                    </label>
                    <SignPage
                      imageName={imageName.HRSign}
                      register={register("HRSign", {
                        required: {
                          value: preview.HRSign ? false : true,
                          message: "Please select signature",
                        },
                      })}
                      imageRef={imageRef3}
                      handleImgChange={handleImgChange}
                      modalOpen={modalOpen}
                      formView={formView}
                      handleSave={handleSave}
                      src={src}
                      text={"HRSign"}
                      image={preview?.HRSign}
                      errorCond={errors?.HRSign}
                      imageShow={handleObjectLength(currentFormItem.data)}
                      errors={<ErrorMessage message="Please select HRSignature." />}
                    />
                  </div>
                  <div className="form_group d-flex align-items-center w-100 ps-3">
                    <label className="me-2">
                      Date: <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("HRDate", {
                          required: {
                            value: true,
                            message: "Please enter date.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.HRDate?.message} />
                    </div>
                  </div>
                </div>

                <div className="text_wrap_row d-lg-flex">
                  <div className="form_group d-flex align-items-center w-50 ">
                    <label className="me-2">Employee’s last day worked: </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form_input flex-grow-1"
                        disabled={formView}
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("lastDayWorked", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter employees last day worked.'
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
                      <ErrorMessage message={errors?.lastDayWorked?.message} />
                    </div>
                  </div>
                  <div className="form_group d-flex align-items-center w-50 ps-3">
                    <label className="me-2">Employee’s return-to-work date: </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("employeeReturnDate", {
                          // required: {
                          //   value: true,
                          //   message:
                          //     'Please enter employees return-to-work date.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage
                        message={errors?.employeeReturnDate?.message}
                      /> */}
                    </div>
                  </div>
                </div>

                <div className="text_wrap_row">
                  <strong>Insurance to be continued and the weekly/monthly cost to employee:</strong>
                  {radioButton?.map((item, index) => (
                    <>
                      <div className="form_group d-flex align-items-center w-50 " key={index}>
                        <strong className="me-2">{item.label}</strong>
                        {item?.radioBox?.map((item2, index2) => (
                          <>
                            <label className="me-2" key={index2}>
                              <input
                                type="checkbox"
                                disabled={formView}
                                checked={item2 === item?.value}
                                // label={item2}
                                id={`check${index + 1}`}
                                name={`check${index + 1}`}
                                onChange={(e) => handleRadioChange(index, item2)}
                              />
                              {item2}
                            </label>
                          </>
                        ))}
                        <div className="position-relative">
                          <input
                            type="number"
                            className="form_input"
                            disabled={formView}
                            maxLength={15}
                            onInput={(e) => preventMaxInput(e, 15)}
                            {...register(item.type, {
                              // required: {
                              //   value: true,
                              //   message: 'Please enter.'
                              // },
                              minLength: {
                                value: 2,
                                message: "Minimum length must be 2.",
                              },
                              maxLength: {
                                value: 50,
                                message: "Maximum length must be 15.",
                              },
                            })}
                          />
                          <ErrorMessage message={errors[item.type]?.message} />
                        </div>
                        <span>$</span>
                      </div>
                    </>
                  ))}
                </div>

                <div className="py-3">
                  <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                    <label className="me-2">Total insurance premium due per week:</label>
                    <span>$</span>
                    <div className="position-relative">
                      <input
                        type="number"
                        className="form_input flex-grow-1"
                        disabled={formView}
                        onKeyDown={(event) => handleKeyDown(event)}
                        {...register("totalInsurancePerWeek", {
                          // required:
                          //   'Please enter total insurance premium due per week.',
                          pattern: {
                            value: /^(?:[1-9]\d*|0)$/,
                            message: "First character can not be 0.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.totalInsurancePerWeek?.message} />
                    </div>
                  </div>

                  <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                    <label className="me-2">Total insurance premium due per month:</label>
                    <span>$</span>
                    <div className="position-relative">
                      <input
                        type="number"
                        className="form_input flex-grow-1"
                        disabled={formView}
                        onKeyDown={(event) => handleKeyDown(event)}
                        {...register("totalInsurancePerMonth", {
                          // required:
                          //   'Please enter total insurance premium due per month.',
                          pattern: {
                            value: /^(?:[1-9]\d*|0)$/,
                            message: "First character can not be 0.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.totalInsurancePerMonth?.message} />
                    </div>
                  </div>
                  <strong className="mt-5 d-block">
                    <em>File original in the employee’s leave records and provide a copy to the employee and the employee’s supervisor. </em>
                  </strong>
                </div>
              </div>
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
      </div>
    </div>
  );
};

export default UnpaidLeaveForm;
