import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import { Form, Row, Col } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import RedStar from "@/pages/components/common/RedStar";
import Helpers from "@/utils/helpers";

const DisciplinarCounselingForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const notification = useToastContext();
  const router = useRouter();
  const { acceptedJobs, currentFormItem, setCurrentItem } = useContext(AuthContext);

  const [checkboxes, setCheckboxes] = useState([
    { label: "Coaching", value: false },
    { label: "Verbal warning", value: false },
    { label: "Written warning", value: false },
    { label: "Suspension _____day(s)", value: false },
    { label: "Termination", value: false },
    { label: "Other:", value: false },
  ]);
  const [checkboxesDescription, setCheckboxesDescription] = useState([
    { label: "Absenteeism", value: false },
    { label: "Conduct", value: false },
    { label: "Safety violation", value: false },
    { label: "Policy and/or procedure violation", value: false },
    { label: "Unsatisfactory job performance", value: false },
    { label: "Other:", value: false },
  ]);
  const [checkboxesGoals, setCheckboxesGoals] = useState([
    { label: "Written warning", value: false },
    { label: "Suspension _____day(s)", value: false },
    { label: "Termination", value: false },
    { label: "Other:", value: false },
  ]);

  const onSubmit = async (data) => {
    try {
      data.actionTaken = Helpers.orCondition(checkboxes?.find((i) => i.value === true)?.label, "");
      data.descriptionIssue = Helpers.orCondition(checkboxesDescription?.find((i) => i.value === true)?.label, "");
      data.goals = checkboxesGoals?.find((i) => i.value === true)?.label || "";
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: data,
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
    checkbox?.map((i) => (i.value = false));
    checkbox[index].value = !checkbox[index].value;
    setCheckboxes(checkbox);
  };

  const handleCheckboxDesc = (index) => {
    let checkboxDesc = [...checkboxesDescription];
    checkboxDesc?.map((i) => (i.value = false));
    checkboxDesc[index].value = !checkboxDesc[index].value;
    setCheckboxesDescription(checkboxDesc);
  };
  const handleCheckboxGoals = (index) => {
    let checkboxGoals = [...checkboxesGoals];
    checkboxGoals?.map((i) => (i.value = false));
    checkboxGoals[index].value = !checkboxGoals[index].value;
    setCheckboxesGoals(checkboxGoals);
  };

  const commonFunction = (check, setState, value) => {
    let checkBox = [...check];
    const i = checkBox.findIndex((item) => item.label === value);
    if (i !== -1) checkBox[i].value = true;
    setState(checkBox);
  };

  useEffect(() => {
    if (Object.keys(currentFormItem?.data || {})?.length) {
      commonFunction(checkboxes, setCheckboxes, currentFormItem?.data?.actionTaken);
      commonFunction(checkboxesDescription, setCheckboxesDescription, currentFormItem?.data?.descriptionIssue);
      commonFunction(checkboxesGoals, setCheckboxesGoals, currentFormItem?.data?.goals);
      reset(currentFormItem.data);
    }
  }, [currentFormItem.data]);

  return (
    <div className="employee_application_form py-3">
      <div className="similar_wrapper text-dark">
        <div className="employee_application_form_wrap">
          <div className="text_wrap_row text-center text-dark bg-light mb-4">
            <strong className="text-lg">Disciplinary/Counseling Report</strong>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <label htmlFor="Name">
                Name: <RedStar />
              </label>
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
            </Col>
            <Col md={4}>
              <label htmlFor="Name">
                Dept: <RedStar />
              </label>
              <input
                type="text"
                className="form_input w-100"
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
            </Col>
            <Col md={4}>
              <label htmlFor="Name">Date: </label>
              <input
                type="date"
                className="form_input w-100"
                disabled={formView}
                min={new Date().toISOString().split("T")[0]}
                {...register("counselingDate", {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.counselingDate?.message} /> */}
            </Col>

            <Col md={4}>
              <label htmlFor="Name">Date of occurrence:</label>
              <input
                type="date"
                className="form_input w-100"
                disabled={formView}
                min={new Date().toISOString().split("T")[0]}
                {...register("dateOccurrence", {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter date of occurrence.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.dateOccurrence?.message} /> */}
            </Col>
            <Col md={4}>
              <label htmlFor="Name">Time:</label>
              <input type="time" className="form_input w-100" disabled={formView} {...register("time", {})} />
            </Col>
            <Col md={4}>
              <label htmlFor="Name">
                Location: <RedStar />
              </label>
              <input
                type="text"
                className="form_input w-100"
                disabled={formView}
                maxLength={15}
                onInput={(e) => preventMaxInput(e, 15)}
                {...register("location", {
                  required: {
                    value: true,
                    message: "Please enter location.",
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
              <ErrorMessage message={errors?.location?.message} />
            </Col>
            <Col md={12}>
              <h6 className="fw-bold text-dark">ACTION TAKEN:</h6>
            </Col>
            <Col md={12}>
              {checkboxes?.map((item, index) => (
                <>
                  <Form.Check type="checkbox" label={item.label} id="check1" name="group1" className="radio_btn" disabled={formView} checked={item?.value} onChange={() => handleCheckbox(index)} />
                </>
              ))}
            </Col>
            <Col md={12}>
              <p className="text-dark">(Depending on the nature of the offense, {acceptedJobs?.Company?.name} reserves the right to skip any steps at its discretion.) </p>
            </Col>
            <Col md={12}>
              <h6 className="fw-bold text-dark">DESCRIPTION OF ISSUE:</h6>
            </Col>
            <Col md={12}>
              {checkboxesDescription?.map((item, index) => (
                <>
                  <Form.Check type="checkbox" label={item.label} id="check1" name="group1" className="radio_btn" disabled={formView} checked={item?.value} onChange={() => handleCheckboxDesc(index)} />
                </>
              ))}
            </Col>
            <Col md={12}>
              <h6 className="fw-bold text-dark">EXPLANATION:</h6>
            </Col>
            <Col md={12}>
              <h6 className="fw-bold text-dark">GOALS/CORRECTIVE BEHAVIOR:</h6>
              <p className="text-dark">Should your record continue to be unacceptable in the above area(s), the company will find it necessary to take the following disciplinary action (or more depending on the situation):</p>
            </Col>
            <Col md={6}>
              {checkboxesGoals?.map((item, index) => (
                <>
                  <Form.Check type="checkbox" label={item.label} id="check1" name="group1" className="radio_btn" disabled={formView} checked={item?.value} onChange={() => handleCheckboxGoals(index)} />
                </>
              ))}
            </Col>

            <Col md={12}>
              <h6 className="fw-bold text-dark">EMPLOYEE COMMENTS:</h6>
              <p className="text-dark">
                You are formally being warned to bring to your attention the severity of this situation. Failure to correct this behavior and/or further violation of company policy will result in additional disciplinary action up to and including
                discharge. By signing below you acknowledge that you have received this notice.{" "}
              </p>
            </Col>
            <Col md={8} className="d-flex align-items-center">
              <label htmlFor="">Employee: </label>
              <input
                type="text"
                className="form_input flex-grow-1 ms-2"
                disabled={formView}
                maxLength={15}
                onInput={(e) => preventMaxInput(e, 15)}
                {...register("employee", {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter employee.'
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
              <ErrorMessage message={errors?.employee?.message} />
            </Col>
            <Col md={4} className="d-flex align-items-center">
              <label htmlFor="">Date: </label>
              <input
                type="date"
                className="form_input flex-grow-1 ms-2"
                disabled={formView}
                min={new Date().toISOString().split("T")[0]}
                {...register("createdAT", {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.createdAT?.message} /> */}
            </Col>

            <Col md={8} className="d-flex align-items-center">
              <label htmlFor="">Supervisor: </label>
              <input
                type="text"
                className="form_input flex-grow-1 ms-2"
                disabled={formView}
                maxLength={15}
                onInput={(e) => preventMaxInput(e, 15)}
                {...register("supervisor", {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter supervisor.'
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
              {/* <ErrorMessage message={errors?.supervisor?.message} /> */}
            </Col>
            <Col md={4} className="d-flex align-items-center">
              <label htmlFor="">Date: </label>
              <input
                type="date"
                className="form_input flex-grow-1 ms-2"
                disabled={formView}
                min={new Date().toISOString().split("T")[0]}
                {...register("date", {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.date?.message} /> */}
            </Col>

            <Col md={8} className="d-flex align-items-center">
              <label htmlFor="">HR Manager: </label>
              <input
                type="text"
                className="form_input flex-grow-1 ms-2"
                disabled={formView}
                maxLength={15}
                onInput={(e) => preventMaxInput(e, 15)}
                {...register("HRManager", {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter HR Manager.'
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
              <ErrorMessage message={errors?.HRManager?.message} />
            </Col>
            <Col md={4} className="d-flex align-items-center">
              <label htmlFor="">Date: </label>
              <input
                type="date"
                className="form_input flex-grow-1 ms-2"
                disabled={formView}
                min={new Date().toISOString().split("T")[0]}
                {...register("date1", {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.date1?.message} /> */}
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

export default DisciplinarCounselingForm;
