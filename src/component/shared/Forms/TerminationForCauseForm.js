import React, { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import { useRouter } from "next/router";
import useToastContext from "@/hooks/useToastContext";
import { preventMaxInput } from "@/utils/constants";
import RedStar from "@/pages/components/common/RedStar";

const TerminationForCauseForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const notification = useToastContext();
  const { acceptedJobs, currentFormItem, setCurrentItem } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
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

  useEffect(() => {
    if (Object.keys(currentFormItem?.data || {})?.length) {
      reset(currentFormItem.data);
    }
  }, [currentFormItem.data]);

  const handleKeyDown = (event) => {
    if (!["Backspace", "Delete", "Tab"].includes(event.key) && !/[0-9.]/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper">
          <div className="employee_application_form_wrap">
            <div className="text_wrap_row text-center text-dark bg-light p-3">
              <strong className="text-dark text-lg d-block">Termination for Cause Example Letter</strong>
            </div>

            <div className="application_formatting text-dark py-3">
              <div className="py-2 d-flex flex-wrap align-items-center">
                <div className="position-relative mx-3">
                  <input
                    type="date"
                    disabled={formView}
                    placeholder="Date"
                    className="form_input flex-grow-1"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("createdAt", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter date.'
                      // }
                    })}
                  />
                  {/* <ErrorMessage message={errors?.createdAt?.message} /> */}
                </div>
              </div>
              <div className="py-2 d-flex flex-wrap align-items-center">
                Dear <RedStar />
                <div className="position-relative mx-3">
                  <input
                    type="text"
                    placeholder="Employee Name"
                    className="form_input flex-grow-1"
                    maxLength={15}
                    disabled={formView}
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
                ,
              </div>
              <div className="py-2 d-flex flex-wrap align-items-center">
                This letter confirms our discussion today informing you that your employment with{" "}
                <div className="position-relative mx-3">
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="form_input flex-grow-1"
                    maxLength={15}
                    disabled={formView}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("companyName", {
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
                  <ErrorMessage message={errors?.companyName?.message} />
                </div>{" "}
                is terminated effective immediately due to{" "}
                <div className="position-relative flex-grow-1 mx-3">
                  <input
                    type="text"
                    placeholder="reason for termination"
                    className="form_input "
                    maxLength={50}
                    disabled={formView}
                    onInput={(e) => preventMaxInput(e, 50)}
                    {...register("reasonForTermination", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter reason for termination.'
                      // },
                      minLength: {
                        value: 2,
                        message: "Minimum length must be 2.",
                      },
                      maxLength: {
                        value: 15,
                        message: "Maximum length must be 50.",
                      },
                    })}
                  />
                  <ErrorMessage message={errors?.reasonForTermination?.message} />
                </div>
                .{" "}
                <div className="my-2 d-flex flex-wrap flex-grow-1 w-100">
                  <div className="position-relative me-3 flex-grow-1">
                    <input
                      type="text"
                      placeholder="Insert details regarding coaching, warnings and other related documentation"
                      className="form_input w-100"
                      maxLength={50}
                      disabled={formView}
                      onInput={(e) => preventMaxInput(e, 50)}
                      {...register("details", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter details.'
                        // },
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
                    <ErrorMessage message={errors?.details?.message} />
                  </div>
                  .
                </div>
                Your final paycheck will be provided to you on{" "}
                <div className="position-relative mx-3">
                  <input
                    type="date"
                    disabled={formView}
                    placeholder="Date"
                    className="form_input flex-grow-1"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("finalDate", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter date.'
                      // }
                    })}
                  />
                  {/* <ErrorMessage message={errors?.finalDate?.message} /> */}
                </div>{" "}
                and will include payment for unused, accrued vacation hours. Your health insurance benefits will continue through{" "}
                <div className="d-flex align-items-end mb-3">
                  <div className="position-relative me-3">
                    <input
                      type="date"
                      disabled={formView}
                      placeholder="Date"
                      className="form_input flex-grow-1"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("insuranceDate", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter date.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.insuranceDate?.message} /> */}
                  </div>
                  .{" "}
                </div>
                Your rights to continue coverage under COBRA will be provided to you by mail from our plan administrator. You can contact{" "}
                <div className="position-relative mb-3 flex-grow-1 w-100">
                  <input
                    type="text"
                    placeholder="retirement plan administrator"
                    className="form_input w-100"
                    maxLength={15}
                    disabled={formView}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("retirementPlan", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter retirement plan administrator.'
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
                  <ErrorMessage message={errors?.retirementPlan?.message} />
                </div>
                at{" "}
                <div className="position-relative mx-3">
                  <input
                    type="number"
                    placeholder="phone number"
                    className="form_input flex-grow-1"
                    disabled={formView}
                    onKeyDown={(event) => handleKeyDown(event)}
                    {...register("mobile", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter phone number.'
                      // },
                      minLength: {
                        value: 10,
                        message: "Minimum length should be 10 digits.",
                      },
                      maxLength: {
                        value: 10,
                        message: "Maximum length should be 10 digits.",
                      },
                      pattern: {
                        value: /^(?:[1-9]\d*|0)$/,
                        message: "First character can not be 0.",
                      },
                    })}
                  />
                  <ErrorMessage message={errors?.mobile?.message} />
                </div>{" "}
                regarding your retirement plan distribution options. The following{" "}
                <div className="position-relative mx-3">
                  <input
                    type="text"
                    placeholder="Company Name"
                    disabled={formView}
                    className="form_input flex-grow-1"
                    maxLength={15}
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
                property must be returned to human resources immediately: [Type of property (cellphone, laptop, keys, etc.)] Should you have further questions, please contact me directly at{" "}
                <div className="position-relative mx-3">
                  <input
                    type="number"
                    placeholder="phone number"
                    disabled={formView}
                    className="form_input flex-grow-1"
                    onKeyDown={(event) => handleKeyDown(event)}
                    {...register("mobileNumber", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter phone number.'
                      // },
                      minLength: {
                        value: 10,
                        message: "Minimum length should be 10 digits.",
                      },
                      maxLength: {
                        value: 10,
                        message: "Maximum length should be 10 digits.",
                      },
                      pattern: {
                        value: /^(?:[1-9]\d*|0)$/,
                        message: "First character can not be 0.",
                      },
                    })}
                  />
                  <ErrorMessage message={errors?.mobileNumber?.message} />
                </div>
                <div className="">or </div>
                <div className="position-relative mx-3">
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="form_input flex-grow-1"
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
                </div>
                <div className="position-relative mx-3">
                  <input
                    type="text"
                    placeholder="e-mail"
                    disabled={formView}
                    className="form_input flex-grow-1"
                    {...register("email", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter email.'
                      // },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address.",
                      },
                    })}
                  />
                  <ErrorMessage message={errors?.email?.message} />
                </div>
                . Sincerely,
              </div>
              <div className="py-2 d-flex flex-wrap align-items-center">
                <div className="position-relative mx-3">
                  <input
                    type="text"
                    placeholder="Name"
                    className="form_input flex-grow-1"
                    disabled={formView}
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
                </div>
              </div>
              <div className="py-2 d-flex flex-wrap align-items-center">
                <div className="position-relative mx-3">
                  <input
                    type="text"
                    placeholder="Job title"
                    className="form_input flex-grow-1"
                    maxLength={15}
                    disabled={formView}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("jobTitle", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter job title.'
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
                  <ErrorMessage message={errors?.jobTitle?.message} />
                </div>
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

export default TerminationForCauseForm;
