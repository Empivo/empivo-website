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
import OtpInput from "react18-input-otp";
import CropperModal from "@/pages/components/CropperModal";
import RedStar from "@/pages/components/common/RedStar";
import Helpers from "@/utils/helpers";

const RequestForTaxpayerForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
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

  const [socialSecurityNumber, setSocialSecurityNumber] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");

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
    { label: "Individual/sole proprietor or single-member LLC", value: false },
    { label: "C Corporation", value: false },
    { label: "S Corporation", value: false },
    { label: "Partnership", value: false },
    { label: "Trust/estate", value: false },
    {
      label: "Limited liability company. Enter the tax classification (C=C corporation, S=S corporation, P=Partnership)",
      value: false,
    },
    { label: "Other (see instructions)", value: false },
  ]);

  const onSubmit = async (data) => {
    try {
      data.federalTax = Helpers.orCondition(checkboxes?.find((i) => i.value === true)?.label, "");
      data.taxesClassification = Helpers.orCondition(checkboxes?.find((i) => i.value === true)?.label, "");
      data.otherInstructions = checkboxes?.find((i) => i.value === true)?.label || "";

      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          securityNumber: socialSecurityNumber,
          identificationNumbers: identificationNumber,
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

  const commonFunctionNumbers = (setState, value) => {
    setState(value);
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
      commonFunction(checkboxes, setCheckboxes, currentFormItem?.data?.federalTax);
      commonFunctionNumbers(setIdentificationNumber, currentFormItem.data?.identificationNumbers);
      commonFunctionNumbers(setSocialSecurityNumber, currentFormItem.data?.securityNumber);
      setFileImage(currentFormItem.data?.image);
      reset(currentFormItem.data);
      setValue("image", "");
    }
  }, [currentFormItem.data]);

  const handleObjectLength = (obj) => Object.keys(obj || {})?.length > 0;

  return (
    <div className="employee_application_form py-3">
      <div className="similar_wrapper">
        <div className="employee_application_form_wrap requestForText">
          <div className="Employee_certificate ">
            <div className="empc_top_left">
              Form <strong>W-9</strong>
              <p>(Rev. October 2018) Department of the Treasury Internal Revenue Service</p>
            </div>

            <div className="empc_center_title">
              <strong className="text-xl  text-xl-xxl">Request for Taxpayer Identification Number and Certification</strong>
              <small>Go to www.irs.gov/FormW9 for instructions and the latest information.</small>
              <small>Your withholding is subject to review by the IRS.</small>
            </div>

            <div className="omb_number p-3">Give Form to the requester. Do not send to the IRS.</div>
          </div>

          <div className="step_outer_wrap border-0 py-0 mt-3">
            <div className="step_form">
              <div className="step_block">
                <div className="form_group">
                  <label bel className="me-2 text-dark fw-bold">
                    <strong className="me-2 text-dark">1</strong> Name (as shown on your income tax return). Name is required on this line; do not leave this line blank. <RedStar />
                  </label>
                  <input
                    type="text"
                    className="form_input flex-grow-1"
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
                </div>
              </div>
            </div>
          </div>

          <div className="step_outer_wrap border-0 py-0">
            <div className="step_form">
              <div className="step_block">
                <div className="form_group">
                  <label bel className="me-2 text-dark fw-bold">
                    <strong className=" me-2">2</strong>Business name/disregarded entity name, if different from above <RedStar />
                  </label>
                  <input
                    type="text"
                    className="form_input flex-grow-1"
                    disabled={formView}
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("businessName", {
                      required: {
                        value: true,
                        message: "Please enter business name.",
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
                  <ErrorMessage message={errors?.businessName?.message} />
                </div>
              </div>
            </div>
          </div>

          <div className="step_outer_wrap border-0 py-0">
            <div className="step_form">
              <div className="step_block">
                <div className="py-2 d-flex">
                  <strong className="step_number me-2">3</strong>
                  <b className="text-dark">Check appropriate box for federal tax classification of the person whose name is entered on line 1. Check only one of the following seven boxes.</b>
                </div>
                <div className="d-flex flex-wrap">
                  {checkboxes?.slice(0, 5)?.map((item, index) => (
                    <>
                      <label className="px-3 py-2">
                        <input type="checkbox" disabled={formView} checked={item?.value} onChange={() => handleCheckboxChange(index)} />
                        {item?.label}
                      </label>
                    </>
                  ))}
                </div>
                <div className="py-3">
                  <label className="px-3 py-2 align-items-start">
                    {/* <input type='checkbox' className='mt-1' /> */}
                    <input type="checkbox" disabled={formView} checked={checkboxes[5]?.value} onChange={() => handleCheckboxChange(5)} />
                    {checkboxes[5]?.label}
                    {checkboxes[5]?.value && (
                      <span>
                        <input
                          type="text"
                          disabled={formView}
                          maxLength={15}
                          onInput={(e) => preventMaxInput(e, 15)}
                          {...register("taxClassification", {
                            required: {
                              value: true,
                              message: "Please enter tax classification.",
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
                        />{" "}
                        <ErrorMessage message={errors?.taxClassification?.message} />{" "}
                      </span>
                    )}
                  </label>
                </div>

                <div className="notes px-3">
                  <strong className="text-dark"> Note:</strong> Check the appropriate box in the line above for the tax classification of the single-member owner. Do not check LLC if the LLC is classified as a single-member LLC that is disregarded
                  from the owner unless the owner of the LLC is another LLC that is <b classname="text-dark">not</b> disregarded from the owner for U.S. federal tax purposes. Otherwise, a single-member LLC that is disregarded from the owner should
                  check the appropriate box for the tax classification of its owner.
                </div>

                <div className="py-3">
                  <label className="px-3 py-2">
                    <input type="checkbox" disabled={formView} checked={checkboxes[6]?.value} onChange={() => handleCheckboxChange(6)} />
                    {checkboxes[6]?.label}
                    {checkboxes[6]?.value && (
                      <span className="mx-3">
                        <input
                          type="text"
                          disabled={formView}
                          maxLength={15}
                          onInput={(e) => preventMaxInput(e, 15)}
                          {...register("otherInstruction", {
                            required: {
                              value: true,
                              message: "Please enter other instruction.",
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
                        />{" "}
                        <ErrorMessage message={errors?.otherInstruction?.message} />{" "}
                      </span>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="step_outer_wrap border-0 py-0">
            <div className="step_form">
              <div className="step_block">
                <div className="py-2 d-flex">
                  <strong className="step_number me-2">4</strong>
                  <b className="text-dark">Exemptions (codes apply only to certain entities, not individuals; see instructions on page 3):</b>
                </div>

                <div className="py-3">
                  <Row>
                    <Col md={6}>
                      <div className="form_group">
                        <label className="  py-0">Exempt payee code (if any) </label>
                        <input
                          type="text"
                          className="form_input flex-grow-1"
                          disabled={formView}
                          maxLength={15}
                          onInput={(e) => preventMaxInput(e, 15)}
                          {...register("payeeCode", {
                            required: {
                              value: true,
                              message: "Please enter exempt payee code.",
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
                        <ErrorMessage message={errors?.payeeCode?.message} />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form_group">
                        {" "}
                        <label className="py-0">Exempt payee code (if any) </label>
                        <input
                          type="text"
                          className="form_input flex-grow-1"
                          disabled={formView}
                          maxLength={15}
                          onInput={(e) => preventMaxInput(e, 15)}
                          {...register("payeeCode1", {
                            required: {
                              value: true,
                              message: "Please enter exempt payee code.",
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
                        <ErrorMessage message={errors?.payeeCode1?.message} />
                      </div>
                    </Col>
                  </Row>

                  <small>
                    <em>(Applies to accounts maintained outside the U.S.)</em>
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="step_outer_wrap border-0 py-0">
            <div className="step_form">
              <div className="step_block">
                <div className="form_group">
                  <label className="py-0 text-dark">
                    <strong className="me-2 mb-0 step_number">5</strong>
                    Address (number, street, and apt. or suite no.) See instructions <RedStar />
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
              </div>
            </div>
          </div>

          <div className="step_outer_wrap border-0 py-0">
            <div className="step_form">
              <div className="step_block">
                <div className="form_group">
                  <label className="py-0 text-dark">
                    <strong className="me-2 mb-0 step_number">6</strong>
                    City, state, and ZIP code <RedStar />
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
                        message: "Please enter city, state, and ZIP code.",
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
                  <ErrorMessage message={errors?.city?.message} />s
                </div>
              </div>
            </div>
          </div>

          <div className="step_outer_wrap border-0 py-0">
            <div className="step_form">
              <div className="step_block">
                <div className="form_group">
                  <label className="py-0 text-dark">
                    <strong className="me-2 mb-0 step_number">7</strong>
                    List account number(s) here (optional)
                  </label>
                  <input type="number" className="form_input flex-grow-1" disabled={formView} maxLength={15} onInput={(e) => preventMaxInput(e, 15)} {...register("accountNumber", {})} />
                </div>

                <div className="form_group">
                  <label className="py-0 text-dark">Requester’s name and address (optional)</label>
                  <textarea type="text" className="form_input  flex-grow-1" style={{ height: "100px" }} disabled={formView} maxLength={15} onInput={(e) => preventMaxInput(e, 15)} {...register("requesterName", {})}></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="step_outer_wrap pt-0 border-bottom-0">
            <div className=" claim_dependent_table border-bottom-0">
              <div className="step_block">
                <strong className="step_left_title d-block mb-2 mt-3 ">Taxpayer Identification Number (TIN)</strong>

                <div>
                  <p>
                    {" "}
                    Enter your TIN in the appropriate box. The TIN provided must match the name given on line 1 to avoid backup withholding. For individuals, this is generally your social security number (SSN). However, for a resident alien, sole
                    proprietor, or disregarded entity, see the instructions for Part I, later. For other entities, it is your employer identification number (EIN). If you do not have a number, see How to get a TIN, later.
                  </p>

                  <p>
                    <strong>Note:</strong> If the account is in more than one name, see the instructions for line 1. Also see What Name and Number To Give the Requester for guidelines on whose number to enter
                  </p>
                </div>

                <div className="security_number">
                  <strong className="py-2 text-dark">Social security number</strong>
                  <div className="d-flex align-items-center security_text_field">
                    <div className="d-flex SocialSecurityNumber">
                      <OtpInput
                        numInputs={8}
                        isDisabled={formView}
                        value={socialSecurityNumber}
                        onChange={(e) => {
                          setSocialSecurityNumber(e);
                        }}
                        isInputNum={true}
                        inputStyle={{
                          width: "100%",
                          height: "40px",
                          borderRadius: "4px",
                          border: "1px solid black",
                        }}
                        separator={<span></span>}
                      />
                    </div>
                  </div>
                </div>

                <div className="security_number pt-3">
                  <strong className="py-2 text-dark mb-2">Employer identification number</strong>
                  <div className="d-flex align-items-center security_text_field">
                    <div className="d-flex SocialSecurityNumber">
                      <OtpInput
                        numInputs={9}
                        isDisabled={formView}
                        value={identificationNumber}
                        onChange={(e) => {
                          setIdentificationNumber(e);
                        }}
                        isInputNum={true}
                        inputStyle={{
                          width: "100%",
                          height: "40px",
                          borderRadius: "4px",
                          border: "1px solid black",
                        }}
                        separator={<span></span>}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="steps_article_part mt-4">
            <div className="steps_article_block">
              <strong className="text-dark text-xl">Certification</strong>
              <p>Under penalties of perjury, I certify that:</p>
              <ol>
                <li>. The number shown on this form is my correct taxpayer identification number (or I am waiting for a number to be issued to me); and</li>
                <li>
                  . I am not subject to backup withholding because: (a) I am exempt from backup withholding, or (b) I have not been notified by the Internal Revenue Service (IRS) that I am subject to backup withholding as a result of a failure to
                  report all interest or dividends, or (c) the IRS has notified me that I am no longer subject to backup withholding; and
                </li>
                <li>I am a U.S. citizen or other U.S. person (defined below); and</li>
                <li>The FATCA code(s) entered on this form (if any) indicating that I am exempt from FATCA reporting is correct.</li>
                <li>
                  <strong>Certification</strong> instructions. You must cross out item 2 above if you have been notified by the IRS that you are currently subject to backup withholding because you have failed to report all interest and dividends on
                  your tax return. For real estate transactions, item 2 does not apply. For mortgage interest paid, acquisition or abandonment of secured property, cancellation of debt, contributions to an individual retirement arrangement (IRA), and
                  generally, payments other than interest and dividends, you are not required to sign the certification, but you must provide your correct TIN. See the instructions for Part II, later.
                </li>
              </ol>
            </div>
          </div>

          <div className="sign_here d-lg-flex align-items-center justify-content-between bg-light p-2 my-2">
            <strong className="text-dark text-lg ">Sign Here</strong>
            <span className="text-dark py-3 py-lg-0 d-inline-block">
              Signature of U.S. person <RedStar />
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
            </span>
            <span className="d-block d-lg-inline">
              Date <RedStar />
              <input
                type="date"
                disabled={formView}
                className="ms-2 form_input"
                min={new Date().toISOString().split("T")[0]}
                {...register("dateUSPerson", {
                  required: {
                    value: true,
                    message: "Please enter date.",
                  },
                })}
              />
              <ErrorMessage message={errors?.dateUSPerson?.message} />
            </span>
          </div>

          <div className="steps_article_part mt-4">
            <Row>
              <Col lg={6}>
                <div className="steps_article_block">
                  <strong className="text-dark text-xl">General Instructions</strong>
                  <p>Section references are to the Internal Revenue Code unless otherwise noted.</p>
                  <p>
                    <b classname="text-dark">Future developments.</b> For the latest information about developments related to Form W-9 and its instructions, such as legislation enacted after they were published, go to www.irs.gov/FormW9.
                  </p>
                </div>

                <div className="steps_article_block">
                  <strong className="text-dark text-xl">Purpose of Form</strong>
                  <p>
                    An individual or entity (Form W-9 requester) who is required to file an information return with the IRS must obtain your correct taxpayer identification number (TIN) which may be your social security number (SSN), individual
                    taxpayer identification number (ITIN), adoption taxpayer identification number (ATIN), or employer identification number (EIN), to report on an information return the amount paid to you, or other amount reportable on an
                    information return. Examples of information returns include, but are not limited to, the following. • Form 1099-INT (interest earned or paid)
                  </p>
                  <p>
                    By signing the filled-out form, you: 1. Certify that the TIN you are giving is correct (or you are waiting for a number to be issued),
                    <br />
                    2. Certify that you are not subject to backup withholding, or
                  </p>

                  <p>
                    3. Claim exemption from backup withholding if you are a U.S. exempt payee. If applicable, you are also certifying that as a U.S. person, your allocable share of any partnership income from a U.S. trade or business is not subject
                    to the withholding tax on foreign partners share of effectively connected income, and{" "}
                  </p>

                  <p>4. Certify that FATCA code(s) entered on this form (if any) indicating that you are exempt from the FATCA reporting, is correct. See What is FATCA reporting, later, for further information.</p>
                  <p>
                    <b classname="text-dark">Note:</b> If you are a U.S. person and a requester gives you a form other than Form W-9 to request your TIN, you must use the requester’s form if it is substantially similar to this Form W-9.
                  </p>
                  <p>
                    <b classname="text-dark">Definition of a U.S. person.</b> For federal tax purposes, you are considered a U.S. person if you are:
                  </p>

                  <ul>
                    <li>An individual who is a U.S. citizen or U.S. resident alien;</li>
                    <li>A partnership, corporation, company, or association created or organized in the United States or under the laws of the United States;</li>
                    <li>An estate (other than a foreign estate); or</li>
                    <li>A domestic trust (as defined in Regulations section 301.7701-7).</li>
                  </ul>
                  <p>
                    <b classname="text-dark"> Special rules for partnerships. Partnerships that conduct</b>a trade or business in the United States are generally required to pay a withholding tax under section 1446 on any foreign partners’ share of
                    effectively connected taxable income from such business. Further, in certain cases where a Form W-9 has not been received, the rules under section 1446 require a partnership to presume that a partner is a foreign person, and pay
                    the section 1446 withholding tax. Therefore, if you are a U.S. person that is a partner in a partnership conducting a trade or business in the United States, provide Form W-9 to the partnership to establish your U.S. status and
                    avoid section 1446 withholding on your share of partnership income.
                  </p>
                  <p>
                    In the cases below, the following person must give Form W-9 to the partnership for purposes of establishing its U.S. status and avoiding withholding on its allocable share of net income from the partnership conducting a trade or
                    business in the United States.
                  </p>

                  <ul>
                    <li>In the case of a disregarded entity with a U.S. owner, the U.S. owner of the disregarded entity and not the entity;</li>
                    <li>In the case of a grantor trust with a U.S. grantor or other U.S. owner, generally, the U.S. grantor or other U.S. owner of the grantor trust and not the trust; and</li>
                  </ul>

                  <p>In the case of a U.S. trust (other than a grantor trust), the U.S. trust (other than a grantor trust) and not the beneficiaries of the trust.</p>
                  <p>
                    <b classname="text-dark"> Foreign person.</b> If you are a foreign person or the U.S. branch of a foreign bank that has elected to be treated as a U.S. person, do not use Form W-9. Instead, use the appropriate Form W-8 or Form
                    8233 (see Pub. 515, Withholding of Tax on Nonresident Aliens and Foreign Entities).
                  </p>

                  <p>
                    <b classname="text-dark">Nonresident alien who becomes a resident alien.</b> Generally, only a nonresident alien individual may use the terms of a tax treaty to reduce or eliminate U.S. tax on certain types of income. However,
                    most tax treaties contain a provision known as a “saving clause.” Exceptions specified in the saving clause may permit an exemption from tax to continue for certain types of income even after the payee has otherwise become a U.S.
                    resident alien for tax purposes.
                  </p>

                  <p>
                    If you are a U.S. resident alien who is relying on an exception contained in the saving clause of a tax treaty to claim an exemption from U.S. tax on certain types of income, you must attach a statement to Form W-9 that specifies
                    the following five items.
                  </p>

                  <ol>
                    <li>1. The treaty country. Generally, this must be the same treaty under which you claimed exemption from tax as a nonresident alien.</li>
                    <li>2. The treaty article addressing the income.</li>
                    <li>3. The article number (or location) in the tax treaty that contains the saving clause and its exceptions.</li>
                    <li>4. The type and amount of income that qualifies for the exemption from tax.</li>
                    <li>5. Sufficient facts to justify the exemption from tax under the terms of the treaty article.</li>
                  </ol>

                  <p>
                    <b classname="text-dark">Criminal penalty for falsifying information.</b> Willfully falsifying certifications or affirmations may subject you to criminal penalties including fines and/or imprisonment.
                  </p>
                </div>

                <div className="steps_article_block">
                  <strong className="text-dark text-xl d-block">Specific Instructions</strong>
                  <b className="text-dark">Line 1</b>
                  <p>You must enter one of the following on this line; do not leave this line blank. The name should match the name on your tax return.</p>
                </div>

                <div className="steps_article_block">
                  <p>
                    If this Form W-9 is for a joint account (other than an account maintained by a foreign financial institution (FFI)), list first, and then circle, the name of the person or entity whose number you entered in Part I of Form W-9. If
                    you are providing Form W-9 to an FFI to document a joint account, each holder of the account that is a U.S. person must provide a Form W-9.
                  </p>
                </div>

                <div className="steps_article_block">
                  <strong className="step_left_title">Your privacy.</strong>
                  <p>If you have concerns with Step 2(c), you may choose Step 2(b); if you have concerns with Step 4(a), you may enter an additional amount you want withheld per pay period in Step 4(c).</p>

                  <p>
                    a. <b classname="text-dark">Individual.</b> Generally, enter the name shown on your tax return. If you have changed your last name without informing the Social Security Administration (SSA) of the name change, enter your first
                    name, the last name as shown on your social security card, and your new last name.{" "}
                  </p>

                  <p>
                    <b classname="text-dark">Note: ITIN applicant:</b> Enter your individual name as it was entered on your Form W-7 application, line 1a. This should also be the same as the name you entered on the Form 1040/1040A/1040EZ you filed
                    with your application.
                  </p>

                  <p>
                    b. <b classname="text-dark">Sole proprietor or single-member LLC.</b> Enter your individual name as shown on your 1040/1040A/1040EZ on line 1. You may enter your business, trade, or “doing business as” (DBA) name on line 2.
                  </p>

                  <p>
                    <b classname="text-dark">c. Partnership, LLC that is not a single-member LLC, C corporation,</b> or S corporation. Enter the entitys name as shown on the entitys tax return on line 1 and any business, trade, or DBA name on line 2.
                  </p>

                  <p>
                    d. <b classname="text-dark">Other entities.</b> Enter your name as shown on required U.S. federal tax documents on line 1. This name should match the name shown on the charter or other legal document creating the entity. You may
                    enter any business, trade, or DBA name on line 2.
                  </p>

                  <p>
                    e. <b classname="text-dark">Disregarded entity.</b> For U.S. federal tax purposes, an entity that is disregarded as an entity separate from its owner is treated as a “disregarded entity.” See Regulations section
                    301.7701-2(c)(2)(iii). Enter the owners name on line 1. The name of the entity entered on line 1 should never be a disregarded entity. The name on line 1 should be the name shown on the income tax return on which the income should
                    be reported. For example, if a foreign LLC that is treated as a disregarded entity for U.S. federal tax purposes has a single owner that is a U.S. person, the U.S. owners name is required to be provided on line 1. If the direct
                    owner of the entity is also a disregarded entity, enter the first owner that is not disregarded for federal tax purposes. Enter the disregarded entity name on line 2, “Business name/disregarded entity name.” If the owner of the
                    disregarded entity is a foreign person, the owner must complete an appropriate Form W-8 instead of a Form W-9. This is the case even if the foreign person has a U.S. TIN.
                  </p>
                </div>

                <div className="steps_article_block">
                  <strong className="step_left_title">Line 2</strong>
                  <p>If you have a business name, trade name, DBA name, or disregarded entity name, you may enter it on line 2.</p>
                </div>

                <div className="steps_article_block">
                  <strong className="step_left_title">Line 3</strong>
                  <p>Check the appropriate box on line 3 for the U.S. federal tax classification of the person whose name is entered on line 1. Check only one box on line 3.</p>
                </div>

                <div className="steps_article_block">
                  <p>The following chart shows types of payments that may be exempt from backup withholding. The chart applies to the exempt payees listed above, 1 through 13.</p>
                </div>

                <div className="steps_article_block">
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>IF the payment is for . . .</th>
                        <th>THEN the payment is exempt for . . .</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Interest and dividend payments</td>
                        <td>All exempt payees except for 7</td>
                      </tr>
                      <tr>
                        <td>Broker transactions</td>
                        <td>Exempt payees 1 through 4 and 6 through 11 and all C corporations. S corporations must not enter an exempt payee code because they are exempt only for sales of noncovered securities acquired prior to 2012. </td>
                      </tr>
                      <tr>
                        <td>Barter exchange transactions and patronage dividends</td>
                        <td>Exempt payees 1 through 4</td>
                      </tr>
                      <tr>
                        <td>Payments over $600 required to be reported and direct sales over $5,0001</td>
                        <td>Generally, exempt payees 1 through 52</td>
                      </tr>

                      <tr>
                        <td>Payments made in settlement of payment card or third party network transactions</td>
                        <td>Exempt payees 1 through 4</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                <div className="steps_article_block">
                  <p>1 See Form 1099-MISC, Miscellaneous Income, and its instructions.</p>

                  <p>
                    2 However, the following payments made to a corporation and reportable on Form 1099-MISC are not exempt from backup withholding: medical and health care payments, attorneys’ fees, gross proceeds paid to an attorney reportable
                    under section 6045(f), and payments for services paid by a federal executive agency.
                  </p>

                  <p>
                    <b classname="text-dark"> Exemption from FATCA reporting code.</b> The following codes identify payees that are exempt from reporting under FATCA. These codes apply to persons submitting this form for accounts maintained outside
                    of the United States by certain foreign financial institutions. Therefore, if you are only submitting this form for an account you hold in the United States, you may leave this field blank. Consult with the person requesting this
                    form if you are uncertain if the financial institution is subject to these requirements. A requester may indicate that a code is not required by providing you with a Form W-9 with “Not Applicable” (or any similar indication)
                    written or printed on the line for a FATCA exemption code.
                  </p>

                  <p>A—An organization exempt from tax under section 501(a) or any individual retirement plan as defined in section 7701(a)(37)</p>

                  <p>B—The United States or any of its agencies or instrumentalities</p>
                  <p>C—A state, the District of Columbia, a U.S. commonwealth or possession, or any of their political subdivisions or instrumentalities</p>

                  <p>D—A corporation the stock of which is regularly traded on one or more established securities markets, as described in Regulations section 1.1472-1(c)(1)(i)</p>

                  <p>E—A corporation that is a member of the same expanded affiliated group as a corporation described in Regulations section 1.1472-1(c)(1)(i)</p>

                  <p>F—A dealer in securities, commodities, or derivative financial instruments (including notional principal contracts, futures, forwards, and options) that is registered as such under the laws of the United States or any state</p>

                  <p>G—A real estate investment trust H—A regulated investment company as defined in section 851 or an entity registered at all times during the tax year under the Investment Company Act of 1940</p>

                  <p>I—A common trust fund as defined in section 584(a)</p>
                  <p>J—A bank as defined in section 581</p>
                  <p>K—A broker</p>
                  <p>L—A trust exempt from tax under section 664 or described in section 4947(a)(1)</p>
                </div>

                <div className="steps_article_block">
                  <strong className="text-dark">1. Interest, dividend, and barter exchange accounts opened before 1984 and broker accounts considered active during 1983.</strong>
                  <p>You must give your correct TIN, but you do not have to sign the certification.</p>

                  <strong className="text-dark">2. Interest, dividend, broker, and barter exchange accounts opened after 1983 and broker accounts considered inactive during 1983.</strong>
                  <p>
                    You must sign the certification or backup withholding will apply. If you are subject to backup withholding and you are merely providing your correct TIN to the requester, you must cross out item 2 in the certification before
                    signing the form.
                  </p>
                  <strong className="text-dark">3. Real estate transactions.</strong>
                  <p>You must sign the certification. You may cross out item 2 of the certification.</p>
                  <strong className="text-dark">4. Other payments.</strong>
                  <p>
                    You must give your correct TIN, but you do not have to sign the certification unless you have been notified that you have previously given an incorrect TIN. “Other payments” include payments made in the course of the requester’s
                    trade or business for rents, royalties, goods (other than bills for merchandise), medical and health care services (including payments to corporations), payments to a nonemployee for services, payments made in settlement of
                    payment card and third party network transactions, payments to certain fishing boat crew members and fishermen, and gross proceeds paid to attorneys (including payments to corporations).{" "}
                  </p>
                  <strong className="text-dark">
                    5. Mortgage interest paid by you, acquisition or abandonment of secured property, cancellation of debt, qualified tuition program payments (under section 529), ABLE accounts (under section 529A), IRA, Coverdell ESA, Archer MSA or
                    HSA contributions or distributions, and pension distributions.{" "}
                  </strong>
                  <p>You must give your correct TIN, but you do not have to sign the certification.</p>
                </div>

                <strong className="text-dark mb-2 d-block">What Name and Number To Give the Requester</strong>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>For this type of account:</th>
                      <th>Give name and SSN of:</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        1. Individual
                        <br />
                        2. Two or more individuals (joint account) other than an account maintained by an FFI
                        <br />
                        3. Two or more U.S. persons (joint account maintained by an FFI)
                        <br />
                        4. Custodial account of a minor (Uniform Gift to Minors Act)
                        <br />
                        5. a. The usual revocable savings trust (grantor is also trustee) b. So-called trust account that is not a legal or valid trust under state law
                        <br />
                        6. Sole proprietorship or disregarded entity owned by an individual
                        <br />
                        7. Grantor trust filing under Optional Form 1099 Filing Method 1 (see Regulations section 1.671-4(b)(2)(i) (A))
                      </td>
                      <td>
                        The individual
                        <br />
                        The actual owner of the account or, if combined funds, the first individual on the account1
                        <br />
                        Each holder of the account
                        <br />
                        The minor2
                        <br />
                        The grantor-trustee1
                        <br />
                        The actual owner1
                        <br />
                        The owner3
                        <br />
                        The grantor*
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>For this type of account:</th>
                      <th>Give name and EIN of:</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        8. Disregarded entity not owned by an individual
                        <br />
                        9. A valid trust, estate, or pension trust
                        <br />
                        10. Corporation or LLC electing corporate status on Form 8832 or Form 2553
                        <br />
                        11. Association, club, religious, charitable, educational, or other taxexempt organization
                        <br />
                        12. Partnership or multi-member LLC
                        <br />
                        13. A broker or registered nominee
                      </td>
                      <td>
                        The owner
                        <br />
                        Legal entity4
                        <br />
                        The corporation
                        <br />
                        The organization
                        <br />
                        The partnership
                        <br />
                        The broker or nominee
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <div className="steps_article_block">
                  <p>
                    The IRS does not initiate contacts with taxpayers via emails. Also, the IRS does not request personal detailed information through email or ask taxpayers for the PIN numbers, passwords, or similar secret access information for
                    their credit card, bank, or other financial accounts.
                  </p>

                  <p>
                    If you receive an unsolicited email claiming to be from the IRS, forward this message to phishing@irs.gov. You may also report misuse of the IRS name, logo, or other IRS property to the Treasury Inspector General for Tax
                    Administration (TIGTA) at 1-800-366-4484. You can forward suspicious emails to the Federal Trade Commission at spam@uce.gov or report them at www.ftc.gov/complaint. You can contact the FTC at www.ftc.gov/idtheft or 877-IDTHEFT
                    (877-438-4338). If you have been the victim of identity theft, see www.IdentityTheft.gov and Pub. 5027.
                  </p>
                  <p>Visit www.irs.gov/IdentityTheft to learn more about identity theft and how to reduce your risk.</p>
                </div>
              </Col>

              <Col lg={6}>
                <div className="steps_article_block">
                  <ul>
                    <li>Form 1099-DIV (dividends, including those from stocks or mutual funds)</li>
                    <li>Form 1099-MISC (various types of income, prizes, awards, or gross proceeds)</li>
                    <li>Form 1099-B (stock or mutual fund sales and certain other transactions by brokers)</li>
                    <li>Form 1099-S (proceeds from real estate transactions)</li>
                    <li>Form 1099-K (merchant card and third party network transactions)</li>
                    <li>Form 1098 (home mortgage interest), 1098-E (student loan interest), 1098-T (tuition)</li>
                    <li> Form 1099-C (canceled debt)</li>
                    <li>Form 1099-A (acquisition or abandonment of secured property)</li>
                    <li>Use Form W-9 only if you are a U.S. person (including a resident alien), to provide your correct TIN. </li>
                    <em>If you do not return Form W-9 to the requester with a TIN, you might be subject to backup withholding. See What is backup withholding, later.</em>
                  </ul>
                </div>

                <div className="steps_article_block">
                  <p>
                    <strong className="text-dark">Example.</strong> Article 20 of the U.S.-China income tax treaty allows an exemption from tax for scholarship income received by a Chinese student temporarily present in the United States. Under U.S.
                    law, this student will become a resident alien for tax purposes if his or her stay in the United States exceeds 5 calendar years. However, paragraph 2 of the first Protocol to the U.S.-China treaty (dated April 30, 1984) allows
                    the provisions of Article 20 to continue to apply even after the Chinese student becomes a resident alien of the United States. A Chinese student who qualifies for this exception (under paragraph 2 of the first protocol) and is
                    relying on this exception to claim an exemption from tax on his or her scholarship or fellowship income would attach to Form W-9 a statement that includes the information described above to support that exemption.
                  </p>
                  <p>If you are a nonresident alien or a foreign entity, give the requester the appropriate completed Form W-8 or Form 8233.</p>
                </div>

                <div className="steps_article_block">
                  <strong className="text-xl text-dark">Backup Withholding</strong>

                  <p>
                    <strong>What is backup withholding?</strong> Persons making certain payments to you must under certain conditions withhold and pay to the IRS 24% of such payments. This is called “backup withholding.” Payments that may be subject
                    to backup withholding include interest, tax-exempt interest, dividends, broker and barter exchange transactions, rents, royalties, nonemployee pay, payments made in settlement of payment card and third party network transactions,
                    and certain payments from fishing boat operators. Real estate transactions are not subject to backup withholding.
                  </p>
                  <p>You will not be subject to backup withholding on payments you receive if you give the requester your correct TIN, make the proper certifications, and report all your taxable interest and dividends on your tax return.</p>

                  <strong className="text-dark">Payments you receive will be subject to backup withholding if: </strong>

                  <p>1. You do not furnish your TIN to the requester,</p>
                  <p>2. You do not certify your TIN when required (see the instructions for Part II for details),</p>
                  <p>3. The IRS tells the requester that you furnished an incorrect TIN,</p>
                  <p>4. The IRS tells you that you are subject to backup withholding because you did not report all your interest and dividends on your tax return (for reportable interest and dividends only), or</p>
                  <p>5. You do not certify to the requester that you are not subject to backup withholding under 4 above (for reportable interest and dividend accounts opened after 1983 only).</p>

                  <p>Certain payees and payments are exempt from backup withholding. See Exempt payee code, later, and the separate Instructions for the Requester of Form W-9 for more information.</p>
                  <p>Also see Special rules for partnerships, earlier.</p>
                </div>

                <div className="steps_article_block">
                  <strong className="text-dark text-lg">What is FATCA Reporting?</strong>
                  <p>
                    The Foreign Account Tax Compliance Act (FATCA) requires a participating foreign financial institution to report all United States account holders that are specified United States persons. Certain payees are exempt from FATCA
                    reporting. See Exemption from FATCA reporting code, later, and the Instructions for the Requester of Form W-9 for more information.
                  </p>
                </div>

                <div className="steps_article_block">
                  <strong className="text-dark text-lg">Updating Your Information</strong>
                  <p>
                    You must provide updated information to any person to whom you claimed to be an exempt payee if you are no longer an exempt payee and anticipate receiving reportable payments in the future from this person. For example, you may
                    need to provide updated information if you are a C corporation that elects to be an S corporation, or if you no longer are tax exempt. In addition, you must furnish a new Form W-9 if the name or TIN changes for the account; for
                    example, if the grantor of a grantor trust dies.
                  </p>
                </div>

                <div className="steps_article_block">
                  <strong className="text-dark text-lg">Penalties</strong>
                  <p>
                    <strong>Failure to furnish TIN.</strong> If you fail to furnish your correct TIN to a requester, you are subject to a penalty of $50 for each such failure unless your failure is due to reasonable cause and not to willful neglect.
                  </p>

                  <p>
                    <strong className="text-dark">Civil penalty for false information with respect to withholding.</strong> If you make a false statement with no reasonable basis that results in no backup withholding, you are subject to a $500
                    penalty.
                  </p>
                </div>

                <div className="steps_article_block">
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>IF the entity/person on line 1 is a(n) . . .</th>
                        <th>THEN check the box for . . .</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>• Corporation</td>
                        <td>Corporation</td>
                      </tr>

                      <tr>
                        <td>
                          • Individual <br />
                          • Sole proprietorship, or <br />• Single-member limited liability
                          <p>company (LLC) owned by an individual and disregarded for U.S. federal tax purposes.</p>
                        </td>
                        <td>Individual/sole proprietor or singlemember LLC</td>
                      </tr>

                      <tr>
                        <td>
                          • LLC treated as a partnership for U.S. federal tax purposes, <br />
                          • LLC that has filed Form 8832 or 2553 to be taxed as a corporation, or
                          <br />• LLC that is disregarded as an entity separate from its owner but the owner is another LLC that is not disregarded for U.S. federal tax purposes.
                        </td>
                        <td>Limited liability company and enter the appropriate tax classification. (P= Partnership; C= C corporation; or S= S corporation)</td>
                      </tr>

                      <tr>
                        <td>• Partnership</td>
                        <td>Partnership</td>
                      </tr>

                      <tr>
                        <td>• Trust/estate</td>
                        <td>Trust/estate</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                <div className="steps_article_block">
                  <strong>Line 4, Exemptions</strong>
                  <p>If you are exempt from backup withholding and/or FATCA reporting, enter in the appropriate space on line 4 any code(s) that may apply to you.</p>
                  <strong>Exempt payee code.</strong>

                  <ul className="list-unstyled">
                    <li>• Generally, individuals (including sole proprietors) are not exempt from backup withholding.</li>
                    <li>• Except as provided below, corporations are exempt from backup withholding for certain payments, including interest and dividends.</li>
                    <li>• Corporations are not exempt from backup withholding for payments made in settlement of payment card or third party network transactions.</li>
                    <li>
                      • Corporations are not exempt from backup withholding with respect to attorneys’ fees or gross proceeds paid to attorneys, and corporations that provide medical or health care services are not exempt with respect to payments
                      reportable on Form 1099-MISC.
                      <p>The following codes identify payees that are exempt from backup withholding. Enter the appropriate code in the space in line 4.</p>
                      <p>1—An organization exempt from tax under section 501(a), any IRA, or a custodial account under section 403(b)(7) if the account satisfies the requirements of section 401(f)(2)</p>
                      <p>2—The United States or any of its agencies or instrumentalities</p>
                      <p>3—A state, the District of Columbia, a U.S. commonwealth or possession, or any of their political subdivisions or instrumentalities</p>
                      <p>4—A foreign government or any of its political subdivisions, agencies, or instrumentalities </p>
                      <p>5—A corporation</p>
                      <p>6—A dealer in securities or commodities required to register in the United States, the District of Columbia, or a U.S. commonwealth or possession</p>
                      <p>7—A futures commission merchant registered with the Commodity Futures Trading Commission</p>
                      <p>8—A real estate investment trust</p>
                      <p>9—An entity registered at all times during the tax year under the Investment Company Act of 1940</p>
                      <p>10—A common trust fund operated by a bank under section 584(a)</p>
                      <p>11—A financial institution</p>
                      <p>12—A middleman known in the investment community as a nominee or custodian</p>
                      <p>13—A trust exempt from tax under section 664 or described in section 4947</p>
                      <p>M—A tax exempt trust under a section 403(b) plan or section 457(g) plan</p>
                      <p>
                        <strong>Note:</strong> You may wish to consult with the financial institution requesting this form to determine whether the FATCA code and/or exempt payee code should be completed.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="steps_article_block">
                  <strong className="text-dark text-lg">Line 5</strong>
                  <p>
                    Enter your address (number, street, and apartment or suite number). This is where the requester of this Form W-9 will mail your information returns. If this address differs from the one the requester already has on file, write NEW
                    at the top. If a new address is provided, there is still a chance the old address will be used until the payor changes your address in their records.
                  </p>
                </div>

                <div className="steps_article_block">
                  <strong className="text-dark text-lg">Line 6</strong>
                  <p>Enter your city, state, and ZIP code.</p>
                </div>

                <div className="steps_article_block">
                  <strong className="text-dark text-lg">Part I. Taxpayer Identification Number (TIN)</strong>
                  <p>
                    <strong>Enter your TIN in the appropriate box.</strong> If you are a resident alien and you do not have and are not eligible to get an SSN, your TIN is your IRS individual taxpayer identification number (ITIN). Enter it in the
                    social security number box. If you do not have an ITIN, see How to get a TIN below.
                  </p>

                  <p>If you are a sole proprietor and you have an EIN, you may enter either your SSN or EIN. </p>

                  <p>
                    If you are a single-member LLC that is disregarded as an entity separate from its owner, enter the owner’s SSN (or EIN, if the owner has one). Do not enter the disregarded entity’s EIN. If the LLC is classified as a corporation or
                    partnership, enter the entity’s EIN.
                  </p>

                  <p>
                    <strong>Note:</strong> See What Name and Number To Give the Requester, later, for further clarification of name and TIN combinations.
                  </p>

                  <p>
                    <strong>How to get a TIN.</strong> If you do not have a TIN, apply for one immediately. To apply for an SSN, get Form SS-5, Application for a Social Security Card, from your local SSA office or get this form online at www.SSA.gov.
                    You may also get this form by calling 1-800-772-1213. Use Form W-7, Application for IRS Individual Taxpayer Identification Number, to apply for an ITIN, or Form SS-4, Application for Employer Identification Number, to apply for an
                    EIN. You can apply for an EIN online by accessing the IRS website at www.irs.gov/Businesses and clicking on Employer Identification Number (EIN) under Starting a Business. Go to www.irs.gov/Forms to view, download, or print Form
                    W-7 and/or Form SS-4. Or, you can go to www.irs.gov/OrderForms to place an order and have Form W-7 and/or SS-4 mailed to you within 10 business days.
                  </p>

                  <p>
                    If you are asked to complete Form W-9 but do not have a TIN, apply for a TIN and write “Applied For” in the space for the TIN, sign and date the form, and give it to the requester. For interest and dividend payments, and certain
                    payments made with respect to readily tradable instruments, generally you will have 60 days to get a TIN and give it to the requester before you are subject to backup withholding on payments. The 60-day rule does not apply to
                    other types of payments. You will be subject to backup withholding on all such payments until you provide your TIN to the requester.
                  </p>

                  <p>
                    <strong>Note:</strong> Entering “Applied For” means that you have already applied for a TIN or that you intend to apply for one soon.
                  </p>

                  <p>
                    <strong>Caution:</strong> A disregarded U.S. entity that has a foreign owner must use the appropriate Form W-8.
                  </p>
                </div>

                <div className="steps_article_block">
                  <strong className="text-dark text-lg">Part II. Certification</strong>
                  <p>To establish to the withholding agent that you are a U.S. person, or resident alien, sign Form W-9. You may be requested to sign by the withholding agent even if item 1, 4, or 5 below indicates otherwise.</p>
                  <p>For a joint account, only the person whose TIN is shown in Part I should sign (when required). In the case of a disregarded entity, the person identified on line 1 must sign. Exempt payees, see Exempt payee code, earlier.</p>
                  <p>
                    <b>Signature requirements.</b> Complete the certification as indicated in items 1 through 5 below.
                  </p>
                </div>

                <div className="steps_article_block">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>For this type of account:</th>
                        <th>Give name and EIN of:</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>14. Account with the Department of Agriculture in the name of a public entity (such as a state or local government, school district, or prison) that receives agricultural program payments</td>
                        <td>The public entity</td>
                      </tr>

                      <tr>
                        <td>15. Grantor trust filing under the Form 1041 Filing Method or the Optional Form 1099 Filing Method 2 (see Regulations section 1.671-4(b)(2)(i)(B))</td>
                        <td>The trust</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                <div className="steps_article_block">
                  <p>1 List first and circle the name of the person whose number you furnish. If only one person on a joint account has an SSN, that person’s number must be furnished.</p>

                  <p>2 Circle the minor’s name and furnish the minor’s SSN.</p>

                  <p>
                    3 You must show your individual name and you may also enter your business or DBA name on the “Business name/disregarded entity” name line. You may use either your SSN or EIN (if you have one), but the IRS encourages you to use
                    your SSN.
                  </p>

                  <p>
                    4 List first and circle the name of the trust, estate, or pension trust. (Do not furnish the TIN of the personal representative or trustee unless the legal entity itself is not designated in the account title.) Also see Special
                    rules for partnerships, earlier.
                  </p>

                  <p>
                    <strong>*Note:</strong> The grantor also must provide a Form W-9 to trustee of trust.
                  </p>

                  <p>
                    <strong>Note:</strong> If no name is circled when more than one name is listed, the number will be considered to be that of the first name listed.
                  </p>
                </div>

                <div className="steps_article_block">
                  <strong className="text-dark text-lg">Secure Your Tax Records From Identity Theft</strong>

                  <p>
                    Identity theft occurs when someone uses your personal information such as your name, SSN, or other identifying information, without your permission, to commit fraud or other crimes. An identity thief may use your SSN to get a job
                    or may file a tax return using your SSN to receive a refund.
                  </p>
                  <span>To reduce your risk:</span>

                  <ul className="list-unstyled">
                    <li>• Protect your SSN,</li>
                    <li>• Ensure your employer is protecting your SSN, and</li>
                    <li>• Be careful when choosing a tax preparer.</li>
                  </ul>

                  <p>If your tax records are affected by identity theft and you receive a notice from the IRS, respond right away to the name and phone number printed on the IRS notice or letter.</p>

                  <p>
                    If your tax records are not currently affected by identity theft but you think you are at risk due to a lost or stolen purse or wallet, questionable credit card activity or credit report, contact the IRS Identity Theft Hotline at
                    1-800-908-4490 or submit Form 14039.
                  </p>

                  <p>For more information, see Pub. 5027, Identity Theft Information for Taxpayers.</p>

                  <p>
                    Victims of identity theft who are experiencing economic harm or a systemic problem, or are seeking help in resolving tax problems that have not been resolved through normal channels, may be eligible for Taxpayer Advocate Service
                    (TAS) assistance. You can reach TAS by calling the TAS toll-free case intake line at 1-877-777-4778 or TTY/TDD 1-800-829-4059.
                  </p>

                  <strong>Protect yourself from suspicious emails or phishing schemes.</strong>
                  <p>
                    Phishing is the creation and use of email and websites designed to mimic legitimate business emails and websites. The most common act is sending an email to a user falsely claiming to be an established legitimate enterprise in an
                    attempt to scam the user into surrendering private information that will be used for identity theft.
                  </p>
                </div>

                <div className="steps_article_block">
                  <strong className="text-dark text-lg">Privacy Act Notice</strong>
                  <p>
                    Section 6109 of the Internal Revenue Code requires you to provide your correct TIN to persons (including federal agencies) who are required to file information returns with the IRS to report interest, dividends, or certain other
                    income paid to you; mortgage interest you paid; the acquisition or abandonment of secured property; the cancellation of debt; or contributions you made to an IRA, Archer MSA, or HSA. The person collecting this form uses the
                    information on the form to file information returns with the IRS, reporting the above information. Routine uses of this information include giving it to the Department of Justice for civil and criminal litigation and to cities,
                    states, the District of Columbia, and U.S. commonwealths and possessions for use in administering their laws. The information also may be disclosed to other countries under a treaty, to federal and state agencies to enforce civil
                    and criminal laws, or to federal law enforcement and intelligence agencies to combat terrorism. You must provide your TIN whether or not you are required to file a tax return. Under section 3406, payers must generally withhold a
                    percentage of taxable interest, dividend, and certain other payments to a payee who does not give a TIN to the payer. Certain penalties may also apply for providing false or fraudulent information.
                  </p>
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

export default RequestForTaxpayerForm;
