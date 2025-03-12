import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput, validationRules } from "@/utils/constants";
import { Row, Col, InputGroup, Form, FloatingLabel } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import CropperModal from "@/pages/components/CropperModal";
import RedStar from "@/pages/components/common/RedStar";

const AnnualTuberculosisForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const notification = useToastContext();
  const { acceptedJobs, currentFormItem, setCurrentItem } = useContext(AuthContext);

  const [preview, setPreview] = useState(null);
  const [src, setSrc] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageData, setImageData] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const imageRef = useRef(null);

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

  const [checkboxes, setCheckboxes] = useState([
    { label: "Yes", value: false },
    { label: "No", value: false },
  ]);

  const [radioButton, setRadioButton] = useState([
    {
      label: "Unexplained Fevers",
      value: undefined,
    },
    {
      label: "Night Sweats",
      value: undefined,
    },
    {
      label: "Unintentional weight loss",
      value: undefined,
    },
    {
      label: "Cough",
      value: undefined,
    },
    {
      label: "Hoarseness",
      value: undefined,
    },
    {
      label: "Bloody Sputum",
      value: undefined,
    },
    {
      label: "Have you completed INH therapy?",
      value: undefined,
    },
    {
      label: "Have you ever had a BCG vaccine?",
      value: undefined,
    },
    {
      label: "Have you had an x-ray while employed here?",
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
      data.FollowUp = checkboxes?.find((i) => i.value === true)?.label || "";
      data.rating = radioButton;
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
      commonFunction(checkboxes, setCheckboxes, currentFormItem?.data?.FollowUp);
      setRadioButton(currentFormItem?.data?.rating);
      setFileImage(currentFormItem?.data?.image);
      reset(currentFormItem.data);
      setValue("image", "");
    }
  }, [currentFormItem.data]);

  const handleObjectLength = (obj) => Object.keys(obj || {})?.length > 0;

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper">
          <div className="employee_application_form_wrap">
            <div className="text_wrap_row">
              <div className="d-xl-flex align-content-center justify-content-between ">
                <div className="form_group d-flex align-items-center w-50 pe-3">
                  <label className="me-2">
                    Employee Name <RedStar />
                  </label>
                  <div className="position-ralative">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input flex-grow-1"
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
                        pattern: {
                          value: validationRules.characters,
                          message: validationRules.charactersMessage,
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.employeeName?.message} />
                  </div>
                </div>
                <div className="form_group d-flex align-items-center w-50">
                  <label className="me-2">
                    Date: <RedStar />
                  </label>
                  <div className="position-relative">
                    <input
                      type="date"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("createdAt", {
                        required: {
                          value: true,
                          message: "Please enter date.",
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.createdAt?.message} />
                  </div>
                </div>
              </div>
            </div>
            <div className="text_wrap_row text-center text-dark bg-light">
              <strong className="text-lg">ANNUAL TUBERCULOSIS QUESTIONNAIRE</strong>
            </div>
            <div className="text_wrap_row text-center text-dark bg-light my-3">
              <em className="text-md">For personnel who have a known positive PPD and previously negative chest x-ray, you are requested to complete this questionnaire with either a yes or no.</em>
            </div>
            <h6 className="text-dark text-center fw-bold">HAVE YOU NOTICED ANY OF THE FOLLOWING?</h6>

            <div className="text_wrap_row">
              <ol className="border py-3 rounded pe-3">
                {radioButton?.map((item, index) => (
                  <>
                    <li className="text-dark mb-3">
                      <Row>
                        <Col lg={4} className="mb-2">
                          {item?.label}
                        </Col>
                        <Col lg={8}>
                          <div className="ms-auto d-sm-flex align-items-center gap-3">
                            {[1, 0]?.map((data, index2) => (
                              <>
                                <Form.Check type="radio" label={item.label} id="check1" name="group1" className="radio_btn w-sm-50 fullRadioLabel" disabled={formView} onChange={() => handleRadioChange(index, data)} checked={data === item.value} />
                              </>
                            ))}

                            {/* <Form.Check
                              type='radio'
                              label='No'
                              id='check2'
                              name='group1'
                              className='ms-4 radio_btn'
                            /> */}
                          </div>
                        </Col>
                      </Row>
                    </li>
                  </>
                ))}
              </ol>

              <Row className="gx-5">
                <Col md={6}>
                  <div className="form_group">
                    <label className="mx-0 text-sm-center d-block">
                      Employee Signature <RedStar />{" "}
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
                                message: "Please select signature.",
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
                          disabled={formView}
                          accept="image/png, image/jpeg, image/jpg"
                          ref={imageRef}
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
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form_group">
                    <label className="mx-0 text-sm-center d-block">Date </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input w-100"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("employeeDate", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter date.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.employeeDate?.message} /> */}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="my-4 text-dark bg-light p-3">
                <Col md={6}>Follow-up needed</Col>
                <Col md={6}>
                  <div className="ms-auto d-flex gap-3 align-items-center">
                    {checkboxes?.map((item, index) => (
                      <>
                        <Form.Check type="radio" label={item.label} id="check1" name="group1" className="radio_btn fullRadioLabel" disabled={formView} checked={item?.value} onChange={() => handleCheckboxChange(index)} />
                      </>
                    ))}
                  </div>
                </Col>
              </Row>

              <div className="py-3">
                <label className="me-2">
                  Comments: <RedStar />
                </label>
                <div className="position-relative">
                  <Form.Control
                    as="textarea"
                    disabled={formView}
                    placeholder="Comments"
                    style={{ height: "100px" }}
                    maxLength={100}
                    onInput={(e) => preventMaxInput(e, 100)}
                    {...register("comments", {
                      required: {
                        value: true,
                        message: "Please enter comments.",
                      },
                      minLength: {
                        value: 2,
                        message: "Minimum length must be 2.",
                      },
                      maxLength: {
                        value: 100,
                        message: "Maximum length must be 100.",
                      },
                    })}
                  />
                  <ErrorMessage message={errors?.comments?.message} />
                </div>
              </div>

              <div className="py-3">
                <Row className="gx-5">
                  <Col md={6}>
                    <label className="me-2">Company Representative: </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form_input w-100"
                        disabled={formView}
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("companyRepresentative", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter company representative.'
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
                      <ErrorMessage message={errors?.companyRepresentative?.message} />
                    </div>
                  </Col>

                  <Col md={6}>
                    <label className="me-2">Date </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input w-100"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("date", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter date.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.date?.message} /> */}
                    </div>
                  </Col>
                </Row>
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

export default AnnualTuberculosisForm;
