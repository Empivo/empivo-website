import React, { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import { useRouter } from "next/router";
import useToastContext from "@/hooks/useToastContext";
import { preventMaxInput } from "@/utils/constants";

const TerminationNoticeForm = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
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

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper">
          <div className="employee_application_form_wrap">
            <div className="text_wrap_row text-center text-dark bg-light p-3">
              <strong className="text-dark text-lg d-block">Termination Notice - Job Abandonment</strong>
            </div>

            <div className="application_formatting text-dark py-3 d-flex align-items-center flex-wrap">
              <div className="terminationNotice">
                <div className="py-2 d-flex align-items-center">
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
                <div className="py-2 d-flex align-items-center">
                  Dear{" "}
                  <div className="position-relative mx-3">
                    <input
                      type="text"
                      placeholder="Employee Name"
                      className="form_input flex-grow-1"
                      maxLength={15}
                      disabled={formView}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("employeeName", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter employee name.'
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
                  ,
                </div>
                <div className="py-2 d-flex align-items-center">
                  <div className="position-relative mx-3">
                    <input
                      type="text"
                      placeholder="Address"
                      className="form_input flex-grow-1"
                      maxLength={15}
                      disabled={formView}
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
                </div>
                <div className="py-2 d-flex align-items-center">
                  <div className="position-relative mx-3">
                    <input
                      type="text"
                      placeholder="City, State, ZIP Code"
                      className="form_input flex-grow-1"
                      maxLength={15}
                      disabled={formView}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("cityState", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter city, state, ZIP code.'
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
                    <ErrorMessage message={errors?.cityState?.message} />
                  </div>
                </div>
                <div className="py-2 d-flex align-items-center">
                  Dear{" "}
                  <div className="position-relative mx-3">
                    <input
                      type="text"
                      placeholder="Employee Name"
                      className="form_input flex-grow-1"
                      maxLength={15}
                      disabled={formView}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("employeeNames", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter employee name.'
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
                    <ErrorMessage message={errors?.employeeNames?.message} />
                  </div>
                  :
                </div>
              </div>
              <div className="py-3 ">
                <p>
                  As of the date of this letter, you have been absent from work since [date of last day of work or last day of approved leave]. Because your absence has not been approved, and we have not heard from you, we have determined that you
                  have abandoned your position.
                </p>

                <p className="d-flex align-items-center">
                  In accordance with our policy on job abandonment, we are terminating your employment effective{" "}
                  <div className="position-relative mx-3">
                    <input
                      type="date"
                      disabled={formView}
                      placeholder="Date"
                      className="form_input flex-grow-1"
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
                  .
                </p>
                <p className="d-flex align-items-center flex-wrap">
                  Please return the following company property to
                  <div className="position-relative mx-3">
                    <input
                      type="text"
                      placeholder="name/department"
                      className="form_input flex-grow-1"
                      maxLength={15}
                      disabled={formView}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("nameDepartment", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter name/department.'
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
                    <ErrorMessage message={errors?.nameDepartment?.message} />
                  </div>{" "}
                  immediately:
                  <span>
                    <div className="position-relative mx-3">
                      <input
                        type="text"
                        placeholder="List items"
                        className="form_input flex-grow-1"
                        maxLength={15}
                        disabled={formView}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("listItems", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter list items.'
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
                      <ErrorMessage message={errors?.listItems?.message} />
                    </div>
                  </span>
                </p>
                <p className="d-flex align-items-center flex-wrap">
                  If the above items are not returned by{" "}
                  <div className="position-relative mx-3">
                    <input
                      type="date"
                      disabled={formView}
                      placeholder="date"
                      className="form_input flex-grow-1"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("returnDate", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter date.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.returnDate?.message} /> */}
                  </div>
                  ,{" "}
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
                  </div>{" "}
                  may pursue all avenues to recover the equipment, including legal action.
                </p>
                <p className="d-flex align-items-center flex-wrap">
                  Your final paycheck, including accrued but unused vacation leave, will be available{" "}
                  <div className="position-relative mx-3">
                    <input
                      type="date"
                      disabled={formView}
                      placeholder="date"
                      className="form_input flex-grow-1"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("availableDate", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter date.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.availableDate?.message} /> */}
                  </div>
                  . You may pick up your final paycheck at{" "}
                  <div className="position-relative mx-3">
                    <input
                      type="text"
                      placeholder="location"
                      className="form_input flex-grow-1"
                      maxLength={15}
                      disabled={formView}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("location", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter location.'
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
                    <ErrorMessage message={errors?.location?.message} />
                  </div>
                  . If you would like your final paycheck to be mailed, please contact{" "}
                  <div className="position-relative mx-3">
                    <input
                      type="text"
                      placeholder="Name"
                      className="form_input flex-grow-1"
                      maxLength={15}
                      disabled={formView}
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
                  at{" "}
                  <div className="position-relative mx-3">
                    <input
                      type="text"
                      disabled={formView}
                      placeholder="phone number/e-mail"
                      className="form_input flex-grow-1"
                      {...register("phoneEmail1", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter phone number/e-mail.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.phoneEmail1?.message} /> */}
                  </div>
                  .
                </p>
                <p>
                  You will receive information in the mail in the next few weeks regarding continuation under COBRA of any health care benefits in which you and your dependents are enrolled. Your health benefits will end effective{" "}
                  <div className="d-flex align-items-center flex-wrap">
                    <div className="position-relative me-3">
                      <input
                        type="date"
                        disabled={formView}
                        placeholder="date"
                        className="form_input flex-grow-1"
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
                    . Any questions regarding your health benefits and transition to COBRA can be addressed to{" "}
                    <div className="position-relative flex-grow-1 w-100 me-3">
                      <input
                        type="text"
                        placeholder="COBRA administrator name"
                        className="form_input w-100"
                        maxLength={15}
                        disabled={formView}
                        onInput={(e) => preventMaxInput(e, 15)}
                        {...register("administratorName", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter COBRA administrator name.'
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
                    at{" "}
                    <div className="position-relative mx-3">
                      <input
                        type="text"
                        disabled={formView}
                        placeholder="phone number/e-mail"
                        className="form_input flex-grow-1"
                        {...register("phoneEmail2", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter phone number/e-mail.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.phoneEmail2?.message} /> */}
                    </div>
                    .
                  </div>
                </p>
                <em>
                  [**Add additional benefits details here (e.g., supplemental medical and dental coverage, group term life insurance, dependent life insurance, flexible spending account, profit sharing, 401(k) plan, etc.). Check summary plan
                  descriptions or plan documents to determine what benefits to include, and obtain a good description of how the termination will impact the plans and any opportunity for continuation. Also add contact information for plan
                  administrators in case the recipient has questions about these benefit plans.]{" "}
                </em>
                <p className="d-flex align-items-center flex-wrap">
                  To ensure you receive tax documents and other notices from
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
                  </div>
                  , please notify us if your address changes. If you have any questions, please contact me at{" "}
                  <div className="position-relative mx-3">
                    <input
                      type="text"
                      placeholder="phone number/e-mail"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      {...register("phoneEmail", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter phone number/e-mail.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.phoneEmail?.message} /> */}
                  </div>
                  .{" "}
                </p>
              </div>
              <div className="py-2 d-flex align-items-center">Sincerely,</div>
              <div className="py-2 d-flex align-items-center">
                <div className="position-relative mx-3">
                  <input
                    type="text"
                    placeholder="Name"
                    disabled={formView}
                    className="form_input flex-grow-1"
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
              <div className="py-2 d-flex align-items-center">
                <div className="position-relative mx-3">
                  <input
                    type="text"
                    placeholder="Title"
                    disabled={formView}
                    className="form_input flex-grow-1"
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("title", {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter title.'
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
                  <ErrorMessage message={errors?.title?.message} />
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

export default TerminationNoticeForm;
