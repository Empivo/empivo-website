import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import CropperModal from "@/pages/components/CropperModal";
import RedStar from "@/pages/components/common/RedStar";

const isFile = (input) => "file" in window && input instanceof File;

const NoticeOfNoncomplianceForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm();
  const notification = useToastContext();
  const router = useRouter();
  const { acceptedJobs, currentFormItem, setCurrentItem } = useContext(AuthContext);
  const [preview, setPreview] = useState(null);
  const [src, setSrc] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageData, setImageData] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const imageRef = useRef(null);

  const [checkboxes, setCheckboxes] = useState([
    {
      label: "Provide valid documentation to human resources that you are fully vaccinated against COVID-19 no later than [date].",
      value: false,
    },
    {
      label: "Submit a request for accommodation for an exception to the vaccination requirement due to a substantiated medical or religious reason no later than [date].",
      value: false,
    },
    {
      label: "Request an unpaid leave of absence of no more than 30 days in order to obtain all required doses of a COVID-19 vaccine.",
      value: false,
    },
    {
      label: "Submit a notice of voluntary resignation effective immediately.]",
      value: false,
    },
  ]);
  const handleImgChange = (e) => {
    const fileSize = (e.target.files[0]?.size / (1024 * 1024)).toFixed(2);
    if (fileSize > 1) {
      notification.error("Please select image below 1 mb");
    } else {
      setSrc(URL?.createObjectURL(e.target.files[0]));
      setModalOpen(true);
      setImageName(e.target.files[0]?.name);
    }
  };
  const onSubmit = async (data) => {
    try {
      data.humanOption = checkboxes?.find((i) => i.value === true)?.label || "";
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          image: JSON.stringify({ image: imageData }),
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

  useEffect(() => {
    if (preview) {
      setValue("image", imageName);
      clearErrors("image");
    }
  }, [preview]);

  const setFileImage = async (image) => {
    if (image) {
      const image1 = JSON.parse(image)?.image;
      setPreview(image1);
      setImageData(image1);
    }
  };

  useEffect(() => {
    if (Object.keys(currentFormItem?.data || {})?.length) {
      commonFunction(checkboxes, setCheckboxes, currentFormItem.data?.humanOption);
      setFileImage(currentFormItem.data?.image);
      reset(currentFormItem.data);
      setValue("image", "");
    }
  }, [currentFormItem.data]);

  const handleObjectLength = (obj) => Object.keys(obj || {})?.length > 0;

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper text-dark">
          <div className="employee_application_form_wrap">
            <div className="text_wrap_row text-center text-dark bg-light mb-4">
              <strong className="text-lg">Notice of Noncompliance with Mandatory Vaccination Policy</strong>
            </div>
            <div className="mediumDeviceFull">
              <div className="d-flex mb-3">
                <label htmlFor="" className="my-0 me-2">
                  Date:
                </label>
                <div className="position-relative w-100">
                  <input
                    type="date"
                    disabled={formView}
                    className="form_input  "
                    min={new Date().toISOString().split("T")[0]}
                    {...register("createdAt", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter date.'
                      // }
                    })}
                  />
                  {/* <ErrorMessage message={errors?.createdAt?.message} /> */}
                </div>
              </div>
              <div className="d-flex mb-3">
                <label htmlFor="" className="my-0 me-2">
                  To:
                </label>
                <div className="position-relative w-100">
                  <input
                    type="text"
                    className="form_input  "
                    disabled={formView}
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("to", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter to.'
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
                  <ErrorMessage message={errors?.to?.message} />
                </div>
              </div>
              <div className="d-flex mb-3">
                <label htmlFor="" className="my-0 me-2">
                  From:
                </label>
                <div className="position-relative w-100">
                  <input
                    type="text"
                    className="form_input "
                    disabled={formView}
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("from", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter from.'
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
                  <ErrorMessage message={errors?.from?.message} />
                </div>
              </div>
            </div>
            <p>RE: Noncompliance with mandatory vaccination policy</p>
            <p>
              {acceptedJobs?.Company?.name} implemented a policy effective
              <div className="position-relative">
                <input
                  type="date"
                  disabled={formView}
                  placeholder="date"
                  className="form_input"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("dates", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter date.'
                    // }
                  })}
                />
                {/* <ErrorMessage message={errors?.dates?.message} /> */}
              </div>{" "}
              requiring all employees to be fully vaccinated against COVID-19 no later than{" "}
              <div className="position-relative">
                <input
                  type="date"
                  disabled={formView}
                  placeholder="date"
                  className="form_input"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("vaccinatedDate", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter date.'
                    // }
                  })}
                />
                {/* <ErrorMessage message={errors?.vaccinatedDate?.message} /> */}
              </div>
              . As of today, you have not provided evidence of your COVID-19 vaccination status and are not in compliance with
              {acceptedJobs?.Company?.name}’s COVID-19 safety policy.{" "}
            </p>
            <p>
              Please choose one of the following options and return this signed form to human resources before{" "}
              <div className="position-relative">
                <input
                  type="date"
                  disabled={formView}
                  placeholder="date"
                  className="form_input"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("humanDate", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter date.'
                    // }
                  })}
                />
                {/* <ErrorMessage message={errors?.humanDate?.message} /> */}
              </div>{" "}
              :
            </p>
            <p>
              <em>[Insert a description of available options. The following are examples.</em>
            </p>
            <ul className="list-unstyled mb-4">
              {checkboxes?.map((item, index) => (
                <>
                  <li className="mb-3">
                    {" "}
                    <Form.Check type="checkbox" label={item?.label} id="check1" name="group1" className="radio_btn" disabled={formView} checked={item?.value} onChange={() => handleCheckboxChange(index)} />
                  </li>
                </>
              ))}
            </ul>

            <Row className="mb-4">
              <Col md="4">
                <label htmlFor="" className="m-0">
                  Employee name <RedStar />
                </label>

                <input
                  type="text"
                  className="form_input w-100"
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
                      message: "Minimum length must be 15.",
                    },
                  })}
                />
                <ErrorMessage message={errors?.employeeName?.message} />
              </Col>
              <Col md="4">
                <label htmlFor="" className="m-0">
                  Employee signature <RedStar />
                </label>
                <div className="signature_pic">
                  <div className="position-relative me-3">
                    <InputGroup>
                      <Form.Control
                        type="text"
                        className="border-end-0"
                        name="image"
                        {...register("image", {
                          required: {
                            value: preview ? false : true,
                            message: "Please select signature",
                          },
                        })}
                        accept="image/png, image/gif, image/jpeg"
                        placeholder={imageName || "Upload"}
                        onClick={(e) => (e.target.value = null)}
                        disabled
                      />

                      <InputGroup.Text>
                        <img src="../../../images/upload.svg" alt="image" />
                      </InputGroup.Text>
                    </InputGroup>

                    <input
                      type="file"
                      name="image"
                      accept="image/png, image/jpeg, image/jpg"
                      ref={imageRef}
                      disabled={formView}
                      className="position-absolute top-0 left-0 opacity-0"
                      onChange={handleImgChange}
                      style={{ width: "100%", height: "100%" }}
                    />
                    <CropperModal modalOpen={modalOpen} src={src} signature={false} setImageData={setImageData} setPreview={setPreview} setModalOpen={setModalOpen} setImageName={setImageName} />
                    {errors?.image && <ErrorMessage message="Please select signature." />}
                  </div>
                  {preview && handleObjectLength(currentFormItem.data) && (
                    <figure className="upload-img">
                      <img src={preview} alt="image" />
                    </figure>
                  )}
                </div>
              </Col>
              <Col md="4">
                <label htmlFor="" className="m-0">
                  Date <RedStar />
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
            </Row>
            <p>
              If you would like to discuss the above options with human resources prior to making a decision, please contact{" "}
              <div className="position-relative">
                <input
                  type="text"
                  disabled={formView}
                  placeholder="Name"
                  className="form_input flex-grow-1"
                  maxLength={15}
                  onInput={(e) => preventMaxInput(e, 15)}
                  {...register("names", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter name.'
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
                <ErrorMessage message={errors?.names?.message} />
              </div>{" "}
              and
              <div className="position-relative">
                <input
                  type="number"
                  placeholder="contact"
                  className="form_input flex-grow-1"
                  disabled={formView}
                  onKeyDown={(event) => {
                    if (!["Backspace", "Delete", "Tab"].includes(event.key) && !/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  {...register("contactInfo", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter contact.'
                    // },
                    minLength: {
                      value: 10,
                      message: "Minimum length should be 10 digits.",
                    },
                    maxLength: {
                      value: 10,
                      message: "Maximum length should be 10 digits.",
                    },
                    pattern: {
                      value: /^(?:[1-9]\d*|0)$/,
                      message: "First character can not be 0.",
                    },
                  })}
                />
                <ErrorMessage message={errors?.contactInfo?.message} />
              </div>{" "}
              information no later than{" "}
              <div className="position-relative">
                <input
                  type="date"
                  disabled={formView}
                  placeholder="date"
                  className="form_input"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("createdAtDate", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter date.'
                    // }
                  })}
                />
                {/* <ErrorMessage message={errors?.createdAtDate?.message} /> */}
              </div>
              .{" "}
            </p>
            <p>Failure to comply with one of the options above, or to return this form to human resources by [date], will result in disciplinary action, up to and including termination of employment.</p>
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

export default NoticeOfNoncomplianceForm;
