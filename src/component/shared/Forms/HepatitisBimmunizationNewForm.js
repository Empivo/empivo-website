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

const HepatitisBimmunizationNewForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const notification = useToastContext();
  const { acceptedJobs, currentFormItem, setCurrentItem } = useContext(AuthContext);

  const [preview, setPreview] = useState({
    signature: null,
    vaccinatedSign: null,
  });
  const [src, setSrc] = useState(null);
  const [imageName, setImageName] = useState({
    signature: null,
    vaccinatedSign: null,
  });
  const [imageData, setImageData] = useState({
    signature: null,
    vaccinatedSign: null,
  });
  const [modalOpen, setModalOpen] = useState({
    signature: false,
    vaccinatedSign: false,
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
          signature: JSON.stringify({
            signature: imageData.signature,
          }),
          vaccinatedSign: JSON.stringify({
            vaccinatedSign: imageData.vaccinatedSign,
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
      setFileImage("signature", currentFormItem.data?.signature, "vaccinatedSign", currentFormItem.data?.vaccinatedSign);
      reset(currentFormItem.data);
      setValue("signature", "");
      setValue("vaccinatedSign", "");
    }
  }, [currentFormItem.data]);

  const handleObjectLength = (obj) => Object.keys(obj || {})?.length;

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper">
          <div className="employee_application_form_wrap">
            <div className="page_title text-center bg-light p-3">
              <strong className="text-lg text-dark">HEPATITIS B IMMUNIZATION CONSENT OR REFUSAL FORM</strong>
            </div>

            <div className="text_wrap_row">
              <strong className="text-dark">The Disease</strong>
              <p>
                Hepatitis B is a viral infection caused by Hepatitis B Virus (HBV) which causes death in 1%-2% of patients. Most people with Hepatitis B recover completely, but approximately 5%-10% become chronic carriers of the virus. Most of these
                people have no symptoms but can transmit the disease to others. Some may develop chronic active Hepatitis and Cirrhosis. HBV also has a role in the development of liver cancer. Immunization against Hepatitis B can prevent acute
                Hepatitis B and also reduce sickness and death from chronic active hepatitis, cirrhosis, and liver cancer.
              </p>

              <strong className="text-dark">The Vaccine</strong>
              <p>
                The vaccine is produced from yeast cells that are inoculated with the Hepatitis B virus antigen. Over 90% of healthy people who receive three doses of the vaccine achieve protection against Hepatitis B. Full immunization requires
                three doses of vaccine over a six (6) month period. Immunity may not develop after three doses. A few persons may not develop immunity even after six doses. There is no evidence that the vaccine has ever caused Hepatitis or AIDS.
              </p>

              <div className="my-3">
                <strong className="text-dark">Possible Side Effects</strong>
                <p>Incidence of side effects is generally low. Frequency of adverse reactions tends to decrease with successive doses.</p>

                <ol>
                  <li>Injection site soreness and fatigue are the most common adverse reactions.</li>
                  <li>Less common local reactions are redness, swelling, or an area of hardness.</li>
                  <li>General complaints, including dizziness, weakness, headaches, and fever occur occasionally.</li>
                  <li>Muscle or joint pains, nausea, vomiting, respiratory symptoms or chills are rare.</li>
                </ol>
              </div>

              <div className="my-3">
                <strong className="text-dark">Contraindication</strong>
                <ol>
                  <li> Hypersensitivity to yeast, aluminum, or mercury (components of vaccine).</li>
                  <li>Hepatitis B Vaccine is given to pregnant women only if clearly indicated. </li>
                  <li>Presence of any serious active infection.</li>
                </ol>
              </div>

              <div className="my-3">
                <strong className="text-dark">NOTE:</strong>
                <p>Hepatitis B has a long incubation period. Vaccination may not prevent Hepatitis B infection in those who have unrecognized infection at the time of vaccine administration.</p>
              </div>

              <p>
                I have read the above statement about Hepatitis and the Hepatitis B Vaccine. I have had an opportunity to ask questions and understand the benefits and risks of Hepatitis B vaccination. I understand that I must have three (3) doses of
                vaccine to confer immunity. However, as with all medical treatment, there is no guarantee that I will become immune or that I will not experience an adverse side effect from the vaccine.
              </p>
            </div>

            <div className="text_wrap_row my-3 pb-2 border-0">
              <div className="my-3 pb-3">
                <div className="sign_row d-flex align-content-center justify-content-between py-2 mb-3">
                  <span className=" w-50"> I have previously been vaccinated for Hepatitis B.</span>
                  <div className="form_group d-flex align-items-center flex-grow-1 pe-5">
                    <label className="me-2">
                      Signature <RedStar />
                    </label>
                    <div className="position-relative">
                      <SignPage
                        imageName={imageName.vaccinatedSign}
                        register={register("vaccinatedSign", {
                          required: {
                            value: preview.vaccinatedSign ? false : true,
                            message: "Please select signature.",
                          },
                        })}
                        imageRef={imageRef2}
                        formView={formView}
                        handleImgChange={handleImgChange}
                        modalOpen={modalOpen}
                        handleSave={handleSave}
                        src={src}
                        text={"vaccinatedSign"}
                        image={preview?.vaccinatedSign}
                        errorCond={errors?.vaccinatedSign}
                        imageShow={handleObjectLength(currentFormItem.data)}
                        errors={<ErrorMessage message="Please select vaccinatedSign." />}
                      />
                    </div>
                  </div>
                </div>

                <div className="sign_row d-flex align-content-center justify-content-between">
                  <strong className="text-dark flex-grow-1 w-50">I authorize the administration of the vaccine.</strong>
                  <div className="form_group d-flex align-items-center flex-grow-1 pe-5">
                    <label className="me-2">
                      Signature of Person Receiving Vaccine <RedStar />
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        disabled={formView}
                        className="form_input w-100"
                        maxLength={15}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("receivingVaccine", {
                          required: {
                            value: true,
                            message: "Please enter receiving vaccine.",
                          },
                          minLength: {
                            value: 2,
                            message: "Minimum length must be 2.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.receivingVaccine?.message} />
                    </div>
                  </div>
                </div>
              </div>

              <p>
                I understand that due to my occupational exposure to blood or other infectious materials, I may be at risk of acquiring Hepatitis B infection. I have been given the opportunity to be vaccinated at no charge to myself but decline
                vaccination at this time. I understand that by declining this vaccine, I continue to be at risk of acquiring Hepatitis B, a serious disease. If, in the future, I want to become vaccinated, I can receive the series at no charge to me.
                I refuse administration of the vaccine. I refuse administration of the vaccine.
              </p>

              <div className="d-flex">
                <div className="form_group d-flex align-items-center flex-grow-1 pe-5">
                  <label className="me-2">
                    Signature: <RedStar />
                  </label>
                  <div className="position-relative">
                    <SignPage
                      imageName={imageName.signature}
                      register={register("signature", {
                        required: {
                          value: preview.signature ? false : true,
                          message: "Please select signature.",
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
                </div>

                <div className="form_group d-flex align-items-center flex-grow-1 pe-5">
                  <label className="me-2">Date Signed:</label>
                  <div className="position-relative">
                    <input
                      type="date"
                      disabled={formView}
                      className="form_input"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("createdAt", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter date signed.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.createdAt?.message} /> */}
                  </div>
                </div>
              </div>

              <div className="my-5">
                <Table striped bordered responsive style={{ minWidth: "420px" }}>
                  <thead>
                    <tr>
                      <th>Date Vaccinated</th>
                      <th>Lot No.</th>
                      <th>Given by: (Name and Title)</th>
                      <th>Site</th>
                      <th>Next Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                    <tr>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                    <tr>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
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

export default HepatitisBimmunizationNewForm;
