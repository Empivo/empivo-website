import React, { useEffect, useContext, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import AuthContext from "@/context/AuthContext";
import { InputGroup, Form } from "react-bootstrap";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import { preventMaxInput } from "@/utils/constants";
import CropperModal from "@/pages/components/CropperModal";
import RedStar from "@/pages/components/common/RedStar";

const JobOfferLetterForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
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

  const [checkboxesAnnually, setCheckboxesAnnually] = useState([
    {
      label: "In this position, you [will] be eligible for employer provided benefits that will be explained in detail by",
      value: false,
    },
    {
      label: "In this position, you [will not] be eligible for employer provided benefits.",
      value: false,
    },
  ]);

  const handleCheckboxAnnually = (index) => {
    let checkbox = [...checkboxesAnnually];
    checkbox?.map((i) => (i.value = false));
    checkbox[index].value = !checkbox[index].value;
    setCheckboxesAnnually(checkbox);
  };
  const commonFunction = (check, setState, value) => {
    let checkBox = [...check];
    const i = checkBox.findIndex((item) => item.label === value);
    if (i !== -1) checkBox[i].value = true;
    setState(checkBox);
  };

  const onSubmit = async (data) => {
    try {
      data.checkboxValue = checkboxesAnnually?.find((i) => i.value === true)?.label || "";
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
      commonFunction(checkboxesAnnually, setCheckboxesAnnually, currentFormItem?.data?.checkboxValue);
      setFileImage(currentFormItem.data?.image);
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
            <div className="text_wrap_row text-center text-dark bg-light p-3">
              <strong className="text-lg">Job Offer Letter- Exempt Positions</strong>
            </div>
            <div className="offer_latter_detail">
              <div className="py-4">
                <div className="text-dark py-1">
                  <strong> {acceptedJobs?.Company?.name} </strong>
                </div>
                <div className="d-flex">
                  <div className="text-dark py-1 flex-grow-1">
                    <div className="position-relative w-100">
                      <input
                        type="text"
                        placeholder="Address"
                        className="form_input w-100"
                        disabled={formView}
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("address", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter address.'
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
                      <ErrorMessage message={errors?.address?.message} />
                    </div>{" "}
                  </div>
                </div>

                <div className="text-dark py-1 d-flex">
                  <div className="position-relative flex-grow-1 pe-3">
                    <input
                      type="text"
                      placeholder="City"
                      disabled={formView}
                      className="form_input w-100"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("city", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter city.'
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
                    <ErrorMessage message={errors?.city?.message} />
                  </div>
                  ,
                  <div className="position-relative flex-grow-1 pe-3">
                    <input
                      type="text"
                      placeholder="State"
                      disabled={formView}
                      className="form_input w-100"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("state", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter state.'
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
                    <ErrorMessage message={errors?.state?.message} />
                  </div>
                  <div className="position-relative flex-grow-1 pe-3">
                    <input
                      type="number"
                      placeholder="Zip"
                      disabled={formView}
                      className="form_input w-100"
                      maxLength={6}
                      {...register("zip", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter zip.'
                        // },
                        minLength: {
                          value: 6,
                          message: "Minimum length must be 6.",
                        },
                        maxLength: {
                          value: 6,
                          message: "Maximum length must be 6.",
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.zip?.message} />
                  </div>{" "}
                </div>

                <div className="text-dark py-1 d-flex">
                  <div className="text-dark py-1  flex-grow-1 pe-3">
                    <div className="position-relative w-100">
                      <input
                        type="date"
                        disabled={formView}
                        placeholder="Date"
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
                    </div>{" "}
                  </div>

                  <div className="text-dark py-1 flex-grow-1 pe-3">
                    <div className="position-relative w-100">
                      <input
                        type="text"
                        placeholder="Name"
                        disabled={formView}
                        className="form_input w-100"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("name", {
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
                      <ErrorMessage message={errors?.name?.message} />
                    </div>{" "}
                  </div>
                  <div className="text-dark py-1 flex-grow-1 pe-3">
                    <div className="position-relative w-100">
                      <input
                        type="text"
                        placeholder="Address"
                        disabled={formView}
                        className="form_input w-100"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("addresses", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter address.'
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
                      <ErrorMessage message={errors?.addresses?.message} />
                    </div>{" "}
                  </div>
                </div>

                <div className="text-dark py-1 d-flex">
                  <div className="position-relative flex-grow-1 pe-3">
                    <input
                      type="text"
                      placeholder="City"
                      disabled={formView}
                      className="form_input w-100"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("city1", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter city.'
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
                    <ErrorMessage message={errors?.city1?.message} />
                  </div>
                  ,{" "}
                  <div className="position-relative flex-grow-1 pe-3">
                    <input
                      type="text"
                      placeholder="State"
                      disabled={formView}
                      className="form_input w-100"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("state1", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter state.'
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
                    <ErrorMessage message={errors?.state1?.message} />
                  </div>{" "}
                  <div className="position-relative flex-grow-1 pe-3">
                    <input
                      type="number"
                      placeholder="Zip"
                      disabled={formView}
                      className="form_input w-100"
                      maxLength={6}
                      {...register("zip1", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter zip.'
                        // },
                        minLength: {
                          value: 6,
                          message: "Minimum length must be 6.",
                        },
                        maxLength: {
                          value: 6,
                          message: "Maximum length must be 6.",
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.zip1?.message} />
                  </div>{" "}
                </div>
              </div>
              <span>
                Dear{" "}
                <div className="position-relative">
                  <input
                    type="text"
                    placeholder="Name"
                    disabled={formView}
                    className="form_input flex-grow-1"
                    maxLength={15}
                    {...register("name1", {
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
                  />{" "}
                  :
                  <ErrorMessage message={errors?.name1?.message} />
                </div>
              </span>
              <span>
                {acceptedJobs?.Company?.name} is pleased to offer you the position of{" "}
                <div className="position-relative">
                  <input
                    type="text"
                    placeholder="Title"
                    disabled={formView}
                    className="form_input flex-grow-1"
                    maxLength={15}
                    {...register("title", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter title.'
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
                  <ErrorMessage message={errors?.title?.message} />
                </div>
                . In this position, you will be reporting to
                <div className="position-relative">
                  <input
                    type="text"
                    placeholder="Name of Supervisor"
                    className="form_input flex-grow-1"
                    disabled={formView}
                    maxLength={15}
                    {...register("supervisorName", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter name of supervisor.'
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

                  <ErrorMessage message={errors?.supervisorName?.message} />
                </div>
                . The starting salary offered for this position is [$xxxx] annually, paid [every two weeks].{" "}
              </span>
              <div className="ps-2 ps-lg-4">
                {checkboxesAnnually?.map((item, index) => (
                  <>
                    <label>
                      <input type="checkbox" className="me-0 me-2" disabled={formView} checked={item?.value} onChange={() => handleCheckboxAnnually(index)} />
                      {item?.label}
                    </label>
                  </>
                ))}
              </div>
              <p>
                Please be advised that your employment with the Company has no specified duration and is at-will. You are therefore free to resign at any time, for any reason, or for no reason at all. Likewise, the Company may terminate its
                employment relationship with you at any time, regardless of the reason.
              </p>

              <p>Your acceptance of this offer and start date with the company are contingent upon the successful completion of our new hire screening and onboarding process.</p>

              <p>During the onboarding process, you will receive more information about {acceptedJobs?.Company?.name}, its policies and procedures, benefit programs, and general employment conditions.</p>

              <p>
                We are excited to have you join the {acceptedJobs?.Company?.name} team. We strive to provide every employee with opportunities for personal and professional growth. Please do not hesitate to contact me at [Phone Number] with any
                questions. We look forward to working with you and hope that your employment at {acceptedJobs?.Company?.name} will be rewarding.
              </p>

              <p>Please sign and email me a copy of this letter with your signature. Please do not hesitate to contact me directly if I can answer any questions you may have.</p>

              <div className="py-1">
                <strong>Sincerely,</strong>
              </div>
              <div className="py-1">
                {" "}
                <strong>Name</strong>
              </div>
              <div className="py-1">
                {" "}
                <strong>Title</strong>
              </div>
            </div>

            <div className="text_wrap_row">
              <div className="form_group d-flex align-items-center">
                <label className="me-2">
                  I accept this offer of employment and will begin work on [date]: <RedStar />
                </label>
                <div className="position-relative">
                  <input
                    type="date"
                    disabled={formView}
                    className="form_input"
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
              </div>
            </div>

            <div className="text_wrap_row d-flex">
              <div className="form_group d-flex align-items-center w-50 pe-3">
                <label className="me-2">
                  Signature: <RedStar />
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
                    {errors?.image && <ErrorMessage message="Please select signature" />}
                  </div>
                  {preview && handleObjectLength(currentFormItem.data) && (
                    <figure className="upload-img">
                      <img src={preview} alt="image" />
                    </figure>
                  )}
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
                    className="form_input"
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

export default JobOfferLetterForm;
