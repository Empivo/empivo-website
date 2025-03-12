import React, { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import RedStar from "@/pages/components/common/RedStar";

const NoticeToEmployeeForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const notification = useToastContext();
  const router = useRouter();
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
    <div className="employee_application_form py-3">
      <div className="similar_wrapper text-dark">
        <div className="employee_application_form_wrap">
          <div className="text_wrap_row text-center text-dark bg-light mb-4">
            <strong className="text-lg">Notice to Employee of Change from Full-time to Part-time Status</strong>
          </div>
        </div>
        <div className="d-sm-flex">
          <div className="d-flex mb-3 flex-grow-1 w-sm-50 pe-3">
            <label htmlFor="" className="my-0 me-2">
              Date: <RedStar />
            </label>
            <div className="position-relative flex-grow-1">
              <input
                type="date"
                disabled={formView}
                className="form_input w-100"
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
          <div className="d-flex mb-3 flex-grow-1 w-sm-50 pe-3">
            <label htmlFor="" className="my-0 me-2">
              Dear <RedStar />
            </label>
            <div className="position-relative flex-grow-1">
              <input
                type="text"
                className="form_input w-100"
                placeholder="Name"
                disabled={formView}
                onInput={(e) => preventMaxInput(e, 15)}
                {...register("name", {
                  required: {
                    value: true,
                    message: "Please enter dear.",
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

        <div className="d-flex align-items-center pb-3">
          <label className="me-3"> Effective </label>
          <div className="position-relative">
            <input
              type="date"
              disabled={formView}
              className="form_input"
              min={new Date().toISOString().split("T")[0]}
              {...register("effectiveDate", {
                // required: {
                //   value: true,
                //   message: 'Please enter date.'
                // }
              })}
            />
            {/* <ErrorMessage message={errors?.effectiveDate?.message} /> */}
          </div>
          <span className="ps-2"> your work hours will be reduced to </span>
        </div>

        <p>
          <div className="position-relative">
            <input
              type="number"
              className="form_input w-100"
              placeholder="number of hours per week"
              disabled={formView}
              onKeyDown={(event) => handleKeyDown(event)}
              {...register("hoursPerWeek", {
                // required: {
                //   value: true,
                //   message: 'Please enter number of hours per week.'
                // },
                min: {
                  value: 0,
                  message: "Value can't be less than 0.",
                },
              })}
            />
            <ErrorMessage message={errors?.hoursPerWeek?.message} />
          </div>{" "}
          <div className="d-flex align-items-center">
            <label className="me-3"> due to</label>
            <div className="position-relative">
              <input
                type="text"
                disabled={formView}
                placeholder="Insert reason"
                className="form_input flex-grow-1"
                maxLength={15}
                onInput={(e) => preventMaxInput(e, 15)}
                {...register("insertReason", {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter reasons.'
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
              <ErrorMessage message={errors?.insertReason?.message} />
            </div>
            <span>. As a result, your base salary will be reduced accordingly. Your new base salary will be $</span>
          </div>
          <div className="d-flex py-3 align-items-center">
            <div className="position-relative">
              <input
                type="number"
                className="form_input flex-grow-1"
                placeholder="amount"
                disabled={formView}
                onKeyDown={(event) => handleKeyDown(event)}
                {...register("amount", {
                  // required: 'Please enter amount.',
                  pattern: {
                    value: /^(?:[1-9]\d*|0)$/,
                    message: "First character can not be 0.",
                  },
                })}
              />
              <ErrorMessage message={errors?.amount?.message} />
            </div>
            <span>and will be reflected on your paycheck dated </span>
          </div>
          <div className="position-relative">
            <input
              type="date"
              disabled={formView}
              placeholder="date"
              className="form_input"
              min={new Date().toISOString().split("T")[0]}
              {...register("paycheckDate", {
                // required: {
                //   value: true,
                //   message: 'Please enter date.'
                // }
              })}
            />
            {/* <ErrorMessage message={errors?.paycheckDate?.message} /> */}
          </div>
        </p>
        <p>
          Based on our policies and benefits plan, changing to a part-time status (less than [number] hours per week) makes you ineligible for group health benefits. Your group health benefits will end on [date]. You will receive information
          regarding COBRA continuation health coverage in a separate notice at your home address.
        </p>
        <p>
          <em>[Insert information on other benefits that are impacted by a reduction in hours].</em>
        </p>
        <p>
          If you have any questions, please contact{" "}
          <em>
            <div className="d-sm-flex align-items-center py-3">
              <div className="position-relative">
                <input
                  type="text"
                  disabled={formView}
                  placeholder="Name"
                  className="form_input flex-grow-1 w-100"
                  maxLength={15}
                  onInput={(e) => preventMaxInput(e, 15)}
                  {...register("names", {
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
                <ErrorMessage message={errors?.names?.message} />
              </div>{" "}
              <span className="px-sm-3 AndCenterPosition"> and</span>
              <div className="position-relative">
                <input
                  type="number"
                  placeholder="contact"
                  disabled={formView}
                  className="form_input flex-grow-1 w-100"
                  onKeyDown={(event) => handleKeyDown(event)}
                  {...register("contactInfo", {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter contact.'
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
                <ErrorMessage message={errors?.contactInfo?.message} />
              </div>{" "}
            </div>
            information.
          </em>
        </p>
        <p>
          Sincerely, <br />
          Human Resources
        </p>
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

export default NoticeToEmployeeForm;
