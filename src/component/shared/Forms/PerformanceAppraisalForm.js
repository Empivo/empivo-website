import React, { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import { preventMaxInput } from "@/utils/constants";
import { Table } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import RedStar from "@/pages/components/common/RedStar";

const PerformanceAppraisalForm = ({ formCategoryType, formList, formView, indexForm, isLastForm, formLength, currentItem }) => {
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

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper">
          <div className="employee_application_form_wrap">
            <div className="text_wrap_row text-center text-dark bg-light p-3">
              <strong className="text-dark text-lg d-block">Performance Appraisal Self-Assessment</strong>
            </div>

            <div className="d-flex">
              <div className="form_group d-sm-flex align-items-center w-50 pe-3">
                <label className="me-2">
                  Employee Name: <RedStar />
                </label>
                <div className="position-relative flex-grow-1">
                  <input
                    type="text"
                    disabled={formView}
                    className="form_input w-100"
                    maxLength={15}
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
                    })}
                  />
                  <ErrorMessage message={errors?.employeeName?.message} />
                </div>
              </div>
              <div className="form_group d-flex align-items-center w-50">
                <label className="me-2">
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
            </div>

            <div className="d-flex">
              <div className="form_group d-flex align-items-center w-50 pe-3">
                <label className="me-2">
                  Job Title: <RedStar />
                </label>
                <div className="position-relative flex-grow-1">
                  <input
                    type="text"
                    disabled={formView}
                    className="form_input w-100"
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("jobTitle", {
                      required: {
                        value: true,
                        message: "Please enter job title.",
                      },
                      minLength: {
                        value: 2,
                        message: "Minimum length must be 2.",
                      },
                    })}
                  />
                  <ErrorMessage message={errors?.jobTitle?.message} />
                </div>
              </div>
              <div className="form_group d-flex align-items-center w-50">
                <label className="me-2">
                  Location: <RedStar />
                </label>
                <div className="position-relative flex-grow-1">
                  <input
                    type="text"
                    className="form_input w-100"
                    disabled={formView}
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("location", {
                      required: {
                        value: true,
                        message: "Please enter location.",
                      },
                      minLength: {
                        value: 2,
                        message: "Minimum length must be 2.",
                      },
                    })}
                  />
                  <ErrorMessage message={errors?.location?.message} />
                </div>
              </div>
            </div>

            <div className="d-flex">
              <div className="form_group d-flex align-items-center w-50 pe-3">
                <label className="me-2">
                  Supervisors Name: <RedStar />
                </label>
                <div className="position-relative flex-grow-1">
                  <input
                    type="text"
                    className="form_input w-100"
                    disabled={formView}
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("supervisorName", {
                      required: {
                        value: true,
                        message: "Please enter supervisor name.",
                      },
                      minLength: {
                        value: 2,
                        message: "Minimum length must be 2.",
                      },
                    })}
                  />
                  <ErrorMessage message={errors?.supervisorName?.message} />
                </div>
              </div>

              <div className="form_group d-sm-flex align-items-center w-50 pe-3">
                <label className="me-2">
                  Performance Review Period: <RedStar />
                </label>
                <div className="position-relative flex-grow-1">
                  <input
                    type="text"
                    className="form_input w-100"
                    disabled={formView}
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("reviewPeriod", {
                      required: {
                        value: true,
                        message: "Please enter performance review period.",
                      },
                      minLength: {
                        value: 2,
                        message: "Minimum length must be 2.",
                      },
                    })}
                  />
                  <ErrorMessage message={errors?.reviewPeriod?.message} />
                </div>
              </div>
            </div>

            <div>
              <strong>Employee Instructions:</strong>
              <b>
                <em>
                  Please complete and return this self-evaluation to your supervisor by{" "}
                  <div className="d-flex align-items-end">
                    <div className="position-relative mt-3 me-3">
                      <input
                        type="date"
                        placeholder="date"
                        disabled={formView}
                        className="form_input"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("employeeInstructionDate", {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter date.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage
                      message={errors?.employeeInstructionDate?.message}
                    /> */}
                    </div>
                    <span>. </span>
                  </div>
                </em>
              </b>
              <p>
                Your thorough and timely participation in the appraisal process will help facilitate a fair and comprehensive review of your progress and accomplishments since the last performance review. If you have been employed by the company less
                than a year, substitute references to since the last performance appraisal/review with since you were hired and answer the questions accordingly.
              </p>
            </div>
          </div>

          <div className="text_wrap_row pt-0">
            <ul className="Performance_point list-unstyled">
              <li>1. List your most significant accomplishments or contributions since last year. How do these achievements align with the goals/objectives outlined in your last review?</li>

              <li>2. Since the last appraisal period, have you successfully performed any new tasks or additional duties outside the scope of your regular responsibilities? If so, please specify.</li>

              <li>3. What activities have you initiated, or actively participated in, to encourage camaraderie and teamwork within your group and/or office? What was the result?</li>

              <li>
                4. Describe your professional development activities since last year, such as offsite seminars/classes (specify if self-directed or required by your supervisor), onsite training, peer training, management coaching or mentoring,
                on-the-job experience, exposure to challenging projects, other—please describe.
              </li>

              <li>5. Describe areas you feel require improvement in terms of your professional capabilities. List the steps you plan to take and/or the resources you need to accomplish this.</li>

              <li>6. Identify two career goals for the coming year and indicate how you plan to accomplish them.</li>

              <li>7. Evaluate yourself on all factors that apply to you since your last performance appraisal, or date of hire if employed here less than one year. If a category does not apply to you, indicate N/A.</li>

              <li>
                <div className="rating_scale">
                  <strong>Rating Scale: </strong>

                  <ul className="d-flex flex-wrap gap-2 list-unstyled ">
                    <li>
                      <b>4 -</b> Outstanding/Role Model{" "}
                    </li>
                    <li>
                      <b>3 -</b> Very Competent{" "}
                    </li>
                    <li>
                      <b>2 -</b> Satisfactory{" "}
                    </li>
                    <li>
                      <b>1 -</b> Inexperienced or Improvement Needed{" "}
                    </li>
                  </ul>
                  <div className="rating_block">
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Category </th>
                          <th>Self-Rating </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>a. Technical Skills related to your specific job </td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("technicalSkills", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>b. Technical Knowledge (up-to-date on industry/discipline news, articles and best practices) </td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("technicalKnowledge", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>c. Quality of Work Product (comprehensive, accurate, timely, etc.)</td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("qualityWork", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>d. Utilization or Productivity </td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("utilization", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>e. Business Development</td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("businessDevelopment", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>f. Project Management Skills </td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("projectSkills", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>g. Technology Skills</td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("technologySkills", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>h. Time Management & Organizational Skills</td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("organizationalSkills", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>i. Interpersonal Skills (positive attitude; ability to get along well with co-workers/clients/vendors) </td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("interpersonalSkills", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>j. Communication Skills—Verbal/Written (proposals/reports, letters, e-mails, etc.) </td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("communicationSkill", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>k. Innovation or Creativity</td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("creativity", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>l. Collaboration/Teamwork</td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("collaboration", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>m. Mentoring Skills </td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("mentoringSkills", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>n. Employee Policies (knowledgeable of and compliant with company policies and procedures) </td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("employeePolicies", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>o. Leadership Skills (applies to anyone—not restricted to supervisory level employees) </td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("leadershipSkill", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>p. Professionalism (punctuality, attendance; conduct; responsiveness and follow through) </td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("professionalism", {})} />
                          </td>
                        </tr>

                        <tr>
                          <td>
                            q. <b>Overall</b>{" "}
                          </td>
                          <td>
                            <input type="text" className="form_input" maxLength={15} disabled={formView} onInput={(e) => preventMaxInput(e, 15)} {...register("overall", {})} />
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </li>
              <li>8. Name any other management personnel, besides your current supervisor, that you feel should provide input toward your performance appraisal. </li>
            </ul>
          </div>

          <div className="text_wrap_row">
            <strong>Thank you for taking the time to complete the Employee Self-Assessment. </strong>

            <strong className="my-3 d-block">Supervisors: Attach completed Self-Assessments to the Employees Performance Appraisal and return to HR. </strong>
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

export default PerformanceAppraisalForm;
