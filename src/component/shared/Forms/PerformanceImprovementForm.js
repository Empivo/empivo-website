import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import { Table } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import SignPage from "@/pages/components/SignPage";
import RedStar from "@/pages/components/common/RedStar";

const PerformanceImprovementForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
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
    employeeSign: null,
    supervisorSign: null,
    employeeAcceptedSign: null,
    supervisorAcceptedSign: null,
    ManagerSign: null,
    humanResourcesSign: null,
  });
  const [src, setSrc] = useState(null);
  const [imageName, setImageName] = useState({
    employeeSign: null,
    supervisorSign: null,
    employeeAcceptedSign: null,
    supervisorAcceptedSign: null,
    ManagerSign: null,
    humanResourcesSign: null,
  });
  const [imageData, setImageData] = useState({
    employeeSign: null,
    supervisorSign: null,
    employeeAcceptedSign: null,
    supervisorAcceptedSign: null,
    ManagerSign: null,
    humanResourcesSign: null,
  });
  const [modalOpen, setModalOpen] = useState({
    employeeSign: false,
    supervisorSign: false,
    employeeAcceptedSign: false,
    supervisorAcceptedSign: false,
    ManagerSign: false,
    humanResourcesSign: false,
  });
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);
  const imageRef3 = useRef(null);
  const imageRef4 = useRef(null);
  const imageRef5 = useRef(null);
  const imageRef6 = useRef(null);

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
    { label: "Productivity", value: false },
    { label: "Efficiency", value: false },
    { label: "Teamwork", value: false },
    { label: "Quality", value: false },
    { label: "Attendance", value: false },
    { label: "Conduct", value: false },
    { label: "Other (define):", value: false },
  ]);

  const [checkboxesCheck, setCheckboxesCheck] = useState([
    {
      label: "Performance Action Plan satisfactorily completed on:",
      value: false,
    },
    {
      label: "Corrective Action Required (attach and submit to Human Resources).",
      value: false,
    },
  ]);

  const onSubmit = async (data) => {
    try {
      data.employeePerformance = checkboxes;
      data.checkedValue = checkboxesCheck?.find((i) => i.value === true)?.label || "";
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
          employeeAcceptedSign: JSON.stringify({
            employeeAcceptedSign: imageData.employeeAcceptedSign,
          }),
          supervisorAcceptedSign: JSON.stringify({
            supervisorAcceptedSign: imageData.supervisorAcceptedSign,
          }),
          ManagerSign: JSON.stringify({ ManagerSign: imageData.ManagerSign }),
          humanResourcesSign: JSON.stringify({
            humanResourcesSign: imageData.humanResourcesSign,
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

  const handleCheckbox = (index) => {
    let checkbox = [...checkboxes];
    // checkbox?.map(i => (i.value = false))
    checkbox[index].value = !checkbox[index].value;
    setCheckboxes(checkbox);
  };
  const handleCheckboxCheck = (index) => {
    let checkboxValue = [...checkboxesCheck];
    checkboxValue?.map((i) => (i.value = false));
    checkboxValue[index].value = !checkboxValue[index].value;
    setCheckboxesCheck(checkboxValue);
  };

  const commonFunction = (check, setState, value) => {
    let checkBox = [...check];
    const i = checkBox.findIndex((item) => item.label === value);
    if (i !== -1) checkBox[i].value = true;
    setState(checkBox);
  };

  const setFileImage = async (text1, image1, text2, image2, text3, image3, text4, image4, text5, image5, text6, image6) => {
    if (image1 && image2 && image3) {
      const imageData1 = JSON.parse(image1)[text1];
      const imageData2 = JSON.parse(image2)[text2];
      const imageData3 = JSON.parse(image3)[text3];
      const imageData4 = JSON.parse(image4)[text4];
      const imageData5 = JSON.parse(image5)[text5];
      const imageData6 = JSON.parse(image6)[text6];
      setPreview({
        [text1]: imageData1,
        [text2]: imageData2,
        [text3]: imageData3,
        [text4]: imageData4,
        [text5]: imageData5,
        [text6]: imageData6,
      });
      setImageData({
        [text1]: imageData1,
        [text2]: imageData2,
        [text3]: imageData3,
        [text4]: imageData4,
        [text5]: imageData5,
        [text6]: imageData6,
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
      commonFunction(checkboxesCheck, setCheckboxesCheck, currentFormItem?.data?.checkedValue);
      setCheckboxes(currentFormItem?.data?.employeePerformance);
      setFileImage(
        "employeeSign",
        currentFormItem.data?.employeeSign,
        "supervisorSign",
        currentFormItem.data?.supervisorSign,
        "employeeAcceptedSign",
        currentFormItem.data?.employeeAcceptedSign,
        "supervisorAcceptedSign",
        currentFormItem.data?.supervisorAcceptedSign,
        "ManagerSign",
        currentFormItem.data?.ManagerSign,
        "humanResourcesSign",
        currentFormItem.data?.humanResourcesSign
      );
      reset(currentFormItem.data);
      setValue("employeeSign", "");
      setValue("supervisorSign", "");
      setValue("employeeAcceptedSign", "");
      setValue("supervisorAcceptedSign", "");
      setValue("ManagerSign", "");
      setValue("humanResourcesSign", "");
    }
  }, [currentFormItem.data]);

  const handleObjectLength = (obj) => Object.keys(obj || {})?.length;

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper">
          <div className="employee_application_form_wrap">
            <div className="text_wrap_row text-center text-dark bg-light p-3">
              <strong className="text-dark text-lg d-block">Performance Improvement Plan (PIP)</strong>
            </div>

            <div className="text_wrap_row">
              <div className="py-3">
                <div className="d-flex">
                  <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
                    <label className="me-2">
                      Employee Name: <RedStar />
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
                      Meeting Date: <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        disabled={formView}
                        className="form_input flex-grow-1"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("meetingDate", {
                          required: {
                            value: true,
                            message: "Please enter date.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.meetingDate?.message} />
                    </div>
                  </div>
                  <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                    <label className="me-2">
                      Dept: <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form_input flex-grow-1"
                        disabled={formView}
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("dept", {
                          required: {
                            value: true,
                            message: "Please enter dept.",
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
                      <ErrorMessage message={errors?.dept?.message} />
                    </div>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
                    <label className="me-2">
                      Supervisor Name: <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form_input flex-grow-1"
                        disabled={formView}
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("supervisorName", {
                          required: {
                            value: true,
                            message: "Please enter supervisor name.",
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
                      <ErrorMessage message={errors?.supervisorName?.message} />
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className="pt-4">
                    <strong className="me-3"> Standard(s) of Performance Reviewed:</strong>
                    (check all that apply):
                  </div>

                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    {checkboxes?.map((item, index) => (
                      <>
                        <label className="me-3">
                          <input type="checkbox" disabled={formView} checked={item?.value} onChange={() => handleCheckbox(index)} />
                          {item?.label}
                        </label>
                      </>
                    ))}
                  </div>
                </div>
                <div className="py-4">
                  <strong className="py-2 d-block">Specific examples of current performance under review: </strong>
                  <p>
                    <strong>Improvement Plan </strong>(what is expected, how it should be accomplished, and in what timeframe):{" "}
                  </p>
                </div>

                <div>
                  <strong>Acknowledgment:</strong>
                  <div className="d-flex">
                    <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
                      <label className="me-2">
                        Employee (signature): <RedStar />
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
                        errors={<ErrorMessage message="Please select employeeSign." />}
                      />
                    </div>
                    <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
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
                  <div className="d-flex">
                    <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
                      <label className="me-2 fullLabel">
                        Supervisor (signature): <RedStar />
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
                        errors={<ErrorMessage message="Please select supervisorSign." />}
                      />
                    </div>
                    <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
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

                <div className="py-3">
                  <strong className="mb-3 d-block">Periodic Review Notes</strong>

                  <Table bordered responsive>
                    <thead>
                      <tr>
                        <th>Comments</th>
                        <th>Employee Initials</th>
                        <th>Supervisor Initials</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="bg-light">
                          <input type="text" className="form_input w-100" disabled={formView} maxLength={15} onInput={(e) => preventMaxInput(e, 15)} {...register("periodicComment", {})} />
                        </td>
                        <td>
                          <input type="text" className="form_input w-100" disabled={formView} maxLength={15} onInput={(e) => preventMaxInput(e, 15)} {...register("periodicEmployee", {})} />
                        </td>
                        <td>
                          <input type="text" className="form_input w-100" disabled={formView} maxLength={15} onInput={(e) => preventMaxInput(e, 15)} {...register("periodicSupervisors", {})} />
                        </td>
                        <td>
                          <input type="date" disabled={formView} className="form_input w-100" min={new Date().toISOString().split("T")[0]} {...register("periodicDate", {})} />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                <div>
                  <strong>CHECK ONE: </strong>
                  <div className="d-flex">
                    <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
                      {checkboxesCheck?.slice(0, 1)?.map((item, index) => (
                        <>
                          <label className="me-2 fullLabel" style={{ whiteSpace: "normal" }}>
                            <input type="checkbox" disabled={formView} checked={item?.value} onChange={() => handleCheckboxCheck(index)} />
                            {item.label}{" "}
                          </label>
                        </>
                      ))}

                      {checkboxesCheck[0]?.value && <input type="text" className="form_input" style={{ maxWidth: "120px" }} />}
                      <label className="me-2 fullLabel" style={{ whiteSpace: "normal" }}>
                        <input
                          type="checkbox"
                          disabled={formView}
                          checked={checkboxesCheck[1]?.value}
                          onChange={() => {
                            handleCheckboxCheck(1);
                          }}
                        />
                        {checkboxesCheck[1]?.label}
                      </label>
                    </div>
                  </div>
                  <div>Failure to meet and sustain improved performance may lead to further disciplinary action, up to and including termination. Corrective action may be taken in conjunction with, during, or after the performance plan.</div>
                </div>

                <div className="pt-5">
                  <strong>
                    Reviewed and accepted by: <RedStar />
                  </strong>
                  <div className="d-flex">
                    <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
                      <label className="me-2">Employee (signature):</label>
                      <SignPage
                        imageName={imageName.employeeAcceptedSign}
                        register={register("employeeAcceptedSign", {
                          required: {
                            value: preview.employeeAcceptedSign ? false : true,
                            message: "Please select signature",
                          },
                        })}
                        imageRef={imageRef3}
                        formView={formView}
                        handleImgChange={handleImgChange}
                        modalOpen={modalOpen}
                        handleSave={handleSave}
                        src={src}
                        text={"employeeAcceptedSign"}
                        image={preview?.employeeAcceptedSign}
                        errorCond={errors?.employeeAcceptedSign}
                        imageShow={handleObjectLength(currentFormItem.data)}
                        errors={<ErrorMessage message="Please select employeeAcceptedSign." />}
                      />
                    </div>
                    <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                      <label className="me-2">
                        Date: <RedStar />
                      </label>
                      <div className="position-relative">
                        <input
                          type="date"
                          disabled={formView}
                          className="form_input flex-grow-1"
                          min={new Date().toISOString().split("T")[0]}
                          {...register("reviewAcceptedDate", {
                            required: {
                              value: true,
                              message: "Please enter date.",
                            },
                          })}
                        />
                        <ErrorMessage message={errors?.reviewAcceptedDate?.message} />
                      </div>
                    </div>
                  </div>

                  <span>Review completed by:</span>

                  <div className="d-flex">
                    <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
                      <label className="me-2 fullLabel">
                        Supervisor (signature): <RedStar />
                      </label>
                      <SignPage
                        imageName={imageName.supervisorAcceptedSign}
                        register={register("supervisorAcceptedSign", {
                          required: {
                            value: preview.supervisorAcceptedSign ? false : true,
                            message: "Please select signature",
                          },
                        })}
                        imageRef={imageRef4}
                        formView={formView}
                        handleImgChange={handleImgChange}
                        modalOpen={modalOpen}
                        handleSave={handleSave}
                        src={src}
                        text={"supervisorAcceptedSign"}
                        image={preview?.supervisorAcceptedSign}
                        errorCond={errors?.supervisorAcceptedSign}
                        imageShow={handleObjectLength(currentFormItem.data)}
                        errors={<ErrorMessage message="Please select supervisorAcceptedSign." />}
                      />
                    </div>
                    <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                      <label className="me-2">
                        Date: <RedStar />
                      </label>
                      <div className="position-relative">
                        <input
                          type="date"
                          disabled={formView}
                          className="form_input flex-grow-1"
                          min={new Date().toISOString().split("T")[0]}
                          {...register("reviewCompletedDate", {
                            required: {
                              value: true,
                              message: "Please enter date.",
                            },
                          })}
                        />
                        <ErrorMessage message={errors?.reviewCompletedDate?.message} />
                      </div>
                    </div>
                  </div>

                  <span>Performance Action Plan reviewed by:</span>

                  <div className="d-flex">
                    <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
                      <label className="me-2">
                        Department Manager (signature): <RedStar />
                      </label>
                      <SignPage
                        imageName={imageName.ManagerSign}
                        register={register("ManagerSign", {
                          required: {
                            value: preview.ManagerSign ? false : true,
                            message: "Please select signature",
                          },
                        })}
                        imageRef={imageRef5}
                        formView={formView}
                        handleImgChange={handleImgChange}
                        modalOpen={modalOpen}
                        handleSave={handleSave}
                        src={src}
                        text={"ManagerSign"}
                        image={preview?.ManagerSign}
                        errorCond={errors?.ManagerSign}
                        imageShow={handleObjectLength(currentFormItem.data)}
                        errors={<ErrorMessage message="Please select ManagerSign." />}
                      />
                    </div>
                    <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                      <label className="me-2">
                        Date: <RedStar />
                      </label>
                      <div className="position-relative">
                        <input
                          type="date"
                          disabled={formView}
                          className="form_input flex-grow-1"
                          min={new Date().toISOString().split("T")[0]}
                          {...register("deptManagerDate", {
                            required: {
                              value: true,
                              message: "Please enter date.",
                            },
                          })}
                        />
                        <ErrorMessage message={errors?.deptManagerDate?.message} />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="form_group d-flex flex-wrap align-items-center pe-3 flex-grow-1">
                      <label className="me-2">
                        Human Resources (signature): <RedStar />
                      </label>
                      <SignPage
                        imageName={imageName.humanResourcesSign}
                        register={register("humanResourcesSign", {
                          required: {
                            value: preview.humanResourcesSign ? false : true,
                            message: "Please select signature",
                          },
                        })}
                        imageRef={imageRef6}
                        formView={formView}
                        handleImgChange={handleImgChange}
                        modalOpen={modalOpen}
                        handleSave={handleSave}
                        src={src}
                        text={"humanResourcesSign"}
                        image={preview?.humanResourcesSign}
                        errorCond={errors?.humanResourcesSign}
                        imageShow={handleObjectLength(currentFormItem.data)}
                        errors={<ErrorMessage message="Please select humanResourcesSign." />}
                      />
                    </div>
                    <div className="form_group d-flex flex-wrap align-items-center flex-grow-1">
                      <label className="me-2">
                        Date: <RedStar />
                      </label>
                      <div className="position-relative">
                        <input
                          type="date"
                          disabled={formView}
                          className="form_input flex-grow-1"
                          min={new Date().toISOString().split("T")[0]}
                          {...register("humanDate", {
                            required: {
                              value: true,
                              message: "Please enter date.",
                            },
                          })}
                        />
                        <ErrorMessage message={errors?.humanDate?.message} />
                      </div>
                    </div>
                  </div>

                  <em className="d-block my-4">This performance plan is not intended to be an employment contract or guarantee of continuing employment. </em>

                  <div className="text-dark my-1">Copy: Employee</div>
                  <div className="text-dark my-1">Original: Personnel File</div>
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

export default PerformanceImprovementForm;
