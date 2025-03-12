import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Col, Container, Row, Form, Table, FloatingLabel } from "react-bootstrap";
import { preventMaxInput, validationRules } from "@/utils/constants";
import ErrorMessage from "@/pages/components/ErrorMessage";
import useToastContext from "@/hooks/useToastContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import BasicDatePicker from "@/pages/components/common/BasicDatePicker";
import dayjs from "dayjs";
import AuthContext from "@/context/AuthContext";
import RedStar from "@/pages/components/common/RedStar";
import { useRouter } from "next/router";
import Helpers from "@/utils/helpers";

const EmployeeSalaryForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const notification = useToastContext();
  const { acceptedJobs, currentFormItem, setCurrentItem } = useContext(AuthContext);
  const router = useRouter();
  const [expiryFrom, setExpiryFrom] = useState();
  const [dateErrors, setDateErrors] = useState({
    startDate: "",
    endDate: "",
  });

  const [separationDate, setSeparationDate] = useState();

  const [checkboxes, setCheckboxes] = useState([
    { label: "Type of work", value: false },
    { label: "Compensation", value: false },
    { label: "Lack of recognition", value: false },
    { label: "Relationship with supervisor", value: false },
    { label: "Working conditions", value: false },
    { label: "Family circumstances", value: false },
    { label: "Company culture", value: false },
    { label: "Career advancement opportunity", value: false },
    { label: "Business direction", value: false },
    { label: "Other", value: false },
  ]);

  const [checkboxCompany, setCheckboxCompany] = useState([
    { label: "Yes, without reservations", value: false },
    { label: "Yes, with reservations", value: false },
    { label: " No", value: false },
  ]);

  const [radioBoxes, setRadioBoxes] = useState([
    {
      label: "Demonstrated fair and equal treatment",
      value: undefined,
    },
    {
      label: "Provided recognition on the job",
      value: undefined,
    },
    {
      label: "Developed cooperation and teamwork",
      value: undefined,
    },
    {
      label: "Encouraged/listened to suggestions",
      value: undefined,
    },
    {
      label: "Resolved complaints and problems",
      value: undefined,
    },
    {
      label: "Followed policies and practices",
      value: undefined,
    },
    {
      label: "Communicated well",
      value: undefined,
    },
  ]);
  const [radioButton, setRadioButton] = useState([
    {
      label: "Cooperation within your department",
      value: undefined,
    },
    {
      label: "Cooperation with other departments",
      value: undefined,
    },
    {
      label: "Communication within the company as a whole",
      value: undefined,
    },
    {
      label: "Communication within your department",
      value: undefined,
    },
    {
      label: "Training opportunities provided",
      value: undefined,
    },
    {
      label: "Morale in your department",
      value: undefined,
    },
    {
      label: "Advancement opportunities",
      value: undefined,
    },
    {
      label: "Workload",
      value: undefined,
    },
  ]);
  const [radioButtonCompensation, setRadioButtonCompensation] = useState([
    {
      label: "Base salary",
      value: undefined,
    },
    {
      label: "Incentive pay",
      value: undefined,
    },
    {
      label: "Health insurance",
      value: undefined,
    },
    {
      label: "Dental insurance",
      value: undefined,
    },
    {
      label: "Vision insurance",
      value: undefined,
    },
    {
      label: "Paid time off",
      value: undefined,
    },
    {
      label: "401(k) plan",
      value: undefined,
    },
    {
      label: "Life insurance",
      value: undefined,
    },
    {
      label: "Disability insurance",
      value: undefined,
    },
    {
      label: "Other",
      value: undefined,
    },
  ]);

  const handleDateChange = (start) => {
    setExpiryFrom(dayjs(start).toDate());
  };
  const handleDateSeparation = (end) => {
    setSeparationDate(dayjs(end).toDate());
  };

  const validateFunc = () => {
    if (!expiryFrom && !separationDate) {
      setDateErrors({
        startDate: "Please select hire date.",
        endDate: "Please select separation date.",
      });
      return false;
    }
    if (!expiryFrom) {
      setDateErrors({
        ...dateErrors,
        startDate: "Please select hire date.",
      });
      return false;
    } else {
      setDateErrors({
        ...dateErrors,
        startDate: "",
      });
    }
    if (!separationDate) {
      setDateErrors({
        ...dateErrors,
        endDate: "Please select separation date.",
      });
      return false;
    } else {
      setDateErrors({
        ...dateErrors,
        endDate: "",
      });
    }
    setDateErrors({});
    return true;
  };

  const onSubmit = async (data) => {
    const isValid = validateFunc();
    if (!isValid) return;
    try {
      data.employment = Helpers.orCondition(checkboxes?.find((i) => i.value === true)?.label, "");
      data.superVisor = radioBoxes;
      data.employmentsExperience = radioButton;
      data.compensationBenefits = radioButtonCompensation;
      data.company = Helpers.orCondition(checkboxCompany?.find((i) => i.value === true)?.label, "");
      data.hireDate = expiryFrom;
      data.separationDate = separationDate;
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

  const handleCheckboxChange = (index) => {
    let checkbox = [...checkboxes];
    checkbox?.map((i) => (i.value = false));
    checkbox[index].value = !checkbox[index].value;
    setCheckboxes(checkbox);
    if (index !== 9 && !checkbox[9].value) setValue("other", "");
  };
  const handleCheckboxCompany = (index) => {
    let checkboxWork = [...checkboxCompany];
    checkboxWork?.map((i) => (i.value = false));
    checkboxWork[index].value = !checkboxWork[index].value;
    setCheckboxCompany(checkboxWork);
    if (index !== 2 && !checkboxWork[2].value) setValue("reason", "");
  };

  const handleRadioButtonChange = (index, data) => {
    let radioBox = [...radioBoxes];
    radioBox[index].value = data;
    setRadioBoxes(radioBox);
  };

  const handleRadioChange = (index, data) => {
    let radioButtons = [...radioButton];
    radioButtons[index].value = data;
    setRadioButton(radioButtons);
  };
  const handleRadioCompensation = (index, data) => {
    let radioButtonCompensations = [...radioButtonCompensation];
    radioButtonCompensations[index].value = data;
    setRadioButtonCompensation(radioButtonCompensations);
  };

  useEffect(() => {
    if (dateErrors.startDate || dateErrors.endDate) {
      validateFunc();
    }
  }, [expiryFrom, separationDate]);

  const commonFunction = (check, setState, value) => {
    let checkBox = [...check];
    const i = checkBox.findIndex((item) => item.label === value);
    if (i !== -1) checkBox[i].value = true;
    setState(checkBox);
  };
  useEffect(() => {
    if (Object.keys(currentFormItem?.data || {})?.length) {
      commonFunction(checkboxes, setCheckboxes, currentFormItem?.data?.employment);
      commonFunction(checkboxCompany, setCheckboxCompany, currentFormItem.data?.company);

      setRadioBoxes(currentFormItem.data?.superVisor);
      setRadioButton(currentFormItem.data?.employmentsExperience);
      setRadioButtonCompensation(currentFormItem.data?.compensationBenefits);
      setExpiryFrom(currentFormItem.data?.hireDate);
      setSeparationDate(currentFormItem.data?.separationDate);
      reset(currentFormItem.data);
    }
  }, [currentFormItem.data]);

  console.log("Hire date", currentFormItem.data?.hireDate);
  console.log("seperated", currentFormItem?.data?.separationDate);
  return (
    <div>
      <>
        <div className="employee_survey_form_wrap pt-3 pt-md-5">
          <Container>
            <Form>
              <h2>Employee Survey</h2>
              <Row>
                <Col md={4} sm={6}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>
                      Name <RedStar />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled={formView}
                      placeholder="Name"
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
                        pattern: {
                          value: validationRules.characters,
                          message: validationRules.charactersMessage,
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.name?.message} />
                  </Form.Group>
                </Col>

                <Col md={4} sm={6} className="mb-3">
                  <Form.Label>
                    Hire Date <RedStar />
                  </Form.Label>
                  <BasicDatePicker disabled={formView} handleDateChange={handleDateChange} value={currentFormItem?.data?.hireDate} addFlex={false} errors={dateErrors.endDate} state={expiryFrom} />
                </Col>

                <Col md={4} sm={6}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>
                      Department <RedStar />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled={formView}
                      placeholder="Department"
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
                        pattern: {
                          value: validationRules.characters,
                          message: validationRules.charactersMessage,
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.department?.message} />
                  </Form.Group>
                </Col>
                <Col md={4} sm={6} className="mb-3">
                  <Form.Label>
                    Separation Date <RedStar />
                  </Form.Label>
                  <BasicDatePicker disabled={formView} handleDateChange={handleDateSeparation} value={currentFormItem.data?.separationDate} addFlex={false} errors={dateErrors.endDate} state={separationDate} />
                </Col>

                <Col md={4} sm={6}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>
                      Position <RedStar />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled={formView}
                      placeholder="Position"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("position", {
                        required: {
                          value: true,
                          message: "Please enter position.",
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
                    <ErrorMessage message={errors?.position?.message} />
                  </Form.Group>
                </Col>

                <Col md={4} sm={6}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>
                      Manager <RedStar />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled={formView}
                      placeholder="Manager"
                      maxLength={15}
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
                        pattern: {
                          value: validationRules.characters,
                          message: validationRules.charactersMessage,
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.manager?.message} />
                  </Form.Group>
                </Col>
              </Row>

              <div className="prompted">
                <h4>What prompted you to seek alternative employment? (check all that apply)</h4>

                <Row>
                  {checkboxes?.slice(0, 9)?.map((item, index) => (
                    <>
                      <Col md={4} sm={6}>
                        <label>
                          <input type="checkbox" disabled={formView} checked={item?.value} onChange={() => handleCheckboxChange(index)} />
                          {item?.label}
                        </label>
                      </Col>
                    </>
                  ))}

                  <Col md={4} sm={6}>
                    <label>
                      <input
                        type="checkbox"
                        name="inputBox"
                        disabled={formView}
                        checked={checkboxes[9]?.value}
                        onChange={() => {
                          handleCheckboxChange(9);
                        }}
                      />
                      {checkboxes[9]?.label}
                      {checkboxes[9]?.value && (
                        <span>
                          <input
                            type="text"
                            disabled={formView}
                            maxLength={15}
                            onInput={(e) => preventMaxInput(e, 50)}
                            {...register("other", {
                              required: {
                                value: true,
                                message: "Please enter other employment.",
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
                          <ErrorMessage message={errors?.other?.message} />
                        </span>
                      )}
                    </label>
                  </Col>
                </Row>
              </div>

              <div className="superviser">
                <h4>Please rate your supervisor below using a scale of 1-5, with 5 being strongly agree and 1 being strongly disagree. Please select one response for each statement. </h4>

                <Table responsive className="employeSurve">
                  <thead>
                    <tr>
                      <th>Supervisor/Manager</th>
                      <th>5</th>
                      <th>4</th>
                      <th>3</th>
                      <th>2</th>
                      <th>1</th>
                      <th>N/A</th>
                    </tr>
                  </thead>
                  <tbody>
                    {radioBoxes?.map((item, index) => (
                      <>
                        <tr>
                          <td>{item?.label}</td>
                          {[5, 4, 3, 2, 1, 0]?.map((data, index2) => (
                            <>
                              <td>
                                <Form.Check type="radio" disabled={formView} onChange={() => handleRadioButtonChange(index, data)} checked={data === item.value} />
                              </td>
                            </>
                          ))}
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="superviser">
                <h4>Please rate your employment at {acceptedJobs?.Company?.name} below using a scale of 1-5, with 5 being highly satisfied and 1 being highly dissatisfied. Please select one response for each statement.</h4>

                <Table responsive className="employeSurve">
                  <thead>
                    <tr>
                      <th>Employment experience</th>
                      <th>5</th>
                      <th>4</th>
                      <th>3</th>
                      <th>2</th>
                      <th>1</th>
                      <th>N/A</th>
                    </tr>
                  </thead>
                  <tbody>
                    {radioButton?.map((item, index) => (
                      <>
                        <tr>
                          <td>{item?.label}</td>
                          {[5, 4, 3, 2, 1, 0]?.map((data, index2) => (
                            <>
                              <td>
                                <Form.Check type="radio" disabled={formView} onChange={() => handleRadioChange(index, data)} checked={data === item.value} />
                              </td>
                            </>
                          ))}
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="superviser">
                <h4>Please rate the compensation and benefits at {acceptedJobs?.Company?.name} below using a scale of 1-5, with 5 being highly satisfied and 1 being highly dissatisfied. Please select one response for each statement.</h4>

                <Table responsive className="employeSurve">
                  <thead>
                    <tr>
                      <th>Compensation and benefits</th>
                      <th>5</th>
                      <th>4</th>
                      <th>3</th>
                      <th>2</th>
                      <th>1</th>
                      <th>N/A</th>
                    </tr>
                  </thead>
                  <tbody>
                    {radioButtonCompensation?.map((item, index) => (
                      <>
                        <tr>
                          <td>{item?.label}</td>
                          {[5, 4, 3, 2, 1, 0]?.map((data, index2) => (
                            <>
                              <td>
                                <Form.Check type="radio" disabled={formView} onChange={() => handleRadioCompensation(index, data)} checked={data === item.value} />
                              </td>
                            </>
                          ))}
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="faq_textarea">
                <div className="faq_list">
                  <label>
                    What did you like most about your job and/or this company? <RedStar />
                  </label>
                  <FloatingLabel controlId="floatingTextarea2" label="">
                    <Form.Control
                      as="textarea"
                      disabled={formView}
                      placeholder="Leave a comment here"
                      style={{ height: "100px" }}
                      maxLength={50}
                      onInput={(e) => preventMaxInput(e, 100)}
                      {...register("comment", {
                        required: {
                          value: true,
                          message: "Please enter most about your job and/or this company.",
                        },
                        minLength: {
                          value: 2,
                          message: "Minimum length must be 2.",
                        },
                        maxLength: {
                          value: 50,
                          message: "Maximum length must be 50.",
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.comment?.message} />
                  </FloatingLabel>
                </div>

                <div className="faq_list">
                  <label>
                    What did you like least about your job and/or this company? <RedStar />
                  </label>
                  <FloatingLabel controlId="floatingTextarea2" label="">
                    <Form.Control
                      as="textarea"
                      disabled={formView}
                      placeholder="Leave a comment here"
                      style={{ height: "100px" }}
                      maxLength={50}
                      onInput={(e) => preventMaxInput(e, 50)}
                      {...register("leastComment", {
                        required: {
                          value: true,
                          message: "Please enter least about your job and/or this company.",
                        },
                        minLength: {
                          value: 2,
                          message: "Minimum length must be 2.",
                        },
                        maxLength: {
                          value: 50,
                          message: "Maximum length must be 50.",
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.leastComment?.message} />
                  </FloatingLabel>
                </div>

                <div className="faq_list">
                  <label>
                    Additional comments: <RedStar />
                  </label>
                  <FloatingLabel controlId="floatingTextarea2" label="">
                    <Form.Control
                      as="textarea"
                      disabled={formView}
                      placeholder="Leave a comment here"
                      style={{ height: "100px" }}
                      maxLength={50}
                      onInput={(e) => preventMaxInput(e, 50)}
                      {...register("additionalComment", {
                        required: {
                          value: true,
                          message: "Please enter additional comments.",
                        },
                        minLength: {
                          value: 2,
                          message: "Minimum length must be 2.",
                        },
                        maxLength: {
                          value: 50,
                          message: "Maximum length must be 50.",
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.additionalComment?.message} />
                  </FloatingLabel>
                </div>

                <div className="faq_list">
                  <label>Would you recommend this company to a friend as a place to work? </label>

                  <div className="place_to_work">
                    <Row>
                      {checkboxCompany?.slice(0, 2)?.map((item, index) => (
                        <>
                          <Col md={4} sm={6}>
                            <label>
                              <input type="checkbox" disabled={formView} checked={item?.value} onChange={() => handleCheckboxCompany(index)} />
                              {item?.label}
                            </label>
                          </Col>
                        </>
                      ))}
                      <Col md={4} sm={6}>
                        <label>
                          <input
                            type="checkbox"
                            name="inputBox"
                            disabled={formView}
                            checked={checkboxCompany[2]?.value}
                            onChange={() => {
                              handleCheckboxCompany(2);
                            }}
                          />
                          {checkboxCompany[2]?.label}
                        </label>
                      </Col>
                    </Row>
                    {checkboxCompany[2]?.value && (
                      <div className="if_why_not">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>If no, why not? </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Name"
                            disabled={formView}
                            maxLength={50}
                            onInput={(e) => preventMaxInput(e, 50)}
                            {...register("reasonName", {
                              required: {
                                value: true,
                                message: "Please enter name.",
                              },
                              minLength: {
                                value: 2,
                                message: "Minimum length must be 2.",
                              },
                            })}
                          />
                          <ErrorMessage message={errors?.reasonName?.message} />
                        </Form.Group>
                      </div>
                    )}
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
                        <button
                          className="btn theme_md_btn text-white"
                          onClick={handleSubmit(onSubmit, () => {
                            const isValid = validateFunc();
                            if (!isValid) return;
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
            </Form>
          </Container>
        </div>
      </>
    </div>
  );
};

export default EmployeeSalaryForm;
