import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import dayjs from "dayjs";
import { Table } from "react-bootstrap";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import ODatePicker from "@/pages/components/common/ODatePicker";
import Flatpickr from "react-flatpickr";
import SignPage from "@/pages/components/SignPage";
import RedStar from "@/pages/components/common/RedStar";

const EmployeePhysicalForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
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

  const [tuberculosisTable, setTuberculosisTable] = useState([
    {
      label: "MMR",
      startDate: "",
      type: "",
    },
    { label: "Hep B", startDate: "", type: "" },
    { label: "Varicella", startDate: "", type: "" },
    {
      label: "Flu Shot",
      startDate: "",
      type: "",
    },
    {
      label: "Tetanus",
      startDate: "",
      type: "",
    },
    {
      label: "Other:",
      startDate: "",
      type: "",
    },
  ]);

  const [preview, setPreview] = useState({
    signature: null,
    physicianSign: null,
    physicianSigns: null,
  });
  const [src, setSrc] = useState(null);
  const [imageName, setImageName] = useState({
    signature: null,
    physicianSign: null,
    physicianSigns: null,
  });
  const [imageData, setImageData] = useState({
    signature: null,
    physicianSign: null,
    physicianSigns: null,
  });
  const [modalOpen, setModalOpen] = useState({
    signature: false,
    physicianSign: false,
    physicianSigns: false,
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

  const [expiryFrom, setExpiryFrom] = useState();
  const [dateErrors, setDateErrors] = useState({
    startDate: "",
  });

  const validateFunc = () => {
    if (!expiryFrom) {
      setDateErrors({
        startDate: "Please select dob.",
      });
      return false;
    } else {
      setDateErrors({
        ...dateErrors,
        startDate: "",
      });
    }
    setDateErrors({});
    return true;
  };

  const handleDateChange = (start) => {
    setExpiryFrom(dayjs(start).toDate());
  };
  useEffect(() => {
    if (dateErrors.startDate) {
      validateFunc();
    }
  }, [expiryFrom]);

  const onSubmit = async (data) => {
    try {
      const isValidD = validateFunc();
      if (!isValidD) return;
      data.dob = expiryFrom;
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          signature: JSON.stringify({ signature: imageData.signature }),
          physicianSign: JSON.stringify({
            physicianSign: imageData.physicianSign,
          }),
          physicianSigns: JSON.stringify({
            physicianSigns: imageData.physicianSigns,
          }),
        },
      };
      payload.content.tuberculosis = tuberculosisTable;
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
      setExpiryFrom(currentFormItem.data?.dob);
      setTuberculosisTable(currentFormItem?.data?.tuberculosis);
      setFileImage("signature", currentFormItem.data?.signature, "physicianSign", currentFormItem.data?.physicianSign, "physicianSigns", currentFormItem.data?.physicianSigns);
      reset(currentFormItem.data);
      setValue("signature", "");
      setValue("physicianSign", "");
      setValue("physicianSigns", "");
    }
  }, [currentFormItem.data]);

  const handleObjectLength = (obj) => Object.keys(obj || {})?.length;

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper">
          <div className="employee_application_form_wrap">
            <div className="text_wrap_row text-center text-dark bg-light">
              <strong className="text-lg">EMPLOYEE PHYSICAL AND IMMUNIZATION FORM</strong>
            </div>

            <div className="text_wrap_row">
              <div className="py-3">
                <strong className="text-dark">PHYSICAL CONDITION:</strong>
                <div className="d-flex align-content-center justify-content-between">
                  <div className="form_group d-flex align-items-center w-50 pe-3">
                    <label className="me-2">
                      Patients Name <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("patientsName", {
                          required: {
                            value: true,
                            message: "Please enter patients name.",
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
                      <ErrorMessage message={errors?.patientsName?.message} />
                    </div>
                  </div>

                  <div className="form_group d-flex align-items-center w-50">
                    {/* <label className='me-2'>DOB:</label> */}
                    <div className="w-100">
                      <ODatePicker handleDateChange={handleDateChange} disabled={formView} expiryFrom={currentFormItem.data?.dob} addFlex={false} errors={dateErrors} />
                    </div>
                  </div>
                </div>

                <div className="form_group d-flex align-items-center">
                  <label className="me-2">
                    Date of last physical exam: <RedStar />
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
                          message: "Please enter date of last physical exam.",
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.createdAt?.message} />
                  </div>
                </div>

                <div className="form_group d-flex align-items-center">
                  <label className="me-2">I certify that:</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("certify", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter i certify that.'
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
                    <ErrorMessage message={errors?.certify?.message} />
                  </div>
                  <span>is healthy, free from communicable disease, and may work in a health care setting. </span>
                </div>

                <div className="d-flex align-content-center justify-content-between mt-4">
                  <div className="form_group">
                    <label className="me-2">
                      Physician Name <RedStar />
                    </label>
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("physiciansName", {
                        required: {
                          value: true,
                          message: "Please enter physicians name.",
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
                    <ErrorMessage message={errors?.physiciansName?.message} />
                  </div>

                  <div className="form_group">
                    <label className="me-2">
                      Signature <RedStar />
                    </label>
                    <SignPage
                      imageName={imageName.signature}
                      register={register("signature", {
                        required: {
                          value: preview.signature ? false : true,
                          message: "Please select signature",
                        },
                      })}
                      imageRef={imageRef1}
                      formView={formView}
                      handleImgChange={handleImgChange}
                      modalOpen={modalOpen}
                      handleSave={handleSave}
                      src={src}
                      text={"signature"}
                      image={preview?.signature}
                      errorCond={errors?.signature}
                      imageShow={handleObjectLength(currentFormItem.data)}
                      errors={<ErrorMessage message="Please select signature." />}
                    />
                  </div>

                  <div className="form_group">
                    <label className="me-2">Date</label>
                    <input
                      type="date"
                      disabled={formView}
                      className="form_input"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("createdDate", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter date.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.createdDate?.message} /> */}
                  </div>
                </div>
                <hr />
              </div>

              <div className="py-3">
                <strong className="text-dark">TUBERCULOSIS:</strong>

                <Table className="mt-3" striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th> </th>
                      <th>Date Planted</th>
                      <th>Date Read</th>
                      <th>Result</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>PPD</td>
                      <td> </td>
                      <td> </td>
                      <td> </td>
                      <td> </td>
                    </tr>

                    <tr>
                      <td className="bg-black"> </td>
                      <td className="bg-black"> </td>
                      <td className="bg-black"> </td>
                      <td className="bg-black"> </td>
                      <td className="bg-black"> </td>
                    </tr>

                    <tr>
                      <td> </td>
                      <td>Date Given</td>
                      <td>Result</td>
                      <td> </td>
                      <td> </td>
                    </tr>

                    <tr>
                      <td>Chest X-Ray</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>

                <div className="d-flex align-content-center justify-content-between mt-4">
                  <div className="form_group">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("physicianName", {
                        required: {
                          value: true,
                          message: "Please enter physician name.",
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
                    <ErrorMessage message={errors?.physicianName?.message} />
                    <label className="me-2">
                      Physician Name <RedStar />
                    </label>
                  </div>

                  <div className="form_group">
                    <SignPage
                      imageName={imageName.physicianSign}
                      register={register("physicianSign", {
                        required: {
                          value: preview.physicianSign ? false : true,
                          message: "Please select signature",
                        },
                      })}
                      imageRef={imageRef2}
                      formView={formView}
                      handleImgChange={handleImgChange}
                      modalOpen={modalOpen}
                      handleSave={handleSave}
                      src={src}
                      text={"physicianSign"}
                      image={preview?.physicianSign}
                      errorCond={errors?.physicianSign}
                      imageShow={handleObjectLength(currentFormItem.data)}
                      errors={<ErrorMessage message="Please select physicianSign." />}
                    />
                    <label className="me-2">
                      Signature <RedStar />
                    </label>
                  </div>

                  <div className="form_group">
                    <input
                      type="date"
                      disabled={formView}
                      className="form_input"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("date", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter date.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.date?.message} /> */}
                    <label className="me-2">Date</label>
                  </div>
                </div>
                <hr />
              </div>

              <div className="py-3">
                <strong className="text-dark">TUBERCULOSIS:</strong>

                <Table className="mt-3" striped bordered hover responsive style={{ minWidth: "420px" }}>
                  <thead>
                    <tr>
                      <th>Immunization</th>
                      <th>Date Given</th>
                      <th>Titer/Immune</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tuberculosisTable?.map((item, index) => (
                      <>
                        <tr>
                          <td>{item.label} </td>
                          <td>
                            <div className=" ">
                              <Flatpickr
                                className="form-control"
                                disabled={formView}
                                options={{
                                  options: "",
                                  dateFormat: "d-m-Y",
                                  minDate: "today",
                                }}
                                value={item?.startDate || ""}
                                onChange={(date) => {
                                  let selectedDate = new Date(date[0]);
                                  const arr = [...tuberculosisTable];
                                  arr[index].startDate = selectedDate;
                                  setTuberculosisTable(arr);
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <div className=" ">
                              <input
                                type="text"
                                disabled={formView}
                                className="form-control"
                                maxLength={15}
                                onInput={(e) => preventMaxInput(e, 15)}
                                value={item.type}
                                onChange={(e) => {
                                  const arr = [...tuberculosisTable];
                                  arr[index].type = e.target.value;
                                  setTuberculosisTable(arr);
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex align-content-center justify-content-between mt-4">
                  <div className="form_group">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("physicianNames", {
                        required: {
                          value: true,
                          message: "Please enter physician name.",
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
                    <ErrorMessage message={errors?.physicianNames?.message} />
                    <label className="me-2">
                      Physician Name <RedStar />
                    </label>
                  </div>

                  <div className="form_group">
                    <SignPage
                      imageName={imageName.physicianSigns}
                      register={register("physicianSigns", {
                        required: {
                          value: preview.physicianSigns ? false : true,
                          message: "Please select signature",
                        },
                      })}
                      imageRef={imageRef3}
                      formView={formView}
                      handleImgChange={handleImgChange}
                      modalOpen={modalOpen}
                      handleSave={handleSave}
                      src={src}
                      text={"physicianSigns"}
                      image={preview?.physicianSigns}
                      errorCond={errors?.physicianSigns}
                      imageShow={handleObjectLength(currentFormItem.data)}
                      errors={<ErrorMessage message="Please select physicianSigns" />}
                    />
                    <label className="me-2">
                      Signature <RedStar />
                    </label>
                  </div>

                  <div className="form_group">
                    <input
                      type="date"
                      disabled={formView}
                      className="form_input"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("physicianDate", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter date.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.physicianDate?.message} /> */}
                    <label className="me-2">Date</label>
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
                <button
                  className="btn theme_md_btn text-white"
                  onClick={handleSubmit(onSubmit, () => {
                    const isValidD = validateFunc();
                    if (!isValidD) return;
                  })}
                >
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

export default EmployeePhysicalForm;
