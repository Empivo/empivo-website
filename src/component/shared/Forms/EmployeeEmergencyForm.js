import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { InputGroup, Form } from "react-bootstrap";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import CropperModal from "@/pages/components/CropperModal";
import RedStar from "@/pages/components/common/RedStar";

const EmployeeEmergencyForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
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

  const handleKeyDown = (event) => {
    if (!["Backspace", "Delete", "Tab"].includes(event.key) && !/[0-9.]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const onSubmit = async (data) => {
    try {
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
            <div className="text_wrap_row text-center text-dark bg-light">
              <strong className="text-lg">EMPLOYEE EMERGENCY CONTACT FORM</strong>
            </div>

            <div className="text_wrap_row">
              <div className="d-flex flex-wrap flex-grow-1">
                <div className="form_group d-flex align-items-center flex-grow-1 pe-3">
                  <label className="me-2">
                    Name <RedStar />
                  </label>
                  <div className="position-relative w-100">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input w-100"
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
                </div>

                <div className="form_group d-flex align-items-center flex-grow-1">
                  <label className="me-2">
                    Department <RedStar />
                  </label>
                  <div className="position-relative flex-grow-1">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input w-100"
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

              <div className="py-3 flex-grow-1 Emergency_Contact">
                <strong className="text-dark">Personal Contact Info:</strong>

                <div className="d-flex align-items-center">
                  <div className="form_group d-flex align-items-center pe-3 w-50">
                    <label className="me-2">
                      Home Address <RedStar />{" "}
                    </label>
                    <div className="position-relative flex-grow-1">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input w-100"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("address", {
                          required: {
                            value: true,
                            message: "Please enter home address.",
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
                      <ErrorMessage message={errors?.address?.message} />
                    </div>
                  </div>

                  <div className="form_group d-flex align-items-center w-50">
                    <label className="me-2">
                      City, State, ZIP <RedStar />{" "}
                    </label>
                    <div className="position-relative flex-grow-1">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input w-100"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("cityState", {
                          required: {
                            value: true,
                            message: "Please enter city, state, ZIP.",
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
                      <ErrorMessage message={errors?.cityState?.message} />
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">
                      Home Telephone # <RedStar />
                    </label>
                    <div className="position-relative flex-grow-1">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input w-100"
                        onKeyDown={(event) => handleKeyDown(event)}
                        {...register("mobile", {
                          required: "Please enter home telephone.",
                          pattern: {
                            value: /^(?:[1-9]\d*|0)$/,
                            message: "First character can not be 0.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.mobile?.message} />
                    </div>
                  </div>
                  <div className="form_group d-flex align-items-center w-50">
                    <label className="me-2">Cell # </label>
                    <div className="position-relative flex-grow-1">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input w-100"
                        onKeyDown={(event) => handleKeyDown(event)}
                        {...register("cell", {
                          // required: 'Please enter cell.',
                          pattern: {
                            value: /^(?:[1-9]\d*|0)$/,
                            message: "First character can not be 0.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.cell?.message} />
                    </div>
                  </div>
                </div>
                <div className="form_group d-flex align-items-center ">
                  <label className="me-2">
                    Email Address <RedStar />
                  </label>
                  <div className="position-relative  flex-grow-1">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input w-100"
                      onInput={(e) => preventMaxInput(e)}
                      {...register("email", {
                        required: "Please enter email address.",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address.",
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.email?.message} />
                  </div>
                </div>
              </div>

              <div className="py-3 Emergency_Contact">
                <strong className="text-dark">Emergency Contact Info:</strong>

                <div className="d-flex align-content-center justify-content-between">
                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">(1) Name </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("employeeName", {
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
                      <ErrorMessage message={errors?.employeeName?.message} />
                    </div>
                  </div>

                  <div className="form_group d-flex align-items-center w-50">
                    <label className="me-2">Relationship </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("relationship", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter relationship.'
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
                      <ErrorMessage message={errors?.relationship?.message} />
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">Address </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("EmergencyAddress", {
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
                      <ErrorMessage message={errors?.EmergencyAddress?.message} />
                    </div>
                  </div>

                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">City, State, ZIP </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("cityState1", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter city, state, ZIP.'
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
                      <ErrorMessage message={errors?.cityState1?.message} />
                    </div>
                  </div>
                </div>

                <div className="d-flex align-content-center justify-content-between">
                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">Home Telephone # </label>
                    <div className="position-relative">
                      <input
                        type="number"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        onKeyDown={(event) => handleKeyDown(event)}
                        {...register("homeTelephone", {
                          // required: 'Please enter home telephone.',
                          pattern: {
                            value: /^(?:[1-9]\d*|0)$/,
                            message: "First character can not be 0.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.homeTelephone?.message} />
                    </div>
                  </div>

                  <div className="form_group d-flex align-items-center w-50">
                    <label className="me-2">Cell # </label>
                    <div className="position-relative">
                      <input
                        type="number"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        onKeyDown={(event) => handleKeyDown(event)}
                        {...register("emergencyCell", {
                          // required: 'Please enter cell.',
                          pattern: {
                            value: /^(?:[1-9]\d*|0)$/,
                            message: "First character can not be 0.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.emergencyCell?.message} />
                    </div>
                  </div>
                </div>

                <div className="d-flex align-content-center justify-content-between">
                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">Work Telephone # </label>
                    <div className="position-relative">
                      <input
                        type="number"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        onKeyDown={(event) => handleKeyDown(event)}
                        {...register("emergencyTelephone", {
                          // required: 'Please enter work telephone.',
                          pattern: {
                            value: /^(?:[1-9]\d*|0)$/,
                            message: "First character can not be 0.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.emergencyTelephone?.message} />
                    </div>
                  </div>

                  <div className="form_group d-flex align-items-center w-50">
                    <label className="me-2">Employer </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("employer", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter employer.'
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
                      <ErrorMessage message={errors?.employer?.message} />
                    </div>
                  </div>
                </div>

                <div className="d-flex align-content-center justify-content-between">
                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">(2) Name</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
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
                    </div>
                  </div>

                  <div className="form_group d-flex align-items-center w-50">
                    <label className="me-2">Relationship </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("emergencyRelationship", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter relationship.'
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
                      <ErrorMessage message={errors?.emergencyRelationship?.message} />
                    </div>
                  </div>
                </div>

                <div className="d-flex align-content-center justify-content-between">
                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">Address </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("contactAddress", {
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
                      <ErrorMessage message={errors?.contactAddress?.message} />
                    </div>
                  </div>

                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">City, State, ZIP </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("contactState", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter city, state, ZIP.'
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
                      <ErrorMessage message={errors?.contactState?.message} />
                    </div>
                  </div>
                </div>

                <div className="d-flex align-content-center justify-content-between">
                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">Home Telephone # </label>
                    <div className="position-relative">
                      <input
                        type="number"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        onKeyDown={(event) => handleKeyDown(event)}
                        {...register("homeTelephone1", {
                          // required: 'Please enter home telephone.',
                          pattern: {
                            value: /^(?:[1-9]\d*|0)$/,
                            message: "First character can not be 0.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.homeTelephone1?.message} />
                    </div>
                  </div>

                  <div className="form_group d-flex align-items-center w-50">
                    <label className="me-2">Cell #</label>
                    <div className="position-relative">
                      <input
                        type="number"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        onKeyDown={(event) => handleKeyDown(event)}
                        {...register("Cell1", {
                          // required: 'Please enter cell.',
                          pattern: {
                            value: /^(?:[1-9]\d*|0)$/,
                            message: "First character can not be 0.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.Cell1?.message} />
                    </div>
                  </div>
                </div>

                <div className="d-flex align-content-center justify-content-between">
                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">Work Telephone # </label>
                    <div className="position-relative">
                      <input
                        type="number"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        onKeyDown={(event) => handleKeyDown(event)}
                        {...register("emergencyTelephone1", {
                          // required: 'Please enter work telephone.',
                          pattern: {
                            value: /^(?:[1-9]\d*|0)$/,
                            message: "First character can not be 0.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.emergencyTelephone1?.message} />
                    </div>
                  </div>

                  <div className="form_group d-flex align-items-center w-50">
                    <label className="me-2">Employer </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("contactEmployer", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter employer.'
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
                      <ErrorMessage message={errors?.contactEmployer?.message} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-3 Emergency_Contact">
                <strong className="text-dark">Emergency Contact Info:</strong>
                <div className="d-flex align-content-center justify-content-between EmergencyContactForm">
                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">Doctor Name </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("doctorName", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter doctor name.'
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
                      <ErrorMessage message={errors?.doctorName?.message} />
                    </div>
                  </div>

                  <div className="form_group d-flex align-items-center w-50">
                    <label className="me-2">Phone #</label>
                    <div className="position-relative">
                      <input
                        type="number"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        onKeyDown={(event) => handleKeyDown(event)}
                        {...register("phone1", {
                          // required: 'Please enter phone.',
                          pattern: {
                            value: /^(?:[1-9]\d*|0)$/,
                            message: "First character can not be 0.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.phone1?.message} />
                    </div>
                  </div>
                </div>

                <div className="d-flex align-content-center justify-content-between">
                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">Known Allergies </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("allergies", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter known allergies.'
                          // },
                          minLength: {
                            value: 2,
                            message: "Minimum length must be 2.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.allergies?.message} />
                    </div>
                  </div>

                  <div className="form_group d-flex align-items-center w-50">
                    <label className="me-2">Preferred Hospital </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("preferredHospital", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter preferred hospital.'
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
                      <ErrorMessage message={errors?.preferredHospital?.message} />
                    </div>
                  </div>
                </div>

                <div className="form_group">
                  <label className="me-2">I have voluntarily provided the above contact information and authorize</label>
                  <input
                    type="text"
                    disabled={formView}
                    className="form_input flex-grow-1"
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("voluntarilyInfo", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter.'
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
                  <ErrorMessage message={errors?.voluntarilyInfo?.message} />
                  <span>and its representatives to contact any of the above on my behalf in the event of an emergency.</span>
                </div>

                <div className="d-xl-flex align-content-center justify-content-between mt-5">
                  <div className="form_group d-flex align-items-center w-100 pe-3">
                    <label className="me-2">
                      {" "}
                      <b>
                        Employee Signature <RedStar />
                      </b>{" "}
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

                  <div className="form_group d-flex align-items-center w-100">
                    <label className="me-2">Date</label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input"
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

export default EmployeeEmergencyForm;
