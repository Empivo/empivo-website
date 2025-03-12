import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import { Form, Row, Col } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import SignPage from "@/pages/components/SignPage";
import RedStar from "@/pages/components/common/RedStar";
import Helpers from "@/utils/helpers";

const IndependentContractorForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
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
    sign: null,
    printedSign: null,
    signature: null,
  });
  const [src, setSrc] = useState(null);
  const [imageName, setImageName] = useState({
    sign: null,
    printedSign: null,
    signature: null,
  });
  const [imageData, setImageData] = useState({
    sign: null,
    printedSign: null,
    signature: null,
  });
  const [modalOpen, setModalOpen] = useState({
    sign: false,
    printedSign: false,
    signature: false,
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

  const [checkboxes, setCheckboxes] = useState([
    {
      label: "Contractor has the right to perform services for others during the term of this Agreement.",
      value: false,
    },
    {
      label:
        "Contractor has the sole right to control and direct the means, manner, and method by which the services required by this Agreement will be performed. Contractor shall select the routes taken, starting, and quitting times, days of work, and order the work is performed.",
      value: false,
    },
    {
      label: "Contractor has the right to hire assistants as subcontractors or to use employees to provide the services required by this Agreement.",
      value: false,
    },
    {
      label: "Neither Contractor nor Contractors employees or contract personnel shall be required to wear any uniforms provided by Client.",
      value: false,
    },
    {
      label: "The services required by this Agreement shall be performed by Contractor, Contractors employees, or contract personnel, and Client shall not hire, supervise, or pay any assistants to help Contractor.",
      value: false,
    },
    {
      label: "Neither Contractor nor Contractors employees or contract personnel shall receive any training from Client in the professional skills necessary to perform the services required by this Agreement.",
      value: false,
    },
    {
      label: "Neither Contractor nor Contractors employees or contract personnel shall be required by Client to devote full time to the performance of the services required by this Agreement.",
      value: false,
    },
  ]);
  const [checkboxesInsurance, setCheckboxesInsurance] = useState([
    {
      label:
        "Automobile liability insurance for each vehicle used in the performance of this Agreement -- including owned, non-owned (for example, owned by Contractors employees), leased, or hire vehicles -- in the minimum amount of $ combined single limit per occurrence for bodily injury and property damage.",
      value: false,
    },
    {
      label:
        "Comprehensive or commercial general liability insurance coverage in the minimum amount of $ combined single limit, including coverage for bodily injury, personal injury, broad form property damage, contractual liability, and cross-liability.",
      value: false,
    },
    {
      label: "Professional liability insurance policy in the minimum amount of $ to protect against claims such as negligence, misrepresentation and inaccurate advice.",
      value: false,
    },
    {
      label: "Before commencing any work, Contractor shall provide Client with proof of this insurance and with proof that Client has been made an additional insured under the policies.",
      value: false,
    },
  ]);
  const [checkboxesDelegation, setCheckboxesDelegation] = useState([
    {
      label: "Either Contractor or Client may assign rights and may delegate duties under this Agreement.",
      value: false,
    },
    {
      label: "Contractor may not assign or subcontract any rights or delegate any of its duties under this Agreement without Clients prior written approval.",
      value: false,
    },
  ]);

  const onSubmit = async (data) => {
    try {
      data.contractorStatus = checkboxes;
      data.assignment = Helpers.orCondition(checkboxesDelegation?.find((i) => i.value === true)?.label, "");
      data.checkInsurance = checkboxesInsurance?.find((i) => i.value === true)?.label || "";
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          sign: JSON.stringify({ sign: imageData.sign }),
          printedSign: JSON.stringify({
            printedSign: imageData.printedSign,
          }),
          signature: JSON.stringify({ signature: imageData.signature }),
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
    // checkbox?.map(i => (i.value = false))
    checkbox[index].value = !checkbox[index].value;
    setCheckboxes(checkbox);
  };
  const handleCheckboxInsurance = (index) => {
    let checkbox1 = [...checkboxesInsurance];
    // checkbox?.map(i => (i.value = false))
    checkbox1[index].value = !checkbox1[index].value;
    setCheckboxesInsurance(checkbox1);
  };
  const handleCheckboxDelegation = (index) => {
    let checkboxDel = [...checkboxesDelegation];
    checkboxDel?.map((i) => (i.value = false));
    checkboxDel[index].value = !checkboxDel[index].value;
    setCheckboxesDelegation(checkboxDel);
  };

  const commonFunction = (check, setState, value) => {
    let checkBox = [...check];
    const i = checkBox.findIndex((item) => item.label === value);
    if (i !== -1) checkBox[i].value = true;
    setState(checkBox);
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
      setCheckboxes(currentFormItem?.data?.contractorStatus);
      commonFunction(checkboxesDelegation, setCheckboxesDelegation, currentFormItem?.data?.assignment);
      commonFunction(checkboxesInsurance, setCheckboxesInsurance, currentFormItem?.data?.checkInsurance);
      setFileImage("sign", currentFormItem.data?.sign, "printedSign", currentFormItem.data?.printedSign, "signature", currentFormItem.data?.signature);
      reset(currentFormItem.data);
      setValue("sign", "");
      setValue("printedSign", "");
      setValue("signature", "");
    }
  }, [currentFormItem.data]);

  const handleObjectLength = (obj) => Object.keys(obj || {})?.length;

  return (
    <div className="employee_application_form py-3">
      <div className="similar_wrapper text-dark">
        <div className="employee_application_form_wrap">
          <div className="text_wrap_row text-center text-dark bg-light mb-4">
            <strong className="text-lg">Independent Contractor Agreement</strong>
          </div>
        </div>

        <p className="d-flex flex-wrap">
          This Agreement is made between{" "}
          <div className="position-relative">
            <input
              type="text"
              className="form_input mb-2"
              disabled={formView}
              maxLength={15}
              onInput={(e) => preventMaxInput(e, 15)}
              {...register("agreement", {
                // required: {
                //   value: true,
                //   message: 'Please enter this agreement.'
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
            <ErrorMessage message={errors?.agreement?.message} />{" "}
          </div>
          (Client) with a principal place of business at{" "}
          <div className="position-relative d-flex flex-wrap align-items-center">
            <input
              type="text"
              className="form_input mb-2"
              disabled={formView}
              maxLength={15}
              onInput={(e) => preventMaxInput(e, 15)}
              {...register("principal", {
                // required: {
                //   value: true,
                //   message: 'Please enter principal.'
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
            <ErrorMessage message={errors?.principal?.message} /> <span className="mx-3">and </span>
          </div>
          <div className="position-relative mx-3">
            <input
              type="text"
              className="form_input mb-2"
              disabled={formView}
              maxLength={15}
              onInput={(e) => preventMaxInput(e, 15)}
              {...register("contractor", {
                // required: {
                //   value: true,
                //   message: 'Please enter contractor.'
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
            <ErrorMessage message={errors?.contractor?.message} />
          </div>{" "}
          (Contractor), with a principal place of business at{" "}
          <div className="position-relative d-flex flex-wrap align-items-end">
            <input
              type="text"
              className="form_input flex-grow-1"
              disabled={formView}
              maxLength={15}
              onInput={(e) => preventMaxInput(e, 15)}
              {...register("business", {
                // required: {
                //   value: true,
                //   message: 'Please enter business.'
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
            <ErrorMessage message={errors?.business?.message} /> <span className="ms-3">.</span>
          </div>
        </p>

        <ol className="mt-3 pt-3">
          <li className="mb-3">
            <b className="mb-2">Services to Be Performed</b>
            <label htmlFor="">Contractor agrees to perform the following services:</label>
            <textarea
              name=""
              id=""
              cols="30"
              rows="5"
              className="form-control mt-2"
              disabled={formView}
              maxLength={15}
              onInput={(e) => preventMaxInput(e, 15)}
              {...register("contractorAgree", {
                // required: {
                //   value: true,
                //   message:
                //     'Please enter contractor agrees to perform the following services.'
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
            ></textarea>
            <ErrorMessage message={errors?.contractorAgree?.message} />
          </li>
          <li className="mb-3">
            <b className="d-block">Payment</b>
            In consideration for the services to be performed by Contractor, Client agrees to pay Contractor at the following rates:{" "}
            <input
              type="text"
              className="form_input mb-2"
              disabled={formView}
              maxLength={15}
              onInput={(e) => preventMaxInput(e, 15)}
              {...register("rates", {
                // required: {
                //   value: true,
                //   message: 'Please enter following rates.'
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
            <ErrorMessage message={errors?.rates?.message} />. Contractor shall be paid within a reasonable time after Contractor submits an invoice to Client. The invoice should include the following: an invoice number, the dates covered by the
            invoice, and a summary of the work performed.
          </li>
          <li className="mb-3">
            <b className="mb-2">Expenses</b>
            <ol className="alpha_list">
              <li className="mb-3">
                <p>
                  Contractor shall be responsible for all expenses incurred while performing services under this Agreement. This includes automobile, truck, and other travel expenses; vehicle maintenance and repair costs; vehicle and other license
                  fees and permits; insurance premiums; road, fuel, and other taxes; fines; radio, pager, or cell phone expenses; meals; and all salary, expenses, and other compensation paid to employees or contract personnel the Contractor hires to
                  complete the work under this Agreement.
                </p>
              </li>
              <li className="mb-3">
                Client shall reimburse Contractor only for the following expenses that are attributable directly to work performed under this Agreement:{" "}
                <input
                  type="text"
                  className="form_input"
                  disabled={formView}
                  maxLength={15}
                  onInput={(e) => preventMaxInput(e, 15)}
                  {...register("underAgreement", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter under this Agreement.'
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
                <ErrorMessage message={errors?.underAgreement?.message} />.{" "}
              </li>
              <li className="mb-3">Contractor shall submit an itemized statement of Contractors expenses. Client shall pay Contractor within 30 days after receipt of each statement.</li>
            </ol>
          </li>
          <li className="mb-3">
            <b className="mb-2">Vehicles and Equipment</b>
            <p>
              Contractor will furnish all vehicles, equipment, tools, and materials used to provide the services required by this Agreement. Client will not require Contractor to rent or purchase any equipment, product, or service as a condition of
              entering into this Agreement.
            </p>
          </li>
          <li>
            <b className="mb-2">Independent Contractor Status</b>
            <p>
              Contractor is an independent contractor, and neither Contractor nor Contractors employees or contract personnel are, or shall be deemed, Clients employees. In its capacity as an independent contractor, Contractor agrees and represents,
              and Client agrees, as follows [Check all that apply]
            </p>
            <div className="mb-2">
              {checkboxes?.map((item, index) => (
                <>
                  <Form.Check type="checkbox" label={item?.label} id="check1" name="group1" className="radio_btn" disabled={formView} checked={item?.value} onChange={() => handleCheckboxChange(index)} />
                </>
              ))}
            </div>
          </li>

          <li>
            <b className="mb-2">Business Licenses, Permits, and Certificates</b>
            <p>
              Contractor represents and warrants that Contractor and Contractors employees and contract personnel will comply with all federal, state, and local laws requiring drivers and other licenses, business permits, and certificates required to
              carry out the services to be performed under this Agreement.
            </p>
          </li>
          <li>
            <b className="mb-2">State and Federal Taxes</b>
            <p>Client will not:</p>
            <ol className="alpha_list">
              <li>withhold FICA (Social Security and Medicare taxes) from Contractors payments or make FICA payments on Contractors behalf</li>
              <li>make state or federal unemployment compensation contributions on Contractors behalf, or</li>
              <li>withhold state or federal income tax from Contractors payments.</li>
              <li>
                Contractor shall pay all taxes incurred while performing services under this Agreement—including all applicable income taxes and, if Contractor is not a corporation, self-employment (Social Security) taxes. Upon demand, Contractor
                shall provide Client with proof that such payments have been made.
              </li>
            </ol>
          </li>
          <li>
            <b className="mb-2">Fringe Benefits</b>
            <p>Contractor understands that neither Contractor nor Contractors employees or contract personnel are eligible to participate in any employee pension, health, vacation pay, sick pay, or other fringe benefit plan of Client.</p>
          </li>
          <li>
            <b className="mb-2">Unemployment Compensation</b>
            <p>
              Client shall make no state or federal unemployment compensation payments on behalf of Contractor or Contractors employees or contract personnel. Contractor will not be entitled to these benefits in connection with work performed under
              this Agreement.
            </p>
          </li>
          <li>
            <b className="mb-2">Workers Compensation</b>
            <p>
              Client shall not obtain workers compensation insurance on behalf of Contractor or Contractors employees. If Contractor hires employees to perform any work under this Agreement, Contractor will cover them with workers compensation
              insurance to the extent required by law and provide Client with a certificate of workers compensation insurance before the employees begin the work.
            </p>
          </li>
          <li>
            <b className="mb-2">Insurance</b>
            <p>
              Client shall not provide insurance coverage of any kind for Contractor or Contractors employees or contract personnel. Contractor shall obtain the following insurance coverage and maintain it during the entire term of this Agreement:
            </p>
            <p>[Check all that apply.]</p>
            <div className="d-flex mb-3">
              {checkboxesInsurance?.map((item, index) => (
                <>
                  <div className="d-flex flex-nowrap">
                    <Form.Check type="checkbox" id="check1" disabled={formView} name="group1" className="radio_btn me-2" checked={item?.value} onChange={() => handleCheckboxInsurance(index)} />

                    <p className="d-inline-block">
                      {item?.label}{" "}
                      {/* <input
                  type='text'
                  className='form_input mb-1'
                  disabled={formView}
                />{' '} */}
                    </p>
                  </div>
                </>
              ))}
            </div>
          </li>
          <li>
            <b className="mb-2">Indemnification</b>
            <p>Contractor shall indemnify and hold Client harmless from any loss or liability arising from performing services under this Agreement.</p>
          </li>
          <li>
            <b className="mb-2">Term of Agreement</b>
            <p>This agreement will become effective when signed by both parties and will terminate on the earlier of:</p>
            <div className="d-flex mb-3">
              <Form.Check type="checkbox" id="check1" name="group1" disabled={formView} className="radio_btn me-2" />
              <p>the date Contractor completes the services required by this Agreement</p>
            </div>
            <div className="d-flex mb-3">
              <Form.Check type="checkbox" id="check1" name="group1" disabled={formView} className="radio_btn me-2" />
              <p>
                <input type="text" className="form_input mb-1" disabled={formView} /> [date], or
              </p>
            </div>
            <div className="d-flex mb-3">
              <Form.Check type="checkbox" id="check1" disabled={formView} name="group1" className="radio_btn me-2" />
              <p>the date a party terminates the Agreement as provided below.</p>
            </div>
          </li>

          <li>
            <b className="mb-2">Terminating the Agreement</b>
            <p>With reasonable cause, either Client or Contractor may terminate this Agreement, effective immediately upon giving written notice. Reasonable cause includes:</p>

            <ol className="alpha_list">
              <li className="mb-2">a material violation of this Agreement, or</li>
              <li className="mb-2">any act exposing the other party to liability to others for personal injury or property damage.</li>
            </ol>
            <p>OR</p>
            <p>
              Either party may terminate this Agreement at any time by giving <input type="text" className="form_input" disabled={formView} /> days written notice to the other party of the intent to terminate.
            </p>
          </li>
          <li>
            <b className="mb-2">Exclusive Agreement</b>
            <p>This is the entire Agreement between Contractor and Client.</p>
          </li>

          <li>
            <b className="mb-2">Modifying the Agreement</b>
            <p>This Agreement may be modified only by a writing signed by both parties.</p>
          </li>

          <li>
            <b className="mb-2">Resolving Disputes</b>
            <div className="d-flex flex-nowrap  mb-2">
              <Form.Check type="checkbox" id="check1" name="group1" disabled={formView} className="radio_btn me-2" />
              <p>
                If a dispute arises under this Agreement, any party may take the matter to <input type="text" className="form_input mb-1" disabled={formView} /> (state) court, jurisdiction of the county of{" "}
                <input type="text" className="form_input mb-1" />.
              </p>
            </div>
            <p className="mb-2">OR</p>
            <div className="d-flex flex-nowrap mb-2">
              <Form.Check type="checkbox" id="check1" disabled={formView} name="group1" className="radio_btn me-2" />
              <p>
                a dispute arises under this Agreement, the parties agree to first try to resolve the dispute with the help of a mutually agreed-upon mediator in{" "}
                <input
                  type="text"
                  className="form_input mb-1"
                  disabled={formView}
                  maxLength={15}
                  onInput={(e) => preventMaxInput(e, 15)}
                  {...register("mediator", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter mediator.'
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
                <ErrorMessage message={errors?.mediator?.message} /> County, CA. Any costs and fees other than attorney fees associated with the mediation shall be shared equally by the parties. If it proves impossible to arrive at a mutually
                satisfactory solution through mediation, the parties agree to submit the dispute to a mutually agreed-upon arbitrator in{" "}
                <input
                  type="text"
                  className="form_input mb-1"
                  disabled={formView}
                  maxLength={15}
                  onInput={(e) => preventMaxInput(e, 15)}
                  {...register("country", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter country.'
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
                <ErrorMessage message={errors?.country?.message} />
                County,
                <input
                  type="text"
                  className="form_input mb-1"
                  disabled={formView}
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
                [State]. Judgment upon the award rendered by the arbitrator may be entered in any court that has jurisdiction to do so. Costs of arbitration, including attorney fees, will be allocated by the arbitrator.
              </p>
            </div>
          </li>

          <li>
            {" "}
            <b className="mb-2">Confidentiality</b>
            <p>
              Contractor acknowledges that it will be necessary for Client to disclose certain confidential and proprietary information to Contractor in order for Contractor to perform duties under this Agreement. Contractor acknowledges that
              disclosure to a third party or misuse of this proprietary or confidential information would irreparably harm Client. Accordingly, Contractor will not disclose or use, either during or after the term of this Agreement, any proprietary or
              confidential information of Client without Clients prior written permission except to the extent necessary to perform services on Clients behalf. Proprietary or confidential information includes:
            </p>
            <ol className="alpha_list">
              <li>the written, printed, graphic, or electronically recorded materials furnished by Client for Contractor to use</li>
              <li>any written or tangible information stamped “confidential,” “proprietary,” or with a similar legend, or any information that Client makes reasonable efforts to maintain the secrecy of</li>
              <li>
                business or marketing plans or strategies, customer lists, operating procedures, trade secrets, design formulas, know-how and processes, computer programs and inventories, discoveries, and improvements of any kind, sales projections,
                and pricing information
              </li>
              <li>information belonging to customers and suppliers of Client about whom Contractor gained knowledge as a result of Contractors services to Client, and</li>
              <li>
                other:{" "}
                <input
                  type="text"
                  className="form_input"
                  disabled={formView}
                  maxLength={15}
                  onInput={(e) => preventMaxInput(e, 15)}
                  {...register("others", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter other.'
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
                <ErrorMessage message={errors?.others?.message} />.
              </li>
            </ol>
            <p>
              Upon termination of Contractors services to Client, or at Clients request, Contractor shall deliver to Client all materials in Contractors possession relating to Clients business. Contractor acknowledges that any breach or threatened
              breach of Clause 18 of this Agreement will result in irreparable harm to Client for which damages would be an inadequate remedy. Therefore, Client shall be entitled to equitable relief, including an injunction, in the event of such
              breach or threatened breach of Clause 18 of this Agreement. Such equitable relief shall be in addition to Clients rights and remedies otherwise available at law.
            </p>
          </li>
          <li>
            <b className="mb-2">Proprietary Information. </b>
            <ol className="alpha_list">
              <li>
                The product of all work performed under this Agreement (“Work Product”), including without limitation all notes, reports, documentation, drawings, computer programs, inventions, creations, works, devices, models, work-in-progress and
                deliverables will be the sole property of the Client, and Contractor hereby assigns to the Client all right, title and interest therein, including but not limited to all audiovisual, literary, moral rights and other copyrights, patent
                rights, trade secret rights and other proprietary rights therein. Contractor retains no right to use the Work Product and agree not to challenge the validity of the Client’s ownership in the Work Product.
              </li>
              <li>
                Contractor hereby assigns to the Client all right, title, and interest in any and all work products made by the Client during Contractor’s work for them, including, but not limited to, any royalties, proceeds, or other benefits
                derived from such work products.
              </li>
              <li>The Client will be entitled to use Contractor’s name and/or likeness use in advertising and other materials.</li>
            </ol>
          </li>
          <li>
            <b className="mb-2">No Partnership</b>
            <p>This Agreement does not create a partnership relationship. Contractor does not have authority to enter into contracts on Clients behalf.</p>
          </li>
          <li>
            <b className="mb-2">Assignment and Delegation</b>
            <div>
              {checkboxesDelegation?.map((item, index) => (
                <>
                  <Form.Check type="checkbox" label={item.label} id="check1" name="group1" className="radio_btn" disabled={formView} checked={item?.value} onChange={() => handleCheckboxDelegation(index)} />
                </>
              ))}
            </div>
            <p className="my-2">OR</p>
          </li>
          <li>
            <b className="mb-2">Applicable Law</b>
            <p>
              This Agreement will be governed by [State]{" "}
              <input
                type="text"
                className="form_input"
                disabled={formView}
                maxLength={15}
                onInput={(e) => preventMaxInput(e, 15)}
                {...register("agreementGoverned", {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter this agreement will be governed by.'
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
              <ErrorMessage message={errors?.agreementGoverned?.message} /> law, without giving effect to conflict of laws principles.
            </p>
          </li>
        </ol>

        <div className="mb-3">
          <SignPage
            imageName={imageName.sign}
            register={register("sign", {
              required: {
                value: preview.sign ? false : true,
                message: "Please select signature",
              },
            })}
            imageRef={imageRef1}
            formView={formView}
            handleImgChange={handleImgChange}
            modalOpen={modalOpen}
            handleSave={handleSave}
            src={src}
            text={"sign"}
            image={preview?.sign}
            errorCond={errors?.sign}
            imageShow={handleObjectLength(currentFormItem.data)}
            errors={<ErrorMessage message="Please select sign." />}
          />
          <label htmlFor="" className="mt-1">
            Signature <RedStar />
          </label>
        </div>

        <Row className="gy-3">
          <Col md={12}>
            <h5>
              <b>Client/Owner:</b>
            </h5>
          </Col>
          <Col md={4}>
            <label htmlFor="" className="m-0">
              Printed Name
            </label>
            <input
              type="text"
              className="form_input w-100"
              disabled={formView}
              maxLength={15}
              onInput={(e) => preventMaxInput(e, 15)}
              {...register("clientPrintedName", {
                // required: {
                //   value: true,
                //   message: 'Please enter  printed name.'
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
            <ErrorMessage message={errors?.clientPrintedName?.message} />
          </Col>
          <Col md={4}>
            <label htmlFor="" className="m-0">
              Signature <RedStar />
            </label>
            <SignPage
              imageName={imageName.printedSign}
              register={register("printedSign", {
                required: {
                  value: preview.printedSign ? false : true,
                  message: "Please select signature",
                },
              })}
              imageRef={imageRef2}
              formView={formView}
              handleImgChange={handleImgChange}
              modalOpen={modalOpen}
              handleSave={handleSave}
              src={src}
              text={"printedSign"}
              image={preview?.printedSign}
              errorCond={errors?.printedSign}
              imageShow={handleObjectLength(currentFormItem.data)}
              errors={<ErrorMessage message="Please select printedSign." />}
            />
          </Col>
          <Col md={4}>
            <label htmlFor="" className="m-0">
              Date
            </label>
            <input
              type="date"
              className="form_input w-100"
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
          <Col md={12}>
            <h5>
              <b>Contractor:</b>
            </h5>
          </Col>
          <Col md={6}>
            <label htmlFor="" className="my-0">
              Printed Name
            </label>
            <input
              type="text"
              className="form_input w-100"
              disabled={formView}
              maxLength={15}
              onInput={(e) => preventMaxInput(e, 15)}
              {...register("printedName", {
                // required: {
                //   value: true,
                //   message: 'Please enter  printed name.'
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
            <ErrorMessage message={errors?.printedName?.message} />
          </Col>
          <Col md={6}>
            <label htmlFor="" className="my-0">
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
              imageRef={imageRef3}
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
          </Col>
          <Col md={6}>
            <label htmlFor="" className="my-1">
              Date <RedStar />
            </label>
            <input
              type="date"
              className="form_input w-100"
              disabled={formView}
              min={new Date().toISOString().split("T")[0]}
              {...register("createdAt", {
                required: {
                  value: true,
                  message: "Please enter date.",
                },
              })}
            />
            <ErrorMessage message={errors?.createdAt?.message} />
          </Col>
          <Col md={6}>
            <label htmlFor="" className="my-1">
              Taxpayer ID Number
            </label>
            <input
              type="number"
              className="form_input w-100"
              disabled={formView}
              onKeyDown={(event) => {
                if (!["Backspace", "Delete", "Tab"].includes(event.key) && !/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              {...register("taxPrayerID", {
                // required: 'Please enter taxpayer ID number.',
                pattern: {
                  value: /^(?:[1-9]\d*|0)$/,
                  message: "First character can not be 0.",
                },
              })}
            />
            <ErrorMessage message={errors?.taxPrayerID?.message} />
          </Col>
        </Row>
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

export default IndependentContractorForm;
