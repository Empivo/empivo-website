import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import { Form } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import RedStar from "@/pages/components/common/RedStar";

const CobraTerminationForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
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
    { label: "A required premium was not paid in full on time.", value: false },
    {
      label: "A qualified beneficiary became covered, after electing continuation coverage, under another group health plan that does not impose any preexisting condition exclusion for a preexisting condition of the qualified beneficiary.",
      value: false,
    },
    {
      label: "A covered employee became entitled to Medicare benefits (under Part A, Part B or both) after electing continuation coverage.",
      value: false,
    },
    {
      label: "The employer ceased to provide any group health plan for its employees.",
      value: false,
    },
    { label: "For cause (i.e., fraud)", value: false },
  ]);

  const onSubmit = async (data) => {
    try {
      data.reasons = checkboxes?.find((i) => i.value === true)?.label || "";
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
  };
  const commonFunction = (check, setState, value) => {
    let checkBox = [...check];
    const i = checkBox.findIndex((item) => item.label === value);
    if (i !== -1) checkBox[i].value = true;
    setState(checkBox);
  };

  useEffect(() => {
    if (Object.keys(currentFormItem?.data || {})?.length) {
      commonFunction(checkboxes, setCheckboxes, currentFormItem.data?.reasons);

      reset(currentFormItem.data);
    }
  }, [currentFormItem.data]);

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper">
          <div className="employee_application_form_wrap">
            <div className="text_wrap_row text-center text-dark bg-light">
              <strong className="text-lg">COBRA Termination of Coverage Notice</strong>
            </div>
            <div className="text_wrap_row mediumDeviceFull">
              <div className="mb-3">
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
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  disabled={formView}
                  placeholder="Name(s) of employee, spouse and covered dependents"
                  className="form_input w-50 text-dark"
                  maxLength={15}
                  onInput={(e) => preventMaxInput(e, 15)}
                  {...register("employeeName", {
                    // required: {
                    //   value: true,
                    //   message:
                    //     'Please enter Name(s) of employee, spouse and covered dependents.'
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
              <div className="mb-3">
                <input
                  type="text"
                  disabled={formView}
                  placeholder="Last known mailing address"
                  className="form_input w-25 text-dark"
                  onInput={(e) => preventMaxInput(e)}
                  {...register("email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address.",
                    },
                  })}
                />{" "}
                <ErrorMessage message={errors?.email?.message} />
              </div>
              <p>
                This notice pertains to your COBRA continuation coverage under [Name of the plan(s) under which COBRA coverage will terminate]. It is important that all covered individuals read this notice. Please advise{" "}
                <div className="position-relative">
                  <input
                    type="text"
                    className="form_input w-100"
                    disabled={formView}
                    placeholder="Name of COBRA administrator"
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("administratorName", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter name of COBRA administrator.'
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
                  <ErrorMessage message={errors?.administratorName?.message} />
                </div>
                immediately if there is a covered dependent not living at the above address.
              </p>
              <p>Coverage under the plan(s) named above ceased or will cease on [last day of coverage] for the following individuals:</p>
              <p>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form_input w-100"
                    disabled={formView}
                    placeholder="Insert name(s) of qualified beneficiaries who are losing coverage"
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("insertName", {
                      // required: {
                      //   value: true,
                      //   message:
                      //     'Please enter insert name(s) of qualified beneficiaries.'
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
                  <ErrorMessage message={errors?.insertName?.message} />
                </div>{" "}
              </p>
              <p>COBRA continuation coverage terminated or will terminate for the following reason:</p>
              <div className="mb-3 fullRadioLabel">
                {checkboxes?.slice(0, 6)?.map((item, index) => (
                  <>
                    <Form.Check type="checkbox" label={item.label} id="check1" name="group1" className="radio_btn text-wrap check_label" disabled={formView} checked={item?.value} onChange={() => handleCheckboxChange(index)} />
                  </>
                ))}
              </div>
              <div className="mb-3 d-flex">
                <Form.Check
                  type="checkbox"
                  label={checkboxes[6]?.label}
                  id="check1"
                  disabled={formView}
                  name="group1"
                  className="radio_btn text-wrap check_label"
                  checked={checkboxes[6]?.value}
                  onChange={() => {
                    handleCheckboxChange(6);
                  }}
                />
                {checkboxes[6]?.value && <input type="text" className="form_input ms-3 flex-grow- text-wrap1" disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("otherReason", {})} />}
              </div>
              <p>[Describe any rights the qualified beneficiary may have to elect alternative group or individual coverage, such as a conversion right.]</p>
              <p>If you believe that your COBRA coverage should not have been terminated, you can request us to reconsider our determination by filing an appeal as follows:</p>
              <ul>
                <li>
                  Send a written appeal to{" "}
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form_input"
                      disabled={formView}
                      placeholder="Name"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("name", {
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
                    <ErrorMessage message={errors?.name?.message} />
                  </div>{" "}
                  and{" "}
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form_input"
                      disabled={formView}
                      placeholder="Address"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("address", {
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
                    <ErrorMessage message={errors?.address?.message} />
                  </div>
                  within 30 days of your receipt of this notice.
                </li>
                <li>
                  Explain why you believe your COBRA continuation coverage was improperly terminated and include all information you wish to be reviewed. Be sure to include your name, current address and the names of any covered dependents you wish
                  to include in your appeal.
                </li>
              </ul>
              <p>If you have any questions regarding the information in this notice, you should contact:</p>
              <div className="position-relative">
                <input
                  type="text"
                  className="form_input w-100"
                  disabled={formView}
                  placeholder="Name of COBRA administrator"
                  maxLength={15}
                  onInput={(e) => preventMaxInput(e, 15)}
                  {...register("COBRAName", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter name of COBRA administrator.'
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
                <ErrorMessage message={errors?.COBRAName?.message} />
              </div>

              <div className="d-flex align-items-center">
                <div className="position-relative flex-grow-1">
                  <input
                    type="number"
                    className="form_input w-100"
                    disabled={formView}
                    placeholder="telephone Number"
                    maxLength={10}
                    onInput={(e) => preventMaxInput(e, 10)}
                    {...register("telephoneNumber", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter telephone number.'
                      // },
                      minLength: {
                        value: 10,
                        message: "Minimum length must be 10.",
                      },
                    })}
                  />
                  <ErrorMessage message={errors?.telephoneNumber?.message} />
                </div>{" "}
                <strong className="px-3 AndCenterPosition"> and</strong>
                <div className="position-relative flex-grow-1">
                  <input
                    type="text"
                    className="form_input w-100"
                    disabled={formView}
                    placeholder="address"
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("COBRAAddress", {
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
                  <ErrorMessage message={errors?.COBRAAddress?.message} />
                </div>
                .{" "}
              </div>
              <div className="d-flex pt-4">
                <label>
                  {" "}
                  Sincerely, <RedStar />
                </label>

                <div className="position-relative">
                  <input
                    type="text"
                    disabled={formView}
                    className="form_input"
                    placeholder="Name"
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("names", {
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
                  <ErrorMessage message={errors?.names?.message} />
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

export default CobraTerminationForm;
