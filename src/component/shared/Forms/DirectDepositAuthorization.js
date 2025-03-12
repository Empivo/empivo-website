import React, { useEffect, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/pages/components/ErrorMessage";
import AuthContext from "@/context/AuthContext";
import apiPath from "@/utils/pathObj";
import { apiPost, apiPut } from "@/utils/apiFetch";
import { preventMaxInput } from "@/utils/constants";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import OtpInput from "react18-input-otp";
import RedStar from "@/pages/components/common/RedStar";
import Helpers from "@/utils/helpers";

const DirectDepositAuthorization = ({ formCategoryType, formList, formView, indexForm, formLength, currentItem, isLastForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const notification = useToastContext();
  const router = useRouter();
  const { acceptedJobs, currentFormItem, setCurrentItem } = useContext(AuthContext);
  const [checkboxTitle, setCheckboxTitle] = useState([
    { label: "Checking (attached voided check)", value: false },
    {
      label: "Savings (attach deposit slip and obtain ABA routing number from your bank)",
      value: false,
    },
  ]);
  const [checkboxAccount, setCheckboxAccount] = useState([
    { label: "Checking (attached voided check)", value: false },
    {
      label: "Savings (attach deposit slip and obtain ABA routing number from your bank)",
      value: false,
    },
  ]);

  const [panNumber, setPanNumber] = useState("");
  const [ABANumber, setABANumber] = useState("");
  const [panNumber1, setPanNumber1] = useState("");
  const [ABANumber1, setABANumber1] = useState("");

  const handleCheckboxChange = (index) => {
    let checkbox = [...checkboxTitle];
    checkbox?.map((i) => (i.value = false));
    checkbox[index].value = !checkbox[index].value;
    setCheckboxTitle(checkbox);
  };
  const handleCheckboxAccount = (index) => {
    let checkboxes = [...checkboxAccount];
    checkboxes?.map((i) => (i.value = false));
    checkboxes[index].value = !checkboxes[index].value;
    setCheckboxAccount(checkboxes);
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

  const handleKeyDown = (event) => {
    if (!["Backspace", "Delete", "Tab"].includes(event.key) && !/[0-9.]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const onSubmit = async (data) => {
    try {
      data.account = Helpers.orCondition(checkboxTitle?.find((i) => i.value === true)?.label, "");
      data.account1 = checkboxAccount?.find((i) => i.value === true)?.label || "";
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          panNumbers: panNumber,
          abaNumber: ABANumber,
          panNumbers1: panNumber1,
          abaNumber1: ABANumber1,
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

  useEffect(() => {
    if (Object.keys(currentFormItem?.data || {})?.length) {
      commonFunction(checkboxTitle, setCheckboxTitle, currentFormItem.data?.account);
      commonFunction(checkboxAccount, setCheckboxAccount, currentFormItem.data?.account1);
      commonFunctionNumbers(setPanNumber, currentFormItem.data?.panNumbers);
      commonFunctionNumbers(setABANumber, currentFormItem.data?.abaNumber);
      commonFunctionNumbers(setPanNumber1, currentFormItem.data?.panNumbers1);
      commonFunctionNumbers(setABANumber1, currentFormItem.data?.abaNumber1);
      reset(currentFormItem.data);
    }
  }, [currentFormItem.data]);

  const preventMaxHundred = (e) => {
    if (e.target.value > 100) {
      e.target.value = e.target.value.slice(0, 2);
    }
  };

  return (
    <div>
      <div className="employee_application_form py-3">
        <div className="similar_wrapper">
          <div className="employee_application_form_wrap">
            <div className="text_wrap_row text-center text-dark bg-light p-3">
              <strong className="text-lg">Direct Deposit Authorization Form</strong>
              <p className="my-3">
                I hereby authorize {acceptedJobs?.Company?.name} to directly deposit my pay in the bank account(s) listed below in the percentages specified. (If two accounts are designated, deposits are to be made in whole percentages of pay to
                total 100%.) I have attached a voided personalized check (checking accounts) or deposit slip (savings accounts) for each account specified below. No more than two accounts may be designated. This authorization is to remain in force
                until the Company has received written authorization from me of its termination or change. Also, I hereby grant {acceptedJobs?.Company?.name} the right to correct any such electronic funds transfer resulting from an erroneous
                overpayment by debiting my account to the extent of such overpayment.
              </p>
            </div>

            <div className="text_wrap_row">
              <div className="form_group d-flex align-items-center">
                <label className="me-2">
                  Name (PRINT): <RedStar />
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    disabled={formView}
                    className="form_input flex-grow-1"
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

            <div className="text_wrap_row d-flex">
              <div className="form_group d-flex align-items-center w-50 pe-3">
                <label className="me-2">Name (PRINT):</label>
                <div className="position-relative">
                  <input
                    type="text"
                    disabled={formView}
                    className="form_input flex-grow-1"
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("name1", {
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
                  <ErrorMessage message={errors?.name1?.message} />
                </div>
              </div>
              <div className="form_group d-flex align-items-center w-50">
                <label className="me-2">Name (PRINT):</label>
                <div className="position-relative">
                  <input
                    type="text"
                    disabled={formView}
                    className="form_input flex-grow-1"
                    maxLength={15}
                    onInput={(e) => preventMaxInput(e, 15)}
                    {...register("name2", {
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
                  <ErrorMessage message={errors?.name2?.message} />
                </div>
              </div>
            </div>
            <hr />

            <div className="accont_detail">
              <strong className="text-dark">Account #1 (Check only one)</strong>

              <div className="text_wrap_row">
                {checkboxTitle?.map((item, index) => (
                  <>
                    <div className="my-2">
                      <label>
                        <input type="checkbox" disabled={formView} checked={item?.value} onChange={() => handleCheckboxChange(index)} />
                        {item?.label}
                      </label>
                    </div>
                  </>
                ))}
              </div>

              <div className="text_wrap_row d-flex align-items-center flex-wrap">
                <div className="form_group d-flex align-items-center w-50 pe-3">
                  <label className="me-2">
                    Financial Institution: <RedStar />
                  </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("financialInstitution", {
                        required: {
                          value: true,
                          message: "Please enter financial institution.",
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
                    <ErrorMessage message={errors?.financialInstitution?.message} />
                  </div>
                </div>

                <div className="form_group d-flex align-items-center w-50 pe-3">
                  <label className="me-2">
                    Street Address: <RedStar />
                  </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input flex-grow-1"
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

                <div className="form_group d-flex align-items-center w-50 pe-3">
                  <label className="me-2">
                    City, State and Zip Code: <RedStar />
                  </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("city", {
                        required: {
                          value: true,
                          message: "Please enter city.",
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
                    <ErrorMessage message={errors?.city?.message} />
                  </div>
                </div>

                <div className="form_group d-flex align-items-center w-50 pe-3">
                  <label className="me-2">
                    Telephone: <RedStar />
                  </label>
                  <div className="position-relative">
                    <input
                      type="number"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      onKeyDown={(event) => handleKeyDown(event)}
                      {...register("mobile", {
                        required: "Please enter mobile number.",
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: "First character can not be 0.",
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.mobile?.message} />
                  </div>
                </div>

                <div className="account_number">
                  <label>Personal Account Number</label>
                  <div className="account_number_fields">
                    <OtpInput
                      numInputs={15}
                      value={panNumber}
                      isDisabled={formView}
                      onChange={(e) => {
                        setPanNumber(e);
                      }}
                      isInputNum={true}
                      inputStyle={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "4px",
                        border: "1px solid black",
                      }}
                      separator={<span></span>}
                    />
                  </div>
                </div>

                <div className="account_number py-2">
                  <label>ABA (Routing)Number</label>
                  <div className="account_number_fields">
                    <OtpInput
                      numInputs={15}
                      value={ABANumber}
                      isDisabled={formView}
                      onChange={(e) => {
                        setABANumber(e);
                      }}
                      isInputNum={true}
                      inputStyle={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "4px",
                        border: "1px solid black",
                      }}
                      separator={<span></span>}
                    />
                  </div>
                </div>

                <div className="text_wrap_row">
                  <div className="form_group">
                    <label className="me-2">Amount of pay to be deposited into this account</label>
                    <div className="d-flex amountField">
                      <div className="amount">
                        <strong>$</strong>
                        <div>
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
                      </div>
                      <div className="amount  ps-3">
                        <strong>Or</strong>&nbsp;
                        <strong>%</strong>
                        <div>
                          {" "}
                          <input
                            type="number"
                            className="form_input flex-grow-1"
                            placeholder="percent"
                            disabled={formView}
                            onInput={(e) => preventMaxHundred(e)}
                            onKeyDown={(event) => handleKeyDown(event)}
                            {...register("percent", {
                              // required: {
                              //   value: true,
                              //   message: 'Please enter percent.'
                              // },
                              pattern: {
                                value: /^\d+$/,
                                message: "Only Digits Are Allowed.",
                              },
                              maxLength: {
                                value: 100,
                                message: "Max limit is 100.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                            })}
                          />
                          <ErrorMessage message={errors?.percent?.message} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/*  account_detail 2 */}

            <div className="accont_detail mt-3">
              <strong className="text-dark">Account #2 (Check only one)</strong>

              <div className="text_wrap_row">
                {checkboxAccount?.map((item, index) => (
                  <>
                    <div className="my-2">
                      <label className="">
                        <input type="checkbox" disabled={formView} checked={item?.value} onChange={() => handleCheckboxAccount(index)} />
                        {item?.label}
                      </label>
                    </div>
                  </>
                ))}
              </div>

              <div className="text_wrap_row d-flex align-items-center flex-wrap">
                <div className="form_group d-flex align-items-center w-50 pe-3">
                  <label className="me-2">Financial Institution:</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("financialInstitution1", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter financial institution.'
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
                    <ErrorMessage message={errors?.financialInstitution1?.message} />
                  </div>
                </div>

                <div className="form_group d-flex align-items-center w-50 pe-3">
                  <label className="me-2">Street Address:</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("address1", {
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
                    <ErrorMessage message={errors?.address1?.message} />
                  </div>
                </div>

                <div className="form_group d-flex align-items-center w-50 pe-3">
                  <label className="me-2">City, State and Zip Code:</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      {...register("city1", {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter city.'
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
                    <ErrorMessage message={errors?.city1?.message} />
                  </div>
                </div>

                <div className="form_group d-flex align-items-center w-50 pe-3">
                  <label className="me-2">Telephone:</label>
                  <div className="position-relative">
                    <input
                      type="number"
                      disabled={formView}
                      className="form_input flex-grow-1"
                      onKeyDown={(event) => handleKeyDown(event)}
                      {...register("mobile1", {
                        // required: 'Please enter mobile number.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: "First character can not be 0.",
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.mobile1?.message} />
                  </div>
                </div>

                <div className="account_number">
                  <label>Personal Account Number</label>
                  <div className="account_number_fields">
                    <OtpInput
                      numInputs={15}
                      value={panNumber1}
                      isDisabled={formView}
                      onChange={(e) => {
                        setPanNumber1(e);
                      }}
                      isInputNum={true}
                      inputStyle={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "4px",
                        border: "1px solid black",
                      }}
                      separator={<span></span>}
                    />
                  </div>
                </div>

                <div className="account_number py-2">
                  <label>ABA (Routing)Number</label>
                  <div className="account_number_fields">
                    <OtpInput
                      numInputs={15}
                      value={ABANumber1}
                      isDisabled={formView}
                      onChange={(e) => {
                        setABANumber1(e);
                      }}
                      isInputNum={true}
                      inputStyle={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "4px",
                        border: "1px solid black",
                      }}
                      separator={<span></span>}
                    />
                  </div>
                </div>

                <div className="text_wrap_row">
                  <div className="form_group">
                    <label className="me-2">Amount of pay to be deposited into this account</label>
                    <div className="d-flex amountField">
                      <div className="amount pe-3">
                        <strong>$</strong>
                        <div>
                          <input
                            type="number"
                            className="form_input flex-grow-1"
                            disabled={formView}
                            placeholder="amount"
                            onKeyDown={(event) => handleKeyDown(event)}
                            {...register("amount1", {
                              // required: 'Please enter amount.',
                              pattern: {
                                value: /^(?:[1-9]\d*|0)$/,
                                message: "First character can not be 0.",
                              },
                            })}
                          />
                          <ErrorMessage message={errors?.amount1?.message} />
                        </div>
                      </div>
                      <div className="amount">
                        <strong>Or</strong>&nbsp;
                        <strong>%</strong>
                        <div>
                          <input
                            type="number"
                            className="form_input flex-grow-1"
                            disabled={formView}
                            placeholder="percent"
                            onInput={(e) => preventMaxHundred(e)}
                            onKeyDown={(event) => handleKeyDown(event)}
                            {...register("percent1", {
                              // required: {
                              //   value: true,
                              //   message: 'Please enter percent.'
                              // },
                              pattern: {
                                value: /^\d+$/,
                                message: "Only Digits Are Allowed.",
                              },
                              maxLength: {
                                value: 100,
                                message: "Max limit is 100.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                            })}
                          />
                          <ErrorMessage message={errors?.percent1?.message} />
                        </div>
                      </div>
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
      </div>
    </div>
  );
};

export default DirectDepositAuthorization;
