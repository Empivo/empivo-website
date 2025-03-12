import React, { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import useToastContext from "@/hooks/useToastContext";
import { apiPost, apiPut } from "@/utils/apiFetch";
import { useRouter } from "next/router";

const NonCompeteNonSocialization = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const notification = useToastContext();
  const { acceptedJobs, currentFormItem, setCurrentItem } = useContext(AuthContext);
  const router = useRouter();

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
    <div className="employee_application_form py-3">
      <div className="similar_wrapper text-dark">
        <div className="employee_application_form_wrap">
          <div className="text_wrap_row text-center text-dark bg-light mb-4">
            <strong className="text-lg">Noncompete and Nonsoliciation Provisions</strong>
          </div>
          <h6 className="text-dark text-center mb-4 fw-bold">SAMPLE NONCOMPETITION PROVISIONS</h6>
        </div>
        <ol className="mb-4">
          <li className="mb-4">
            The Employee specifically agrees that for a period of{" "}
            <div className="mb-3">
              <input
                type="number"
                className="form_input"
                disabled={formView}
                onInput={(e) => preventMaxInput(e, 5)}
                {...register("employeeMonth", {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter employee specifically.'
                  // },
                  min: {
                    value: 0,
                    message: "Value can't be less than 0.",
                  },
                })}
              />{" "}
              <ErrorMessage message={errors?.employeeMonth?.message} />
            </div>
            <p>
              [months/years] after the Employee is no longer employed by the Company, the Employee will not engage, directly or indirectly, either as proprietor, stockholder, partner, officer, employee or otherwise, in the same or similar activities
              as were performed for the Company in any business [within a{" "}
            </p>
            <input
              type="number"
              className="form_input"
              disabled={formView}
              onInput={(e) => preventMaxInput(e, 5)}
              {...register("businessMile", {
                // required: {
                //   value: true,
                //   message: 'Please enter mile radius of the company].'
                // },
                min: {
                  value: 0,
                  message: "Value can't be less than 0.",
                },
              })}
            />
            <ErrorMessage message={errors?.businessMile?.message} /> mile radius of the Company] [within{" "}
            <input
              type="number"
              className="form_input"
              disabled={formView}
              onInput={(e) => preventMaxInput(e, 5)}
              {...register("officeMile", {
                // required: {
                //   value: true,
                //   message: 'Please enter  miles of an office of the company.'
                // },
                min: {
                  value: 0,
                  message: "Value can't be less than 0.",
                },
              })}
            />
            <ErrorMessage message={errors?.officeMile?.message} /> miles of an office of the Company] [within a State where the Company has offices] [within the State of{" "}
            <input
              type="text"
              className="form_input"
              disabled={formView}
              maxLength={15}
              onInput={(e) => preventMaxInput(e, 15)}
              {...register("state", {
                // required: {
                //   value: true,
                //   message: 'Please enter states.'
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
            <ErrorMessage message={errors?.state?.message} /> ] which distributes or sells products or provides services similar to those distributed, sold, or provided by the Company at any time during the{" "}
            <input
              type="number"
              className="form_input"
              disabled={formView}
              onInput={(e) => preventMaxInput(e, 5)}
              {...register("productMonth", {
                // required: {
                //   value: true,
                //   message: 'Please enter employees termination of employment.'
                // },
                min: {
                  value: 0,
                  message: "Value can't be less than 0.",
                },
              })}
            />
            <ErrorMessage message={errors?.productMonth?.message} /> [months/years] preceding the Employees termination of employment.
          </li>
          <li>
            For a period of{" "}
            <input
              type="number"
              className="form_input"
              disabled={formView}
              onInput={(e) => preventMaxInput(e, 5)}
              {...register("periodMonth", {
                // required: {
                //   value: true,
                //   message: 'Please enter employees company.'
                // },
                min: {
                  value: 0,
                  message: "Value can't be less than 0.",
                },
              })}
            />
            <ErrorMessage message={errors?.periodMonth?.message} /> [months/years] after the Employee is no longer employed by the Company, the Employee will not, directly or indirectly, either as proprietor, stockholder, partner, officer, employee
            or otherwise, distribute, sell, offer to sell, or solicit any orders for the purchase or distribution of any products or services which are similar to those distributed, sold or provided by the Company during the{" "}
            <input
              type="number"
              className="form_input"
              disabled={formView}
              onInput={(e) => preventMaxInput(e, 5)}
              {...register("soldMonth", {
                // required: {
                //   value: true,
                //   message: 'Please enter preceding the Employees termination.'
                // },
                min: {
                  value: 0,
                  message: "Value can't be less than 0.",
                },
              })}
            />
            <ErrorMessage message={errors?.soldMonth?.message} /> [months/years] preceding the Employees termination of employment with the Company, to or from any person, firm or entity which was a customer of the Company during the{" "}
            <input
              type="number"
              className="form_input"
              disabled={formView}
              onInput={(e) => preventMaxInput(e, 5)}
              {...register("employmentMonth", {
                // required: {
                //   value: true,
                //   message:
                //     'Please enter preceding such termination of employment.'
                // },
                min: {
                  value: 0,
                  message: "Value can't be less than 0.",
                },
              })}
            />
            <ErrorMessage message={errors?.employmentMonth?.message} /> [months/years] preceding such termination of employment.{" "}
          </li>
        </ol>
        <h6 className="text-dark text-center mb-4 fw-bold">SAMPLE NONSOLICITATION OF CUSTOMERS/CLIENTS PROVISION</h6>
        <p>
          Employee agrees that for{" "}
          <input
            type="number"
            className="form_input"
            disabled={formView}
            onInput={(e) => preventMaxInput(e, 5)}
            {...register("clientMonth", {
              // required: {
              //   value: true,
              //   message: 'Please enter Employee agrees that for.'
              // },
              min: {
                value: 0,
                message: "Value can't be less than 0.",
              },
            })}
          />
          <ErrorMessage message={errors?.clientMonth?.message} /> [months/years] after Employee is no longer employed by the Company, Employee will not directly or indirectly solicit, agree to perform or perform services of any type that the Company
          can render (Services) for any person or entity who paid or engaged the Company for Services, or who received the benefit of the Companys Services, or with whom Employee had any substantial dealing while employed by the Company. However,
          this restriction with respect to Services applies only to those Services rendered by Employee or an office or unit of the Company in which Employee worked or over which Employee had supervisory authority. This restriction also applies to
          assisting any employer or other third party.
        </p>
        <h6 className="text-dark text-center mb-4 fw-bold">SAMPLE NONSOLICITATION OF EMPLOYEES PROVISION</h6>
        For a period of{" "}
        <input
          type="number"
          className="form_input"
          disabled={formView}
          onInput={(e) => preventMaxInput(e, 5)}
          {...register("employeeMonths", {
            // required: {
            //   value: true,
            //   message:
            //     'Please enter sample nonsociation of employees provision.'
            // },
            min: {
              value: 0,
              message: "Value can't be less than 0.",
            },
          })}
        />
        <ErrorMessage message={errors?.employeeMonths?.message} />{" "}
        <p>
          [months/years] from the date that Employee is no longer employed by the Company, Employee shall not take any actions to assist Employees successor employer or any other entity in recruiting any other employee who works for or is affiliated
          with the Company. This includes, but is not limited to: (a) identifying to such successor employer or its agents or such other entity the person or persons who have special knowledge concerning the Companys processes, methods or
          confidential affairs; and (b) commenting to the successor employer or its agents or such other entity about the quantity of work, quality of work, special knowledge, or personal characteristics of any person who is still employed at the
          Company. Employee also agrees that Employee will not provide such information set forth in (a) and (b) above to a prospective employer during interviews preceding possible employment.
        </p>
        <h6 className="text-dark text-center mb-4 fw-bold">SAMPLE SUCCESSORS AND ASSIGNS PROVISION</h6>
        <p>This Agreement may be assigned by the Company in the event of a merger or consolidation of the Company or in connection with the sale of all or substantially all of the Companys business.</p>
        <h6 className="text-dark text-center mb-4 fw-bold">SAMPLE SEVERABILITY PROVISION</h6>
        <p>
          The covenants of this Agreement shall be severable, and if any of them is held invalid because of its duration, scope of area or activity, or any other reason, the parties agree that such covenant shall be adjusted or modified by the court
          to the extent necessary to cure that invalidity, and the modified covenant shall thereafter be enforceable as if originally made in this Agreement. Employee agrees that the violation of any covenant contained in this Agreement may cause
          immediate and irreparable harm to the Company, the amount of which may be difficult or impossible to estimate or determine. If Employee violates any covenant contained in this Agreement, the Company shall have the right to equitable relief
          by injunction or otherwise, in addition to all other rights and remedies afforded by law.
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

export default NonCompeteNonSocialization;
