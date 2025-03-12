import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import { Row, Col } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import useToastContext from "@/hooks/useToastContext";
import { apiPost, apiPut } from "@/utils/apiFetch";
import { useRouter } from "next/router";
import SignPage from "@/pages/components/SignPage";
import RedStar from "@/pages/components/common/RedStar";

const ConfidentialityAgreementForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
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
    representativeSign: null,
  });
  const [src, setSrc] = useState(null);
  const [imageName, setImageName] = useState({
    employeeSign: null,
    representativeSign: null,
  });
  const [imageData, setImageData] = useState({
    employeeSign: null,
    representativeSign: null,
  });
  const [modalOpen, setModalOpen] = useState({
    employeeSign: false,
    representativeSign: false,
  });
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);

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

  const onSubmit = async (data) => {
    try {
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          employeeSign: JSON.stringify({
            employeeSign: imageData.employeeSign,
          }),
          representativeSign: JSON.stringify({
            representativeSign: imageData.representativeSign,
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

  const setFileImage = async (text1, image1, text2, image2) => {
    if (image1 && image2) {
      const imageData1 = JSON.parse(image1)[text1];
      const imageData2 = JSON.parse(image2)[text2];
      setPreview({
        [text1]: imageData1,
        [text2]: imageData2,
      });
      setImageData({
        [text1]: imageData1,
        [text2]: imageData2,
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
      setFileImage("employeeSign", currentFormItem.data?.employeeSign, "representativeSign", currentFormItem.data?.representativeSign);
      reset(currentFormItem.data);
      setValue("employeeSign", "");
      setValue("representativeSign", "");
    }
  }, [currentFormItem.data]);

  const handleObjectLength = (obj) => Object.keys(obj || {})?.length;

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper text-dark">
          <div className="employee_application_form_wrap">
            <div className="text_wrap_row text-center text-dark bg-light mb-4">
              <strong className="text-lg">Confidentiality Agreement</strong>
            </div>
            <p className="fw-bold text-dark">**This is only a model confidentiality agreement and may not be compliant with your local law. Please consult an attorney before you enter into a contract or agreement with any employee.</p>
            <Row>
              <Col md={6}>
                <div className="d-flex">
                  <label>This agreement is made between </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form_input"
                      maxLength={15}
                      disabled={formView}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("employeeAgreement", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter agreement.'
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
                    <ErrorMessage message={errors?.employeeAgreement?.message} />
                  </div>
                </div>
              </Col>

              <Col md={6}>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form_input"
                    disabled={formView}
                    placeholder="Name"
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("userName", {
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
                  <ErrorMessage message={errors?.userName?.message} />
                </div>
              </Col>
            </Row>
            <span className="d-flex align-item-center mb-3">
              {" "}
              and {acceptedJobs?.Company?.name} on{" "}
              <div className="position-relative">
                <input
                  type="text"
                  className="form_input smallFiweld"
                  disabled={formView}
                  maxLength={15}
                  style={{ width: "" }}
                  onInput={(e) => preventMaxInput(e, 15)}
                  {...register("company", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter company.'
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
                <ErrorMessage message={errors?.company?.message} />
              </div>{" "}
              20{" "}
            </span>
            <p>
              Employee will perform services for {acceptedJobs?.Company?.name} that may require
              {acceptedJobs?.Company?.name} to disclose confidential and proprietary information (Confidential Information) to Employee. (Confidential Information is information and data of any kind concerning any matters affecting or relating to{" "}
              {acceptedJobs?.Company?.name}, the business or operations of {acceptedJobs?.Company?.name}, and/or the products, drawings, plans, processes, or other data of {acceptedJobs?.Company?.name} not generally known or available outside of the
              company.)
            </p>
            <p>Accordingly, to protect the Confidential Information that will be disclosed during employment, the Employee agrees as follows:</p>
            <ul className="alpha_list mb-4">
              <li>
                Employee will hold the Confidential Information received from
                {acceptedJobs?.Company?.name} in strict confidence and will exercise a reasonable degree of care to prevent disclosure to others
              </li>
              <li>Employee will not disclose or divulge either directly or indirectly the Confidential Information to others unless first authorized to do so in writing by {acceptedJobs?.Company?.name} management.</li>

              <li>Employee will not reproduce the Confidential Information nor use this information commercially or for any purpose other than the performance of his/her duties for {acceptedJobs?.Company?.name}.</li>

              <li>
                Employee will, upon request or upon termination of his/her relationship with {acceptedJobs?.Company?.name}, deliver to {acceptedJobs?.Company?.name} any drawings, notes, documents, equipment, and materials received from{" "}
                {acceptedJobs?.Company?.name} or originating from employment with {acceptedJobs?.Company?.name}.
              </li>

              <li>
                {acceptedJobs?.Company?.name} will have the sole right to determine the treatment of all inventions, writings, ideas and discoveries received from Employee during the period of employment with
                {acceptedJobs?.Company?.name}, including the right to keep the same as a trade secret, to use and disclose the same without prior patent applications, to file copyright registrations in its own name, or to follow any other procedure
                as {acceptedJobs?.Company?.name} may deem appropriate.
              </li>

              <li>{acceptedJobs?.Company?.name} reserves the right to take disciplinary action, up to and including termination, for violations of this agreement in addition to pursuing civil or criminal penalties.</li>

              <li>
                This agreement will be interpreted under and governed by the laws of the state of{" "}
                <input
                  type="text"
                  className="form_input"
                  disabled={formView}
                  maxLength={15}
                  onInput={(e) => preventMaxInput(e, 15)}
                  {...register("governedLaws", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter governed by the laws.'
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
                <ErrorMessage message={errors?.governedLaws?.message} />
              </li>
              <li>
                All provisions of this agreement will be applicable only to the extent that they do not violate any applicable law and are intended to be limited to the extent necessary so that they will not render this agreement invalid, illegal or
                unenforceable. If any provision of this agreement or any application thereof will be held to be invalid, illegal or unenforceable, the validity, legality and enforceability of other provisions of this agreement or of any other
                application of such provision will in no way be affected thereby.
              </li>
            </ul>
            <p className="fw-bold">Immunity from Liability for Confidential Disclosure of a Trade Secret to the Government or in a Court Filing:</p>
            <ol className="mb-4">
              <li className="mb-3">
                Immunity—An individual will not be held criminally or civilly liable under any federal or state trade secret law for the disclosure of a trade secret that (A) is made (i) in confidence to a federal, state or local government official,
                either directly or indirectly, or to an attorney and (ii) solely for the purpose of reporting or investigating a suspected violation of law or (B) is made in a complaint or other document filed in a lawsuit or other proceeding, if
                such filing is made under seal.
              </li>
              <li>
                Use of Trade Secret Information in Anti-Retaliation Lawsuit—An individual who files a lawsuit for retaliation by an employer for reporting a suspected violation of law may disclose the trade secret to the attorney of the individual
                and use the trade secret information in the court proceeding, if the individual (A) files any document containing the trade secret under seal and (B) does not disclose the trade secret, except pursuant to court order.
              </li>
            </ol>
            <p>Employee represents and warrants that he or she is not under any pre-existing obligations inconsistent with the provisions of this agreement.</p>
            <p>Signing below signifies that the Employee agrees to the terms and conditions of the agreement stated above.</p>
            <Row className="gx-5 gy-3">
              <Col lg={6}>
                <label htmlFor="" className="m-0">
                  Employee <RedStar />
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form_input w-100"
                    disabled={formView}
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("employeeName", {
                      required: {
                        value: true,
                        message: "Please enter employee.",
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
              </Col>
              <Col lg={6}>
                <label htmlFor="" className="m-0">
                  {acceptedJobs?.Company?.name} Representative Name/Title <RedStar />
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form_input w-100"
                    disabled={formView}
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("companyName", {
                      required: {
                        value: true,
                        message: "Please enter name/title.",
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
                  <ErrorMessage message={errors?.companyName?.message} />
                </div>
              </Col>
              <Col lg={6}>
                <label htmlFor="" className="m-0">
                  Employee Signature <RedStar />
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
                  errors={<ErrorMessage message="Please select employeeSign" />}
                />
              </Col>
              <Col lg={6}>
                <label htmlFor="" className="m-0">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form_input w-100"
                      placeholder="Company Name"
                      maxLength={15}
                      disabled={formView}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("companyNames", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter company name.'
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
                    <ErrorMessage message={errors?.companyNames?.message} />
                  </div>{" "}
                  Representative Signature <RedStar />
                </label>
                <SignPage
                  imageName={imageName.representativeSign}
                  register={register("representativeSign", {
                    required: {
                      value: preview.representativeSign ? false : true,
                      message: "Please select signature",
                    },
                  })}
                  imageRef={imageRef2}
                  formView={formView}
                  handleImgChange={handleImgChange}
                  modalOpen={modalOpen}
                  handleSave={handleSave}
                  src={src}
                  text={"representativeSign"}
                  image={preview?.representativeSign}
                  errorCond={errors?.representativeSign}
                  imageShow={handleObjectLength(currentFormItem.data)}
                  errors={<ErrorMessage message="Please select representativeSign." />}
                />
              </Col>
              <Col lg={6}>
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
              <Col lg={6}>
                <label htmlFor="" className="m-0">
                  Date
                </label>
                <div className="position-relative">
                  <input
                    type="date"
                    disabled={formView}
                    className="form_input w-100"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("companyDate", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter date.'
                      // }
                    })}
                  />
                  {/* <ErrorMessage message={errors?.companyDate?.message} /> */}
                </div>
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
  );
};

export default ConfidentialityAgreementForm;
