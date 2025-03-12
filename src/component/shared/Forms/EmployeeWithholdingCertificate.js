import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import { Row, Col, Table, InputGroup, Form } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import CropperModal from "@/pages/components/CropperModal";
import RedStar from "@/pages/components/common/RedStar";
import Helpers from "@/utils/helpers";

const EmployeeWithholdingCertificate = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
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

  const [checkboxes, setCheckboxes] = useState([
    { label: "Single or Married filing separately", value: false },
    {
      label: "Married filing jointly or Qualifying surviving spouse",
      value: false,
    },
    {
      label: "Head of household (Check only if you’re unmarried and pay more than half the costs of keeping up a home for yourself and a qualifying individual.)",
      value: false,
    },
  ]);
  const [checkboxesSpouse, setCheckboxesSpouse] = useState([{ value: false }]);
  const handleKeyDown = (event) => {
    if (!["Backspace", "Delete", "Tab"].includes(event.key) && !/[0-9.]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const onSubmit = async (data) => {
    try {
      data.checkedValue = Helpers.orCondition(checkboxes?.find((i) => i.value === true)?.label, "");
      data.checkedValueSpouse = checkboxesSpouse?.find((i) => i.value === true) || "";
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

  const handleCheckbox = (index) => {
    let checkbox = [...checkboxes];
    checkbox?.map((i) => (i.value = false));
    checkbox[index].value = !checkbox[index].value;
    setCheckboxes(checkbox);
  };
  const handleCheckboxSpouse = (index) => {
    let checkbox1 = [...checkboxesSpouse];
    checkbox1?.map((i) => (i.value = false));
    checkbox1[index].value = !checkbox1[index].value;
    setCheckboxes(checkbox1);
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
    }
  };

  useEffect(() => {
    if (Object.keys(currentFormItem?.data || {})?.length) {
      commonFunction(checkboxes, setCheckboxes, currentFormItem?.data?.checkedValue);
      commonFunction(checkboxesSpouse, setCheckboxesSpouse, currentFormItem?.data?.checkedValueSpouse);
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
          <div className="employee_application_form_wrap requestForText employeeWithHolding">
            <div className="Employee_certificate">
              <div className="empc_top_left">
                Form <strong>W-4</strong>
                <p>Department of the Treasury Internal Revenue Service</p>
              </div>

              <div className="empc_center_title">
                <strong className="text-xl  text-xl-xxl">Employee’s Withholding Certificate</strong>
                <small>Complete Form W-4 so that your employer can withhold the correct federal income tax from your pay. Give Form W-4 to your employer.</small>
                <small>Your withholding is subject to review by the IRS.</small>
              </div>

              <div className="omb_number">
                OMB No. 1545-0074<strong>2023</strong>
              </div>
            </div>

            <div className="step_outer_wrap">
              <strong className="step_left_title">Step 1: Enter Personal Information</strong>
              <div className="step_form">
                <div className="step_block">
                  <strong className="step_number">a</strong>
                  <Row>
                    <Col md={6}>
                      <div className="form_group">
                        <label bel className="me-2">
                          First name <RedStar />
                        </label>
                        <input
                          type="text"
                          className="form_input flex-grow-1"
                          disabled={formView}
                          maxLength={15}
                          onInput={(e) => preventMaxInput(e, 15)}
                          {...register("firstName", {
                            required: {
                              value: true,
                              message: "Please enter first name.",
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
                        <ErrorMessage message={errors?.firstName?.message} />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="form_group">
                        <label className="me-2">
                          Last name <RedStar />
                        </label>
                        <input
                          type="text"
                          className="form_input flex-grow-1"
                          disabled={formView}
                          maxLength={15}
                          onInput={(e) => preventMaxInput(e, 15)}
                          {...register("lastName", {
                            required: {
                              value: true,
                              message: "Please enter last name.",
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
                        <ErrorMessage message={errors?.lastName?.message} />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form_group">
                        <label className="me-2">
                          Address <RedStar />
                        </label>
                        <input
                          type="text"
                          className="form_input flex-grow-1"
                          disabled={formView}
                          maxLength={15}
                          onInput={(e) => preventMaxInput(e, 15)}
                          {...register("address", {
                            required: {
                              value: true,
                              message: "Please enter address.",
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
                    </Col>

                    <Col md={6}>
                      <div className="form_group">
                        <label className="me-2">
                          City or town, state, and ZIP code <RedStar />
                        </label>
                        <input
                          type="text"
                          className="form_input flex-grow-1"
                          disabled={formView}
                          maxLength={15}
                          onInput={(e) => preventMaxInput(e, 15)}
                          {...register("city", {
                            required: {
                              value: true,
                              message: "Please enter city.",
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
                        <ErrorMessage message={errors?.city?.message} />
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="step_block">
                  <strong className="step_number">b</strong>

                  <div className="form_group">
                    <label bel className="me-2">
                      Social security number <RedStar />
                    </label>
                    <input
                      type="number"
                      className="form_input flex-grow-1"
                      disabled={formView}
                      maxLength={9}
                      onKeyDown={(event) => handleKeyDown(event)}
                      {...register("socialSecurity", {
                        required: "Please enter social security number.",
                        minLength: {
                          value: 9,
                          message: "Minimum length should be 9 digits.",
                        },
                        maxLength: {
                          value: 9,
                          message: "Maximum length should be 9 digits.",
                        },
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: "First character can not be 0.",
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.socialSecurity?.message} />d
                  </div>
                  <div className="form_caption py-3">
                    <strong className="text-dark d-block">Does your name match the name on your social security card?</strong>
                    If not, to ensure you get credit for your earnings, contact SSA at 800-772-1213 or go to www.ssa.gov.
                  </div>
                </div>

                <div className="step_block">
                  <strong className="step_number">c</strong>
                  <div className="status_block">
                    {checkboxes?.map((item, index) => (
                      <>
                        <label>
                          <input type="checkbox" disabled={formView} checked={item?.value} onChange={() => handleCheckbox(index)} />
                          {item?.label}
                        </label>
                      </>
                    ))}
                  </div>
                </div>

                <div className="form_caption py-3 ">
                  <strong className="text-dark d-block">Complete Steps 2–4 ONLY if they apply to you; otherwise, skip to Step 5.</strong>
                  See page 2 for more information on each step, who can claim exemption from withholding, other details, and privacy.
                </div>
              </div>
            </div>

            <div className="step_outer_wrap">
              <strong className="step_left_title">Step 2: Multiple Jobs or Spouse Works</strong>
              <div className="step_form">
                <div className="step_block">
                  <p>Complete this step if you (1) hold more than one job at a time, or (2) are married filing jointly and your spouse also works. The correct amount of withholding depends on income earned from all of these jobs.</p>

                  <div className="step_point_block">
                    <strong className="text-dark">Do only one of the following</strong>
                    <ul className="list-unstyled ps-4">
                      <li>
                        <b className="text-dark">a</b> Reserved for future use
                      </li>
                      <li>
                        <b className="text-dark">b</b> Use the Multiple Jobs Worksheet on page 3 and enter the result in Step 4(c) below; or
                      </li>
                      <li>
                        <b className="text-dark">c</b> If there are only two jobs total, you may check this box. Do the same on Form W-4 for the other job. This option is generally more accurate than (b) if pay at the lower paying job is more than
                        half of the pay at the higher paying job. Otherwise, (b) is more accurate . . . . . . . . . . . . . . . . . .
                        {checkboxesSpouse?.map((item, index) => (
                          <>
                            <input type="checkbox" disabled={formView} checked={item?.value} onChange={() => handleCheckboxSpouse(index)} />
                          </>
                        ))}
                        {/* <input type='checkbox' disabled={formView} /> */}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="step_inner_wrap">
                <div className="step-caption py-2">
                  <strong className="text-dark me-2"> TIP:</strong> If you have self-employment income, see page 2
                </div>

                <div className="step-caption py-2">
                  <strong className="text-dark me-2">Complete Steps 3–4(b) on Form W-4 for only ONE of these jobs.</strong>
                  Leave those steps blank for the other jobs. (Your withholding will be most accurate if you complete Steps 3–4(b) on the Form W-4 for the highest paying job.)
                </div>

                <div className="step-caption py-2">
                  <strong className="text-dark me-2"> TIP:</strong> If you have self-employment income, see page 2
                </div>

                <div className="step-caption ">
                  <strong className="text-dark me-2">Complete Steps 3–4(b) on Form W-4 for only ONE of these jobs.</strong>
                  Leave those steps blank for the other jobs. (Your withholding will be most accurate if you complete Steps 3–4(b) on the Form W-4 for the highest paying job.)
                </div>
              </div>
            </div>

            <div className="step_outer_wrap  pb-3  claim_dependent_table pt-0">
              <Table responsive className="step-caption step-caption_left w-100">
                <tr>
                  <td>
                    <strong className="step_left_title d-block mb-2 mt-3 ">Step 3: Claim Dependent and Other Credits</strong>
                    <div className="py-3">
                      If your total income will be $200,000 or less ($400,000 or less if married filing jointly):
                      <div className="py-2 text-dark">
                        <b>Multiply the number of qualifying children under age 17 by $2,000</b>
                        <div className="d-block">
                          <span className="me-2">$</span>
                          <input
                            type="number"
                            onKeyDown={(event) => handleKeyDown(event)}
                            disabled={formView}
                            {...register("underAge", {
                              // required:
                              //   'Please enter multiply the number of qualifying children under age.',
                              pattern: {
                                value: /^(?:[1-9]\d*|0)$/,
                                message: "First character can not be 0.",
                              },
                            })}
                          />
                          <ErrorMessage message={errors?.underAge?.message} />
                        </div>
                      </div>
                      <div className="py-2 text-dark">
                        <b>Multiply the number of other dependents by $500 . . . . .</b>
                        <div className="d-block">
                          <span className="me-2">$</span>
                          <input
                            type="number"
                            disabled={formView}
                            onKeyDown={(event) => handleKeyDown(event)}
                            {...register("otherDependents", {
                              // required:
                              //   'Please enter Multiply the number of other dependents.',
                              pattern: {
                                value: /^(?:[1-9]\d*|0)$/,
                                message: "First character can not be 0.",
                              },
                            })}
                          />
                          <ErrorMessage message={errors?.otherDependents?.message} />
                        </div>
                      </div>
                      <p>Add the amounts above for qualifying children and other dependents. You may add to this the amount of any other credits. Enter the total here . . . . . . . . . .</p>
                    </div>
                  </td>
                  <td className="table_border bottom_align">
                    <div className="ms-count">
                      <div>4(a)</div>
                    </div>
                  </td>

                  <td className="bottom_align">
                    <div className="step_right_bar">
                      {" "}
                      <div className="ms-_formdolor d-flex align-items-center">
                        <span className="me-2">$</span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("creditA", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </Table>
            </div>

            <div className="step_outer_wrap pt-0 border-bottom-0">
              <div className=" claim_dependent_table">
                <Table responsive className="step-caption step-caption_left w-100">
                  <tr>
                    <td>
                      <strong className="step_left_title d-block mb-2 mt-3 ">Step 4 (optional): Other Adjustments</strong>
                      <div className="py-3">
                        <b className="text-dark"> (a) Other income (not from jobs).</b> If you want tax withheld for other income you expect this year that won’t have withholding, enter the amount of other income here. This may include interest,
                        dividends, and retirement income . . . . . . . .
                      </div>
                    </td>
                    <td className="table_border bottom_align">
                      <div className="ms-count">
                        <div>4(a)</div>
                      </div>
                    </td>

                    <td className="bottom_align">
                      <div className="step_right_bar">
                        {" "}
                        <div className="ms-_formdolor d-flex align-items-center">
                          <span className="me-2">$</span>
                          <input
                            type="text"
                            disabled={formView}
                            {...register("adjustmentA", {
                              // required:
                              //   'Please enter multiply the number of qualifying children under age.',
                              pattern: {
                                value: /^(?:[1-9]\d*|0)$/,
                                message: "First character can not be 0.",
                              },
                            })}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="py-3">
                        <b className="text-dark">(b) Deductions.</b>If you expect to claim deductions other than the standard deduction and want to reduce your withholding, use the Deductions Worksheet on page 3 and enter the result here . . . . . .
                        . . . . . . . . . . . . . . . . .
                      </div>
                    </td>
                    <td className="table_border bottom_align">
                      <div className="ms-count">
                        <div>4(b)</div>
                      </div>
                    </td>

                    <td className="bottom_align">
                      <div className="step_right_bar">
                        {" "}
                        <div className="ms-_formdolor d-flex align-items-center">
                          <span className="me-2">$</span>
                          <input
                            type="text"
                            disabled={formView}
                            {...register("adjustmentB", {
                              // required:
                              //   'Please enter multiply the number of qualifying children under age.',
                              pattern: {
                                value: /^(?:[1-9]\d*|0)$/,
                                message: "First character can not be 0.",
                              },
                            })}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="py-3">
                        <b className="text-dark">(c) Extra withholding. </b> Enter any additional tax you want withheld each pay period . .
                      </div>
                    </td>
                    <td className="table_border bottom_align">
                      <div className="ms-count">
                        <div>4(c)</div>
                      </div>
                    </td>

                    <td className="bottom_align">
                      <div className="step_right_bar">
                        {" "}
                        <div className="ms-_formdolor d-flex align-items-center">
                          <span className="me-2">$</span>
                          <input
                            type="text"
                            disabled={formView}
                            {...register("adjustmentC", {
                              // required:
                              //   'Please enter multiply the number of qualifying children under age.',
                              pattern: {
                                value: /^(?:[1-9]\d*|0)$/,
                                message: "First character can not be 0.",
                              },
                            })}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </Table>
              </div>
            </div>

            <div className="step_outer_wrap pt-0 border-bottom-0">
              <div className=" claim_dependent_table border-bottom-0">
                <strong className="step_left_title d-block mb-2 mt-3 ">Step 5: Sign Here</strong>

                <div className="step-caption">
                  <p>Under penalties of perjury, I declare that this certificate, to the best of my knowledge and belief, is true, correct, and complete.</p>

                  <div className="text_wrap_row d-flex">
                    <div className="form_group w-50 px-2">
                      <label className="me-2">
                        <b>
                          Employee’s signature <RedStar />
                        </b>{" "}
                        (This form is not valid unless you sign it.)
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
                    </div>
                    <div className="form_group  w-50 px-2">
                      <label className="me-2">
                        Date <RedStar />
                      </label>
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
                  </div>
                </div>
              </div>
            </div>

            <div className="step_outer_wrap pt-0 border-bottom-0">
              <div className=" claim_dependent_table border-bottom-0">
                <div className="step_block">
                  <strong className="step_left_title d-block mb-2 mt-3 ">Employers Only</strong>
                  <Table responsive className="step-caption step-caption_left w-100 mb-2">
                    <tr>
                      <td>
                        <div className="form_group">
                          <label className="me-2">
                            Employer’s name and address <RedStar />
                          </label>
                          <input
                            type="text"
                            className="form_input"
                            disabled={formView}
                            maxLength={15}
                            onInput={(e) => preventMaxInput(e, 15)}
                            {...register("employeeNameAddress", {
                              required: {
                                value: true,
                                message: "Please enter employers name and address.",
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
                          <ErrorMessage message={errors?.employeeNameAddress?.message} />
                        </div>
                      </td>
                      <td>
                        <div className="form_group">
                          <label className="me-2">First date of employment</label>
                          <input
                            type="date"
                            disabled={formView}
                            className="form_input"
                            //min={new Date().toISOString().split('T')[0]}
                            {...register("firstDateEmployment", {
                              // required: {
                              //   value: true,
                              //   message:
                              //     'Please enter first date of employment.'
                              // }
                            })}
                          />
                          {/* <ErrorMessage
                            message={errors?.firstDateEmployment?.message}
                          /> */}
                        </div>
                      </td>
                    </tr>
                  </Table>
                </div>
              </div>
            </div>

            <div className="privacy_Act d-flex align-items-center justify-content-between text-dark bg-light p-3">
              <span>For Privacy Act and Paperwork Reduction Act Notice, see page 3.</span>
              <span>Cat. No. 10220Q</span>
              <span>Form W-4 (2023)</span>
            </div>

            <div className="steps_article_part mt-4">
              <Row>
                <Col lg={6}>
                  <div className="steps_article_block">
                    <strong className="text-dark text-xl">General Instructions</strong>
                    <p>Section references are to the Internal Revenue Code.</p>
                  </div>

                  <div className="steps_article_block">
                    <strong className="text-dark text-xl">Future Developments</strong>
                    <p>For the latest information about developments related to Form W-4, such as legislation enacted after it was published, go to www.irs.gov/FormW4.</p>
                  </div>

                  <div className="steps_article_block">
                    <strong className="text-dark text-xl">Purpose of Form</strong>
                    <p>
                      Complete Form W-4 so that your employer can withhold the correct federal income tax from your pay. If too little is withheld, you will generally owe tax when you file your tax return and may owe a penalty. If too much is
                      withheld, you will generally be due a refund. Complete a new Form W-4 when changes to your personal or financial situation would change the entries on the form. For more information on withholding and when you must furnish a new
                      Form W-4, see Pub. 505, Tax Withholding and Estimated Tax.
                    </p>
                  </div>

                  <div className="steps_article_block">
                    <strong className="step_left_title">Exemption from withholding.</strong>
                    <p>
                      You may claim exemption from withholding for 2023 if you meet both of the following conditions: you had no federal income tax liability in 2022 and you expect to have no federal income tax liability in 2023. You had no federal
                      income tax liability in 2022 if (1) your total tax on line 24 on your 2022 Form 1040 or 1040-SR is zero (or less than the sum of lines 27, 28, and 29), or (2) you were not required to file a return because your income was below
                      the filing threshold for your correct filing status. If you claim exemption, you will have no income tax withheld from your paycheck and may owe taxes and penalties when you file your 2023 tax return. To claim exemption from
                      withholding, certify that you meet both of the conditions above by writing “Exempt” on Form W-4 in the space below Step 4(c). Then, complete Steps 1(a), 1(b), and 5. Do not complete any other steps. You will need to submit a new
                      Form W-4 by February 15, 2024.
                    </p>
                  </div>

                  <div className="steps_article_block">
                    <strong className="step_left_title">Your privacy.</strong>
                    <p>If you have concerns with Step 2(c), you may choose Step 2(b); if you have concerns with Step 4(a), you may enter an additional amount you want withheld per pay period in Step 4(c).</p>
                  </div>

                  <div className="steps_article_block">
                    <strong className="step_left_title">Self-employment. </strong>
                    <p>
                      Generally, you will owe both income and self-employment taxes on any self-employment income you receive separate from the wages you receive as an employee. If you want to pay income and self-employment taxes through withholding
                      from your wages, you should enter the self-employment income on Step 4(a). Then compute your self-employment tax, divide that tax by the number of pay periods remaining in the year, and include that resulting amount per pay
                      period on Step 4(c). You can also add half of the annual amount of self-employment tax to Step 4(b) as a deduction. To calculate self-employment tax, you generally multiply the self-employment income by 14.13% (this rate is a
                      quick way to figure your selfemployment tax and equals the sum of the 12.4% social security tax and the 2.9% Medicare tax multiplied by 0.9235). See Pub. 505 for more information, especially if the sum of self-employment income
                      multiplied by 0.9235 and wages exceeds $160,200 for a given individual.
                    </p>
                  </div>

                  <div className="steps_article_block">
                    <strong className="step_left_title">Nonresident alien.</strong>
                    <p>If you’re a nonresident alien, see Notice 1392, Supplemental Form W-4 Instructions for Nonresident Aliens, before completing this form.</p>
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="steps_article_block">
                    <strong className="text-dark text-xl">Specific Instructions</strong>
                    <div className="steps_article_block">
                      <strong className="step_left_title">Step 1(c).</strong>
                      <p>Check your anticipated filing status. This will determine the standard deduction and tax rates used to compute your withholding.</p>
                    </div>

                    <div className="steps_article_block">
                      <strong className="step_left_title">Step 2. </strong>
                      <p>Use this step if you (1) have more than one job at the same time, or (2) are married filing jointly and you and your spouse both work.</p>
                      <p>
                        If you (and your spouse) have a total of only two jobs, you may check the box in option (c). The box must also be checked on the Form W-4 for the other job. If the box is checked, the standard deduction and tax brackets will
                        be cut in half for each job to calculate withholding. This option is roughly accurate for jobs with similar pay; otherwise, more tax than necessary may be withheld, and this extra amount will be larger the greater the
                        difference in pay is between the two jobs.
                      </p>
                    </div>
                    <div className="steps_article_block">
                      <strong className="step_left_title">Multiple jobs. </strong>
                      <em>Complete Steps 3 through 4(b) on only one Form W-4. Withholding will be most accurate if you do this on the Form W-4 for the highest paying job.</em>
                    </div>

                    <div className="steps_article_block">
                      <strong className="step_left_title">Step 3.</strong>
                      <p>
                        This step provides instructions for determining the amount of the child tax credit and the credit for other dependents that you may be able to claim when you file your tax return. To qualify for the child tax credit, the child
                        must be under age 17 as of December 31, must be your dependent who generally lives with you for more than half the year, and must have the required social security number. You may be able to claim a credit for other dependents
                        for whom a child tax credit can’t be claimed, such as an older child or a qualifying relative. For additional eligibility requirements for these credits, see Pub. 501, Dependents, Standard Deduction, and Filing Information.
                        You can also include
                        <b>other tax credits</b> for which you are eligible in this step, such as the foreign tax credit and the education tax credits. To do so, add an estimate of the amount for the year to your credits for dependents and enter the
                        total amount in Step 3. Including these credits will increase your paycheck and reduce the amount of any refund you may receive when you file your tax return.
                      </p>
                    </div>

                    <div className="steps_article_block">
                      <strong className="text-dark text-lg">Step 4 (optional).</strong>
                      <div className="steps_article_block_secondry">
                        <strong>Step 4(a).</strong>
                        <p>
                          Enter in this step the total of your other estimated income for the year, if any. You shouldn’t include income from any jobs or self-employment. If you complete Step 4(a), you likely won’t have to make estimated tax payments
                          for that income. If you prefer to pay estimated tax rather than having tax on other income withheld from your paycheck, see Form 1040-ES, Estimated Tax for Individuals.
                        </p>
                      </div>

                      <div className="steps_article_block_secondry">
                        <strong>Step 4(b).</strong>
                        <p>
                          Enter in this step the amount from the Deductions Worksheet, line 5, if you expect to claim deductions other than the basic standard deduction on your 2023 tax return and want to reduce your withholding to account for these
                          deductions. This includes both itemized deductions and other deductions such as for student loan interest and IRAs.
                        </p>
                      </div>

                      <div className="steps_article_block_secondry">
                        <strong>Step 4(c).</strong>
                        <p>
                          Enter in this step any additional tax you want withheld from your pay each pay period, including any amounts from the Multiple Jobs Worksheet, line 4. Entering an amount here will reduce your paycheck and will either
                          increase your refund or reduce any amount of tax that you owe.
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="steps_article_block">
              <strong class="step_left_title d-block mb-2 mt-3 ">Step 2(b)—Multiple Jobs Worksheet (Keep for your records.)</strong>

              <p class="py-3">
                If you choose the option in Step 2(b) on Form W-4, complete this worksheet (which calculates the total extra tax for all jobs) on only ONE Form W-4. Withholding will be most accurate if you complete the worksheet and enter the result
                on the Form W-4 for the highest paying job. To be accurate, submit a new Form W-4 for all other jobs if you have not updated your withholding since 2019.
              </p>

              <p>
                <strong className="text-dark">Note:</strong> If more than one job has annual wages of more than $120,000 or there are more than three jobs, see Pub. 505 for additional tables
              </p>

              <Table responsive className="step-caption step-caption_left w-100">
                <tr>
                  <td>
                    <p>
                      <b>1 Two jobs.</b> If you have two jobs or you’re married filing jointly and you and your spouse each have one job, find the amount from the appropriate table on page 4. Using the “Higher Paying Job” row and the “Lower Paying
                      Job” column, find the value at the intersection of the two household salaries and enter that value on line 1. Then,
                      <b>skip</b> to line 3 . . . . . . . . . . . . . . . . . . . . .
                    </p>
                  </td>
                  <td className=" bottom_align">
                    <div className="step_right_bar">
                      <div className="ms-_formdolor d-flex align-items-center  justify-content-between">
                        <span className="me-2">1</span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("twoJobs", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p>
                      <b>2 Three jobs.</b>If you and/or your spouse have three jobs at the same time, complete lines 2a, 2b, and 2c below. Otherwise, skip to line 3.
                    </p>
                    <p className="ps-4">
                      <b className="me-2">a</b> Find the amount from the appropriate table on page 4 using the annual wages from the highest paying job in the “Higher Paying Job” row and the annual wages for your next highest paying job in the “Lower
                      Paying Job” column. Find the value at the intersection of the two household salaries and enter that value on line 2a . . . . . . . . . . . . . . . . . . . . . . .
                    </p>
                  </td>
                  <td className=" bottom_align">
                    <div className="step_right_bar">
                      <div className="ms-_formdolor d-flex align-items-center justify-content-between">
                        <span className="me-2" style={{ width: "54px" }}>
                          2a $
                        </span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("threeJobs", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="ps-4">
                      <b className="me-2">b</b>Add the annual wages of the two highest paying jobs from line 2a together and use the total as the wages in the “Higher Paying Job” row and use the annual wages for your third job in the “Lower Paying
                      Job” column to find the amount from the appropriate table on page 4 and enter this amount on line 2b . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                    </p>
                  </td>
                  <td className=" bottom_align">
                    <div className="step_right_bar">
                      <div className="ms-_formdolor d-flex align-items-center  justify-content-between">
                        <span className="me-2" style={{ width: "54px" }}>
                          2b $
                        </span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("threeJobs2", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p className="ps-4">
                      <b className="me-2">c</b>Add the amounts from lines 2a and 2b and enter the result on line 2c . . . . . . . . . .
                    </p>
                  </td>
                  <td className=" bottom_align">
                    <div className="step_right_bar">
                      <div className="ms-_formdolor d-flex align-items-center  justify-content-between">
                        <span className="me-2" style={{ width: "54px" }}>
                          2c $
                        </span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("threeJobs3", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p className="">
                      <b className="me-2">3</b>Enter the number of pay periods per year for the highest paying job. For example, if that job pays weekly, enter 52; if it pays every other week, enter 26; if it pays monthly, enter 12, etc. . . . . .
                    </p>
                  </td>
                  <td className=" bottom_align">
                    <div className="step_right_bar">
                      <div className="ms-_formdolor d-flex align-items-center  justify-content-between">
                        <span className="me-2" style={{ width: "54px" }}>
                          3
                        </span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("threeJobs4", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p className="">
                      <b className="me-2">4 Divide</b>the annual amount on line 1 or line 2c by the number of pay periods on line 3. Enter this amount here and in Step 4(c) of Form W-4 for the highest paying job (along with any other additional
                      amount you want withheld) . . . . . . . . . . . . . . . . . . . . . . . . .
                    </p>
                  </td>
                  <td className=" bottom_align">
                    <div className="step_right_bar">
                      <div className="ms-_formdolor d-flex align-items-center  justify-content-between">
                        <span className="me-2" style={{ width: "54px" }}>
                          4 $
                        </span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("divide4", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </Table>
            </div>

            <div className="steps_article_block">
              <strong class="step_left_title d-block mb-2 mt-3 ">Step 4(b)—Deductions Worksheet (Keep for your records.)</strong>

              <Table responsive className="step-caption step-caption_left w-100">
                <tr>
                  <td>
                    <p>
                      <b>1</b>
                      Enter an estimate of your 2023 itemized deductions (from Schedule A (Form 1040)). Such deductions may include qualifying home mortgage interest, charitable contributions, state and local taxes (up to $10,000), and medical
                      expenses in excess of 7.5% of your income . . . . . . . . . . . .
                    </p>
                  </td>
                  <td className=" bottom_align">
                    <div className="step_right_bar">
                      <div className="ms-_formdolor d-flex align-items-center  justify-content-between">
                        <span className="me-2">1 $</span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("deduction1", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p>
                      <b>2 Enter</b>
                      <ul>
                        <li>$27,700 if you’re married filing jointly or a qualifying surviving spouse</li>
                        <li>$20,800 if you’re head of household</li>
                        <li> $13,850 if you’re single or married filing separately</li>
                      </ul>
                    </p>
                    <p className="ps-4">
                      <b className="me-2">3</b>If line 1 is greater than line 2, subtract line 2 from line 1 and enter the result here. If line 2 is greater than line 1, enter “-0-” . . . . . . . . . . . . . . . . . . . . . . . . . .
                    </p>
                  </td>
                  <td className=" bottom_align">
                    <div className="step_right_bar">
                      <div className="ms-_formdolor d-flex align-items-center justify-content-between">
                        <span className="me-2" style={{ width: "54px" }}>
                          3 $
                        </span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("deduction2", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="ps-4">
                      <b className="me-2">4</b>Enter an estimate of your student loan interest, deductible IRA contributions, and certain other adjustments (from Part II of Schedule 1 (Form 1040)). See Pub. 505 for more information . . . .
                    </p>
                  </td>
                  <td className=" bottom_align">
                    <div className="step_right_bar">
                      <div className="ms-_formdolor d-flex align-items-center  justify-content-between">
                        <span className="me-2" style={{ width: "54px" }}>
                          4 $
                        </span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("deduction3", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p className="ps-4">
                      <b className="me-2">5</b>Add lines 3 and 4. Enter the result here and in <b>Step 4(b)</b> of Form W-4 . . . . . . . . . . .
                    </p>
                  </td>
                  <td className=" bottom_align">
                    <div className="step_right_bar">
                      <div className="ms-_formdolor d-flex align-items-center  justify-content-between">
                        <span className="me-2" style={{ width: "54px" }}>
                          5 $
                        </span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("deduction4", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p className="">
                      <b className="me-2">3</b>Enter the number of pay periods per year for the highest paying job. For example, if that job pays weekly, enter 52; if it pays every other week, enter 26; if it pays monthly, enter 12, etc. . . . . .
                    </p>
                  </td>
                  <td className=" bottom_align">
                    <div className="step_right_bar">
                      <div className="ms-_formdolor d-flex align-items-center  justify-content-between">
                        <span className="me-2" style={{ width: "54px" }}>
                          3
                        </span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("deduction5", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p className="">
                      <b className="me-2">4 Divide</b>the annual amount on line 1 or line 2c by the number of pay periods on line 3. Enter this amount here and in Step 4(c) of Form W-4 for the highest paying job (along with any other additional
                      amount you want withheld) . . . . . . . . . . . . . . . . . . . . . . . . .
                    </p>
                  </td>
                  <td className=" bottom_align">
                    <div className="step_right_bar">
                      <div className="ms-_formdolor d-flex align-items-center  justify-content-between">
                        <span className="me-2" style={{ width: "54px" }}>
                          4 $
                        </span>
                        <input
                          type="text"
                          disabled={formView}
                          {...register("deduction6", {
                            // required:
                            //   'Please enter multiply the number of qualifying children under age.',
                            pattern: {
                              value: /^(?:[1-9]\d*|0)$/,
                              message: "First character can not be 0.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </Table>
            </div>

            <div className="steps_article_part mt-4">
              <strong className="text-dark text-lg mb-2 d-block">Privacy Act and Paperwork Reduction Act Notice.</strong>
              <Row>
                <Col lg={6}>
                  <div className="steps_article_block">
                    <div className="steps_article_block">
                      <p>
                        We ask for the information on this form to carry out the Internal Revenue laws of the United States. Internal Revenue Code sections 3402(f)(2) and 6109 and their regulations require you to provide this information; your
                        employer uses it to determine your federal income tax withholding. Failure to provide a properly completed form will result in your being treated as a single person with no other entries on the form; providing fraudulent
                        information may subject you to penalties. Routine uses of this information include giving it to the Department of Justice for civil and criminal litigation; to cities, states, the District of Columbia, and U.S. commonwealths
                        and territories for use in administering their tax laws; and to the Department of Health and Human Services for use in the National Directory of New Hires. We may also disclose this information to other countries under a tax
                        treaty, to federal and state agencies to enforce federal nontax criminal laws, or to federal law enforcement and intelligence agencies to combat terrorism
                      </p>
                    </div>
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="steps_article_block">
                    <div className="steps_article_block">
                      <p>
                        You are not required to provide the information requested on a form that is subject to the Paperwork Reduction Act unless the form displays a valid OMB control number. Books or records relating to a form or its instructions
                        must be retained as long as their contents may become material in the administration of any Internal Revenue law. Generally, tax returns and return information are confidential, as required by Code section 6103.
                      </p>
                      <p> The average time and expenses required to complete and file this form will vary depending on individual circumstances. For estimated averages, see the instructions for your income tax return.</p>
                      <p> If you have suggestions for making this form simpler, we would be happy to hear from you. See the instructions for your income tax return.</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="higher_paying">
              <strong className="text-xl text-dark mb-3 d-block">
                Married Filing Jointly or Qualifying Surviving Spouse
                <small className="d-block text-lg">Higher Paying Job Annual Taxable Wage & Salary</small>
              </strong>

              <div className="large_table_outer">
                <Table responsive striped bordered hover>
                  <thead></thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong className="text-dark">Lower Paying Job Annual Taxable Wage & Salary</strong>
                      </td>
                      <td>$0 - 9,999</td>
                      <td>$10,000 - 19,999</td>
                      <td>$20,000 - 29,999</td>
                      <td>$30,000 - 39,999</td>
                      <td>$40,000 - 49,999</td>
                      <td>$50,000 - 59,999</td>
                      <td>$60,000 - 69,999</td>
                      <td>$70,000 - 79,999</td>
                      <td>$80,000 - 89,999</td>
                      <td>$90,000 - 99,999</td>
                      <td>$100,000 - 109,999</td>
                      <td>$110,000 - 120,000</td>
                    </tr>

                    <tr>
                      <td>$0 - 9,999 $10,000 - 19,999 $20,000 - 29,999</td>
                      <td>
                        $0 <br />0 <br />
                        850
                      </td>

                      <td>
                        $0 <br />
                        930
                        <br />
                        1,850
                      </td>

                      <td>
                        $850 <br />
                        1,850
                        <br />
                        2,920
                      </td>

                      <td>
                        $850 <br />
                        2,000 <br />
                        3,120
                      </td>

                      <td>
                        $1,000 <br />
                        2,200 <br />
                        3,320
                      </td>

                      <td>
                        $1,020 <br />
                        2,220 <br />
                        3,340
                      </td>

                      <td>
                        $1,020 <br />
                        2,220
                        <br />
                        3,340
                      </td>

                      <td>
                        $1,020 <br />
                        2,220
                        <br />
                        3,340
                      </td>

                      <td>
                        $1,020 <br />
                        2,220
                        <br />
                        3,340
                      </td>

                      <td>
                        $1,020
                        <br />
                        2,220
                        <br />
                        4,320
                      </td>

                      <td>
                        $1,020
                        <br />
                        3,200
                        <br />
                        5,320
                      </td>

                      <td>
                        $1,870
                        <br />
                        4,070
                        <br />
                        6,190
                      </td>
                    </tr>

                    <tr>
                      <td>
                        $30,000 - 39,999
                        <br />
                        $40,000 - 49,999
                        <br />
                        $50,000 - 59,999
                      </td>

                      <td>
                        850
                        <br />
                        1,000
                        <br />
                        1,020
                      </td>
                      <td>
                        2,000
                        <br />
                        2,200
                        <br />
                        2,220
                      </td>
                      <td>
                        3,120
                        <br />
                        3,320
                        <br />
                        3,340
                      </td>
                      <td>
                        3,320
                        <br />
                        3,520
                        <br />
                        3,540
                      </td>
                      <td>
                        3,520
                        <br />
                        3,720
                        <br />
                        3,740
                      </td>
                      <td>
                        3,540
                        <br />
                        3,740
                        <br />
                        3,760
                      </td>
                      <td>
                        3,540
                        <br />
                        3,740
                        <br />
                        4,750
                      </td>
                      <td>
                        3,540
                        <br />
                        4,720
                        <br />
                        5,750
                      </td>
                      <td>
                        4,520
                        <br />
                        5,720
                        <br />
                        6,750
                      </td>
                      <td>
                        5,520
                        <br />
                        6,720
                        <br />
                        7,750
                      </td>
                      <td>
                        6,520
                        <br />
                        7,720
                        <br />
                        8,750
                      </td>
                      <td>
                        7,390
                        <br />
                        8,590
                        <br />
                        9,610
                      </td>
                    </tr>

                    <tr>
                      <td>
                        $60,000 - 69,999
                        <br />
                        $70,000 - 79,999
                        <br />
                        $80,000 - 99,999
                      </td>
                      <td>
                        1,020
                        <br />
                        1,020
                        <br />
                        1,020
                      </td>
                      <td>
                        2,220
                        <br />
                        2,220
                        <br />
                        2,220
                      </td>
                      <td>
                        3,340
                        <br />
                        3,340
                        <br />
                        4,170
                      </td>
                      <td>
                        3,540
                        <br />
                        3,540
                        <br />
                        5,370
                      </td>
                      <td>
                        3,740
                        <br />
                        4,720
                        <br />
                        6,570
                      </td>
                      <td>
                        4,750
                        <br />
                        5,750
                        <br />
                        7,600
                      </td>
                      <td>
                        5,750
                        <br />
                        6,750
                        <br />
                        8,600
                      </td>
                      <td>
                        6,750 <br />
                        7,750 <br />
                        9,600
                      </td>
                      <td>
                        7,750
                        <br />
                        8,750
                        <br />
                        10,600
                      </td>
                      <td>
                        8,750
                        <br />
                        9,750
                        <br />
                        11,600
                      </td>
                      <td>
                        9,750
                        <br />
                        10,750
                        <br />
                        12,600
                      </td>
                      <td>
                        10,610
                        <br />
                        11,610
                        <br />
                        13,460
                      </td>
                    </tr>

                    <tr>
                      <td>
                        $100,000 - 149,999
                        <br />
                        $150,000 - 239,999
                        <br />
                        $240,000 - 259,999
                      </td>
                      <td>
                        1,870 <br />
                        2,040 <br />
                        2,040
                      </td>
                      <td>
                        4,070 <br />
                        4,440 <br />
                        4,440
                      </td>
                      <td>
                        6,190
                        <br />
                        6,760
                        <br />
                        6,760
                      </td>
                      <td>
                        7,390
                        <br />
                        8,160
                        <br />
                        8,160
                      </td>
                      <td>
                        8,590
                        <br />
                        9,560
                        <br />
                        9,560
                      </td>
                      <td>
                        9,610
                        <br />
                        10,780
                        <br />
                        10,780
                      </td>
                      <td>
                        10,610
                        <br />
                        11,980
                        <br />
                        11,980
                      </td>
                      <td>
                        11,660
                        <br />
                        13,180
                        <br />
                        13,180
                      </td>
                      <td>
                        12,860
                        <br />
                        14,380
                        <br />
                        14,380
                      </td>
                      <td>
                        14,060
                        <br /> 15,580
                        <br /> 15,580
                      </td>
                      <td>
                        15,260
                        <br />
                        16,780
                        <br />
                        16,780
                      </td>
                      <td>
                        16,330
                        <br />
                        17,850
                        <br />
                        17,850
                      </td>
                    </tr>
                    <tr>
                      <td>
                        $260,000 - 279,999
                        <br />
                        $280,000 - 299,999
                        <br />
                        $300,000 - 319,999
                      </td>

                      <td>
                        2,040
                        <br /> 2,040
                        <br /> 2,040
                      </td>
                      <td>
                        4,440
                        <br />
                        4,440
                        <br />
                        4,440
                      </td>

                      <td>
                        6,760
                        <br />
                        6,760
                        <br />
                        6,760
                      </td>
                      <td>
                        8,160
                        <br />
                        8,160
                        <br />
                        8,160
                      </td>
                      <td>
                        9,560
                        <br /> 9,560
                        <br /> 9,560
                      </td>
                      <td>
                        10,780
                        <br />
                        10,780
                        <br />
                        10,780
                      </td>
                      <td>
                        11,980
                        <br />
                        11,980
                        <br />
                        11,980
                      </td>

                      <td>
                        13,180
                        <br /> 13,180 <br />
                        13,470
                      </td>
                      <td>
                        14,380
                        <br />
                        14,380
                        <br />
                        15,470
                      </td>
                      <td>
                        15,580
                        <br /> 15,870
                        <br /> 17,470
                      </td>
                      <td>
                        16,780
                        <br /> 17,870
                        <br /> 19,470
                      </td>
                      <td>
                        18,140
                        <br />
                        19,740
                        <br />
                        21,340
                      </td>
                    </tr>
                    <tr>
                      <td>
                        $320,000 - 364,999
                        <br />
                        $365,000 - 524,999
                        <br />
                        $525,000 and over
                      </td>
                      <td>
                        2,040
                        <br />
                        2,970
                        <br />
                        3,140
                      </td>
                      <td>
                        4,440 <br />
                        6,470 <br />
                        6,840
                      </td>
                      <td>
                        6,760
                        <br />
                        9,890
                        <br />
                        10,460
                      </td>
                      <td>
                        8,550
                        <br />
                        12,390
                        <br />
                        13,160
                      </td>
                      <td>
                        10,750
                        <br /> 14,890
                        <br /> 15,860
                      </td>
                      <td>
                        12,770
                        <br /> 17,220
                        <br /> 18,390
                      </td>
                      <td>
                        14,770
                        <br /> 19,520 <br />
                        20,890
                      </td>
                      <td>
                        16,770
                        <br />
                        21,820
                        <br />
                        23,390
                      </td>
                      <td>
                        18,770
                        <br />
                        24,120
                        <br />
                        25,890
                      </td>
                      <td>
                        20,770
                        <br />
                        26,420
                        <br />
                        28,390
                      </td>
                      <td>
                        22,770
                        <br />
                        28,720
                        <br />
                        30,890
                      </td>
                      <td>
                        24,640 <br /> 30,880 <br /> 33,250
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>

            <div className="higher_paying mt-4">
              <strong className="text-xl text-dark mb-3 d-block">
                Single or Married Filing Separately
                <small className="d-block text-lg">Lower Paying Job Annual Taxable Wage & Salary</small>
              </strong>
              <div className="large_table_outer">
                <Table responsive striped bordered hover>
                  <thead></thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong className="text-dark">Higher Paying Job Annual Taxable Wage & Salary</strong>
                      </td>
                      <td>$0 - 9,999</td>
                      <td>$10,000 - 19,999</td>
                      <td>$20,000 - 29,999</td>
                      <td>$30,000 - 39,999</td>
                      <td>$40,000 - 49,999</td>
                      <td>$50,000 - 59,999</td>
                      <td>$60,000 - 69,999</td>
                      <td>$70,000 - 79,999</td>
                      <td>$80,000 - 89,999</td>
                      <td>$90,000 - 99,999</td>
                      <td>$100,000 - 109,999</td>
                      <td>$110,000 - 120,000</td>
                    </tr>

                    <tr>
                      <td>
                        $0 - 9,999
                        <br />
                        $10,000 - 19,999
                        <br />
                        $20,000 - 29,999
                      </td>
                      <td>
                        $310
                        <br />
                        890
                        <br />
                        1,020
                      </td>
                      <td>
                        $890
                        <br />
                        1,630
                        <br />
                        1,750
                      </td>

                      <td>
                        $1,020
                        <br />
                        1,750
                        <br />
                        1,880
                      </td>
                      <td>
                        $1,020
                        <br />
                        1,750
                        <br />
                        2,720
                      </td>
                      <td>
                        $1,020
                        <br />
                        2,600
                        <br />
                        3,720
                      </td>
                      <td>
                        $1,860
                        <br />
                        3,600
                        <br />
                        4,720
                      </td>
                      <td>
                        $1,870
                        <br />
                        3,600
                        <br />
                        4,730
                      </td>
                      <td>
                        $1,870
                        <br />
                        3,600
                        <br />
                        4,730
                      </td>
                      <td>
                        $1,870
                        <br />
                        3,600
                        <br />
                        4,890
                      </td>
                      <td>
                        $1,870
                        <br />
                        3,760
                        <br />
                        5,090
                      </td>
                      <td>
                        $2,030
                        <br />
                        3,960
                        <br />
                        5,290
                      </td>
                      <td>
                        $2,040
                        <br />
                        3,970
                        <br />
                        5,300
                      </td>
                    </tr>

                    <tr>
                      <td>
                        $30,000 - 39,999 <br />
                        $40,000 - 59,999 <br />
                        $60,000 - 79,999
                      </td>
                      <td>
                        1,020
                        <br />
                        1,710
                        <br />
                        1,870
                      </td>
                      <td>
                        1,750
                        <br />
                        3,450
                        <br />
                        3,600
                      </td>
                      <td>
                        2,720
                        <br />
                        4,570
                        <br />
                        4,730
                      </td>
                      <td>
                        3,720
                        <br />
                        5,570
                        <br />
                        5,860
                      </td>
                      <td>
                        4,720
                        <br />
                        6,570
                        <br />
                        7,060
                      </td>
                      <td>
                        5,720
                        <br /> 7,700
                        <br /> 8,260
                      </td>
                      <td>
                        5,730
                        <br />
                        7,910
                        <br />
                        8,460
                      </td>
                      <td>
                        5,890
                        <br />
                        8,110
                        <br />
                        8,660
                      </td>
                      <td>
                        6,090
                        <br />
                        8,310
                        <br />
                        8,860
                      </td>
                      <td>
                        6,290 <br />
                        8,510 <br />
                        9,060
                      </td>
                      <td>
                        6,490
                        <br />
                        8,710
                        <br />
                        9,260
                      </td>
                      <td>
                        6,500
                        <br />
                        8,720
                        <br />
                        9,280
                      </td>
                    </tr>
                    <tr>
                      <td>
                        $80,000 - 99,999
                        <br />
                        $100,000 - 124,999
                        <br />
                        $125,000 - 149,999
                      </td>

                      <td>
                        1,870
                        <br />
                        2,040
                        <br />
                        2,040
                      </td>
                      <td>
                        3,730 <br />
                        3,970 <br />
                        3,970
                      </td>
                      <td>
                        5,060
                        <br />
                        5,300
                        <br />
                        5,300
                      </td>
                      <td>
                        6,260
                        <br />
                        6,500
                        <br />
                        6,500
                      </td>
                      <td>
                        7,460
                        <br />
                        7,700
                        <br />
                        7,700
                      </td>
                      <td>
                        8,660
                        <br />
                        8,900
                        <br />
                        9,610
                      </td>
                      <td>
                        8,860
                        <br />
                        9,110
                        <br />
                        10,610
                      </td>
                      <td>
                        9,060
                        <br />
                        9,610
                        <br />
                        11,610
                      </td>
                      <td>
                        9,260
                        <br />
                        10,610
                        <br />
                        12,610
                      </td>
                      <td>
                        9,460
                        <br />
                        11,610
                        <br />
                        13,610
                      </td>
                      <td>
                        10,430
                        <br /> 12,610
                        <br /> 14,900
                      </td>
                      <td>
                        11,240
                        <br />
                        13,430
                        <br />
                        16,020
                      </td>
                    </tr>
                    <tr>
                      <td>
                        $150,000 - 174,999
                        <br />
                        $175,000 - 199,999
                        <br />
                        $200,000 - 249,999
                      </td>
                      <td>
                        2,040
                        <br />
                        2,720
                        <br />
                        2,900
                      </td>
                      <td>
                        3,970 <br />
                        5,450 <br />
                        5,930
                      </td>
                      <td>
                        5,610
                        <br />
                        7,580
                        <br />
                        8,360
                      </td>
                      <td>
                        7,610
                        <br />
                        9,580
                        <br />
                        10,660
                      </td>
                      <td>
                        9,610
                        <br />
                        11,580
                        <br />
                        12,960
                      </td>
                      <td>
                        11,610
                        <br />
                        13,870
                        <br />
                        15,260
                      </td>
                      <td>
                        12,610 <br />
                        15,180 <br />
                        16,570
                      </td>
                      <td>
                        13,750
                        <br />
                        16,480
                        <br />
                        17,870
                      </td>
                      <td>
                        15,050
                        <br />
                        17,780
                        <br />
                        19,170
                      </td>
                      <td>
                        16,350
                        <br />
                        19,080
                        <br />
                        20,470
                      </td>
                      <td>
                        17,650
                        <br />
                        20,380
                        <br />
                        21,770
                      </td>
                      <td>
                        18,770
                        <br />
                        21,490
                        <br />
                        22,880
                      </td>
                    </tr>
                    <tr>
                      <td>
                        $250,000 - 399,999 <br />
                        $400,000 - 449,999 <br />
                        $450,000 and over
                      </td>
                      <td>
                        2,970
                        <br />
                        2,970
                        <br />
                        3,140
                      </td>
                      <td>
                        6,010
                        <br />
                        6,010
                        <br />
                        6,380
                      </td>
                      <td>
                        8,440
                        <br />
                        8,440
                        <br />
                        9,010
                      </td>
                      <td>
                        10,740
                        <br />
                        10,740
                        <br />
                        11,510
                      </td>
                      <td>
                        13,040
                        <br />
                        13,040
                        <br />
                        14,010
                      </td>
                      <td>
                        15,340
                        <br />
                        15,340
                        <br />
                        16,510
                      </td>
                      <td>
                        16,640
                        <br />
                        16,640
                        <br />
                        18,010
                      </td>
                      <td>
                        17,940 <br />
                        17,940 <br />
                        19,510
                      </td>
                      <td>
                        19,240
                        <br />
                        19,240
                        <br />
                        21,010
                      </td>
                      <td>
                        20,540
                        <br />
                        20,540
                        <br />
                        22,510
                      </td>
                      <td>
                        21,840
                        <br />
                        21,840
                        <br />
                        24,010
                      </td>
                      <td>
                        22,960
                        <br />
                        22,960
                        <br />
                        25,330
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>

            <div className="higher_paying mt-4">
              <strong className="text-xl text-dark mb-3 d-block">
                Head of Household
                <small className="d-block text-lg">Lower Paying Job Annual Taxable Wage & Salary</small>
              </strong>
              <div className="large_table_outer">
                <Table responsive striped bordered hover>
                  <thead></thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong className="text-dark">Higher Paying Job Annual Taxable Wage & Salary</strong>
                      </td>
                      <td>$0 - 9,999</td>
                      <td>$10,000 - 19,999</td>
                      <td>$20,000 - 29,999</td>
                      <td>$30,000 - 39,999</td>
                      <td>$40,000 - 49,999</td>
                      <td>$50,000 - 59,999</td>
                      <td>$60,000 - 69,999</td>
                      <td>$70,000 - 79,999</td>
                      <td>$80,000 - 89,999</td>
                      <td>$90,000 - 99,999</td>
                      <td>$100,000 - 109,999</td>
                      <td>$110,000 - 120,000</td>
                    </tr>
                    <tr>
                      <td>
                        $0 - 9,999
                        <br /> $10,000 - 19,999
                        <br /> $20,000 - 29,999
                      </td>
                      <td>
                        $0 <br /> 620
                        <br /> 860
                      </td>
                      <td>
                        $620 <br /> 1,630
                        <br /> 2,060
                      </td>
                      <td>
                        $860 <br /> 2,060
                        <br /> 2,490
                      </td>
                      <td>
                        $1,020 <br /> 2,220
                        <br /> 2,650
                      </td>
                      <td>
                        $1,020 <br /> 2,220
                        <br /> 2,650
                      </td>
                      <td>
                        $1,020 <br /> 2,220
                        <br /> 3,280
                      </td>
                      <td>
                        $1,020 <br /> 2,850
                        <br /> 4,280
                      </td>
                      <td>
                        $1,650 <br /> 3,850
                        <br /> 5,280
                      </td>
                      <td>
                        $1,870 <br /> 4,070
                        <br /> 5,520
                      </td>
                      <td>
                        $1,870 <br /> 4,090
                        <br /> 5,720
                      </td>
                      <td>
                        $1,890 <br /> 4,290
                        <br /> 5,920
                      </td>
                      <td>
                        $2,040 <br /> 4,440
                        <br /> 6,070
                      </td>{" "}
                    </tr>

                    <tr>
                      {" "}
                      <td>
                        $30,000 - 39,999
                        <br /> $40,000 - 59,999
                        <br /> $60,000 - 79,999
                      </td>
                      <td>
                        1,020
                        <br /> 1,020
                        <br /> 1,500
                      </td>
                      <td>
                        2,220
                        <br /> 2,220
                        <br /> 3,700
                      </td>
                      <td>
                        2,650
                        <br /> 3,130
                        <br /> 5,130
                      </td>
                      <td>
                        2,810
                        <br /> 4,290
                        <br /> 6,290
                      </td>
                      <td>
                        3,440
                        <br /> 5,290
                        <br /> 7,480
                      </td>
                      <td>
                        4,440
                        <br /> 6,290
                        <br /> 8,680
                      </td>
                      <td>
                        5,440
                        <br /> 7,480
                        <br /> 9,880
                      </td>
                      <td>
                        6,460
                        <br /> 8,680
                        <br /> 11,080
                      </td>
                      <td>
                        6,880
                        <br /> 9,100
                        <br /> 11,500
                      </td>
                      <td>
                        7,080
                        <br /> 9,300
                        <br /> 11,700
                      </td>
                      <td>
                        7,280
                        <br /> 9,500
                        <br /> 11,900
                      </td>
                      <td>
                        7,430
                        <br /> 9,650
                        <br /> 12,050
                      </td>{" "}
                    </tr>

                    <tr>
                      {" "}
                      <td>
                        $80,000 - 99,999
                        <br /> $100,000 - 124,999
                        <br /> $125,000 - 149,999
                      </td>
                      <td>
                        1,870
                        <br /> 2,040
                        <br /> 2,040
                      </td>
                      <td>
                        4,070
                        <br /> 4,440
                        <br /> 4,440
                      </td>
                      <td>
                        5,690
                        <br /> 6,070
                        <br /> 6,070
                      </td>
                      <td>
                        7,050
                        <br /> 7,430
                        <br /> 7,430
                      </td>
                      <td>
                        8,250
                        <br /> 8,630
                        <br /> 8,630
                      </td>
                      <td>
                        9,450
                        <br /> 9,830
                        <br /> 9,980
                      </td>
                      <td>
                        10,650
                        <br /> 11,030
                        <br /> 11,980
                      </td>
                      <td>
                        11,850
                        <br /> 12,230
                        <br /> 13,980
                      </td>
                      <td>
                        12,260
                        <br /> 13,190
                        <br /> 15,190
                      </td>
                      <td>
                        12,460
                        <br /> 14,190
                        <br /> 16,190
                      </td>
                      <td>
                        12,870
                        <br /> 15,190
                        <br /> 17,270
                      </td>
                      <td>
                        13,820
                        <br /> 16,150
                        <br /> 18,530
                      </td>{" "}
                    </tr>

                    <tr>
                      {" "}
                      <td>
                        $150,000 - 174,999
                        <br /> $175,000 - 199,999
                        <br /> $200,000 - 249,999
                      </td>
                      <td>
                        2,040
                        <br /> 2,190
                        <br /> 2,720
                      </td>
                      <td>
                        4,440
                        <br /> 5,390
                        <br /> 6,190
                      </td>
                      <td>
                        6,070
                        <br /> 7,820
                        <br /> 8,920
                      </td>
                      <td>
                        7,980
                        <br /> 9,980
                        <br /> 11,380
                      </td>
                      <td>
                        9,980
                        <br /> 11,980
                        <br /> 13,680
                      </td>
                      <td>
                        11,980
                        <br /> 14,060
                        <br /> 15,980
                      </td>
                      <td>
                        13,980
                        <br /> 16,360
                        <br /> 18,280
                      </td>
                      <td>
                        15,980
                        <br /> 18,660
                        <br /> 20,580
                      </td>
                      <td>
                        17,420
                        <br /> 20,170
                        <br /> 22,090
                      </td>
                      <td>
                        18,720
                        <br /> 21,470
                        <br /> 23,390
                      </td>
                      <td>
                        20,020
                        <br /> 22,770
                        <br /> 24,690
                      </td>
                      <td>
                        21,280
                        <br /> 24,030
                        <br /> 25,950
                      </td>{" "}
                    </tr>
                    <tr>
                      <td>
                        $250,000 - 449,999
                        <br /> 450000 and over
                      </td>
                      <td>
                        2,970
                        <br /> 3,140
                      </td>
                      <td>
                        6,470
                        <br /> 6,840
                      </td>
                      <td>
                        9,200
                        <br /> 9,770
                      </td>
                      <td>
                        11,660
                        <br /> 12,430
                      </td>
                      <td>
                        13,960
                        <br /> 14,930
                      </td>
                      <td>
                        16,260
                        <br /> 17,430
                      </td>
                      <td>
                        18,560
                        <br /> 19,930
                      </td>
                      <td>
                        20,860
                        <br /> 22,430
                      </td>
                      <td>
                        22,380
                        <br /> 24,150
                      </td>
                      <td>
                        23,680
                        <br /> 25,650
                      </td>
                      <td>
                        24,980
                        <br /> 27,150
                      </td>
                      <td>
                        26,230
                        <br /> 28,600
                      </td>{" "}
                    </tr>
                  </tbody>
                </Table>
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

export default EmployeeWithholdingCertificate;
