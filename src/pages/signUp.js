import React, { useState, useEffect, useContext } from "react";
import { Container, Form, FloatingLabel, Col, Row, Button } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import AuthFooter from "./components/AuthFooter";
import ErrorMessage from "./components/ErrorMessage";
import { handleKeyDown, preventMaxInput, validationRules } from "@/utils/constants";
import { useForm } from "react-hook-form";
import apiPath from "@/utils/pathObj";
import { apiGet, apiPost } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { isEmpty } from "lodash";
import AuthContext from "@/context/AuthContext";
import OTPVerify from "./otpVerify";
// import ODatePicker from "./components/common/ODatePicker";
// import dayjs from "dayjs";
import Header from "./components/Header";
import RedStar from "./components/common/RedStar";
import Helpers from "@/utils/helpers";

function SignUp() {
  const notification = useToastContext();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm();
  const { verifyOtpData } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [conPassToggle, setConPassToggle] = useState(false);
  const [recordsTemp, setRecordTemp] = useState([]);
  const [listTemp, setListTemp] = useState([]);
  const [cat, setCat] = useState();
  const [subCat, setSubCat] = useState();
  const [isCatError, setIsCatError] = useState(false);
  const [isSubCatError, setIsSubCatError] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [bodyData, setBodyData] = useState({});
  // const [expiryFrom, setExpiryFrom] = useState();
  const [selectedCountry, setSelectedCountry] = useState({});
  // const [dateErrors, setDateErrors] = useState({
  //   startDate: "",
  // });

  function changeIcon2() {
    setShowPassword(!showPassword);
  }

  function changeIcon() {
    setConPassToggle(!conPassToggle);
  }
  const checkFields = () => {
    let isValid = true;

    const validateField = (value, setErrorState) => {
      if (!value) {
        setErrorState(true);
        isValid = false;
      } else {
        setErrorState(false);
      }
    };

    validateField(cat, setIsCatError);
    validateField(subCat, setIsSubCatError);
    return isValid;
  };

  // const validateFunc = () => {
  //   if (!expiryFrom) {
  //     setDateErrors({
  //       startDate: "Please select dob.",
  //     });
  //     return false;
  //   } else {
  //     setDateErrors({
  //       ...dateErrors,
  //       startDate: "",
  //     });
  //   }
  //   setDateErrors({});
  //   return true;
  // };

  // const handleDateChange = (start) => {
  //   setExpiryFrom(dayjs(start).toDate());
  // };
  // useEffect(() => {
  //   if (dateErrors.startDate) {
  //     validateFunc();
  //   }
  // }, [expiryFrom]);

  useEffect(() => {
    if (!isEmpty(verifyOtpData)) {
      if (verifyOtpData) {
        setValue("name", verifyOtpData?.Obj?.name);
        setValue("email", verifyOtpData?.Obj?.email);
        // setValue("mobile", verifyOtpData?.Obj?.mobile);
        setValue("password", verifyOtpData?.Obj?.password);
        setValue("country", verifyOtpData?.Obj?.country);
        setValue("city", verifyOtpData?.Obj?.city);
        setValue("confirmPassword", verifyOtpData?.Obj?.password);
        // setValue("dob", verifyOtpData?.Obj?.dob);
        setPreview(verifyOtpData?.Obj?.logo);
      }
    }
  }, [verifyOtpData]);

  const onSubmit = async (body) => {
    const isValid = checkFields();
    // const isValidD = validateFunc();


    // const countryCodes = recordsTemp.find((item) => item?._id == selectedCountry);

    if (!isValid) return;
    let obj = {
      email: body.email,
      // mobile: body.mobile,
      // countryCode: countryCodes?.countryCode,
    };
    const payload = {
      name: body.name,
      email: body.email,
      password: body.password,
      // mobile: body.mobile,
      // dob: expiryFrom,
      countryID: cat,
      cityID: subCat,
      // countryCode: countryCodes?.countryCode,
      // mobileOTP: body.mobileOTP,
      emailOTP: body.emailOTP,
      deviceId: localStorage.getItem("fcm"),
      deviceType: "web",
      deviceToken: localStorage.getItem("fcm"),
    };
    const { status, data } = await apiPost(apiPath.sendOTP, obj);
    if (status === 200) {
      if (data.success) {
        console.log('dataaaaa', data)
        if (body.resend) return;
        setBodyData(payload);
        notification.success(data?.message);
        setOpenVerify(true);
      } else {
        notification.error(data?.message);
      }
    } else {
      notification.error(data?.message);
    }
  };

  const getCountryList = async () => {
    try {
      const res = await apiGet(apiPath.getCountryList, {});
      setRecordTemp(res?.data?.results?.country);
      setListTemp(res?.data?.results?.city);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    getCountryList();
  }, []);

  useEffect(() => {
    if (!isEmpty(watch("confirmPassword"))) {
      if (watch("password")) {
        trigger("confirmPassword");
      }
    }
  }, [watch("password")]);

  return (
    <>
      <Header />

      <div className="auth_body" style={{ background: "#FBFBFE" }}>
        <section className="page_title_bar"></section>

        <section className="auth_section">
          <Container>
            <div className="auth_section_row">
              <div className="auth_left register_page_left">
                <div className="auth_head">
                  <div>
                    <h3>Sign up</h3>
                    <p>Simply get registered by filling the form. </p>
                  </div>
                  <Link to="/signIn" href="/signIn" className="fw-600">
                    Sign In
                    <Image src="/images/Vector.png" width={17} height={12} />
                  </Link>
                </div>

                <Form
                  onSubmit={handleSubmit(onSubmit, () => {
                    const isValid = checkFields();
                    // const isValidD = validateFunc();
                    if (!isValid) return;
                  })}
                >
                  <Row>
                    <Col md={6}>
                      <div className="theme-form-group">
                        <figure className="form_icon">
                          <Image src="/images/user.svg" width={17} height={20} alt="" />
                        </figure>
                        <FloatingLabel
                          controlId="floatingInput"
                          label={
                            <p>
                              Full name
                              <RedStar />
                            </p>
                          }
                          className=""
                        >
                          <Form.Control
                            type="text"
                            placeholder="Full name"
                            maxLength={100}
                            onInput={(e) => preventMaxInput(e, 100)}
                            {...register("name", {
                              required: {
                                value: true,
                                message: "Please enter full name.",
                              },
                              minLength: {
                                value: 2,
                                message: "Minimum length must be 2.",
                              },
                              pattern: {
                                value: validationRules.characters,
                                message: validationRules.charactersMessage,
                              },
                            })}
                          />
                          <ErrorMessage message={errors?.name?.message} />
                        </FloatingLabel>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="theme-form-group">
                        <figure className="form_icon">
                          <Image src="/images/email.svg" width={20} height={17} alt="" />
                        </figure>
                        <FloatingLabel
                          controlId="floatingInput"
                          label={
                            <p>
                              Email address <RedStar />
                            </p>
                          }
                          className=""
                        >
                          <Form.Control
                            type="text"
                            placeholder="Email address"
                            onInput={(e) => preventMaxInput(e)}
                            {...register("email", {
                              required: "Please enter email address.",
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address.",
                              },
                            })}
                          />
                          <ErrorMessage message={errors?.email?.message} />
                        </FloatingLabel>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="theme-form-group">
                        <figure className="form_icon">
                          <Image src="/images/network.svg" width={20} height={20} alt="" />
                        </figure>
                        <FloatingLabel
                          controlId="floatingInput"
                          label={
                            <p>
                              Country <RedStar />
                            </p>
                          }
                          className=""
                        >
                          <Form.Select
                            className="floating_select_left_space"
                            aria-label="Floating label select example"
                            value={cat}
                            onChange={(e) => {
                              setCat(e.target.value);
                              setSelectedCountry(e.target.value);
                              if (e.target.value === "") setSubCat("");
                              if (e.target.value) {
                                setIsCatError(false);
                              }
                            }}
                          >
                            <option value="">Select country</option>
                            {recordsTemp?.map((i, key) => (
                              <option key={key} value={i._id}>
                                {i.name}
                              </option>
                            ))}
                          </Form.Select>
                          {Helpers.andCondition(isCatError, <ErrorMessage message="Please select country." />)}
                        </FloatingLabel>
                      </div>
                    </Col>
                    
                    <Col md={6}>
                      <div className="theme-form-group">
                        <figure className="form_icon">
                          <Image src="/images/city.svg" width={20} height={17} alt="" />
                        </figure>
                        <FloatingLabel
                          controlId="floatingInput"
                          label={
                            <p>
                              City <RedStar />
                            </p>
                          }
                          className=""
                        >
                          <Form.Select
                            className="floating_select_left_space"
                            aria-label="Floating label select example"
                            value={subCat}
                            onChange={(e) => {
                              setSubCat(e.target.value);
                              if (e.target.value === "") {
                                setIsSubCatError(true);
                              } else {
                                setIsSubCatError(false);
                              }
                            }}
                          >
                            <option value="">Select city</option>
                            {listTemp?.map(
                              (i, key) =>
                                i?.countryID == cat && (
                                  <option key={key} value={i?._id}>
                                    {i?.name}
                                  </option>
                                )
                            )}
                          </Form.Select>
                          {Helpers.andCondition(isSubCatError, <ErrorMessage message="Please select city." />)}
                        </FloatingLabel>
                      </div>
                    </Col>
                    {/* <Col md={6}>
                      <div className='theme-form-group position-relative'>
                        <figure className='form_icon'>
                          <Image
                            src='/images/dob.svg'
                            width={20}
                            height={17}
                            alt=''
                          />
                        </figure>
                        <div className='w-100'>
                          <ODatePicker
                            handleDateChange={handleDateChange}
                            placeholder='dd/mm/yyyy'
                            addFlex={false}
                            errors={dateErrors}
                          />
                        </div>
                      </div>
                    </Col> */}

                    <Col md={6}>
                      <div className="theme-form-group">
                        <figure className="form_icon">
                          <Image src="/images/lock.svg" width={20} height={17} alt="" />
                        </figure>
                        <div className="w-100">
                          <FloatingLabel
                            controlId="floatingInput"
                            label={
                              <p>
                                Password <RedStar />
                              </p>
                            }
                            className=""
                          >
                            <Form.Control
                              type={Helpers.ternaryCondition(!showPassword, "password", "text")}
                              placeholder="Password"
                              maxLength={16}
                              minLength={8}
                              onInput={(e) => preventMaxInput(e)}
                              {...register("password", {
                                required: "Please enter password.",
                                pattern: {
                                  value: validationRules.password,
                                  message: "Password must contain lowercase,uppercase characters, numbers, special character and must be 8 character long.",
                                },
                                maxLength: {
                                  value: 16,
                                  message: "Maximum length must be 16.",
                                },
                              })}
                            />
                            {Helpers.ternaryCondition(
                              showPassword,
                              <span className="input_grp" onClick={() => changeIcon2()}>
                                {" "}
                                <Image src="/images/hide.png" width={24} height={24} alt="" />
                              </span>,
                              <span className="input_grp" onClick={() => changeIcon2()}>
                                {" "}
                                <Image src="/images/eye.svg" width={24} height={24} alt="" />
                              </span>
                            )}
                          </FloatingLabel>
                          <ErrorMessage message={errors?.password?.message} />
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="theme-form-group">
                        <figure className="form_icon">
                          <Image src="/images/lock.svg" width={20} height={17} alt="" />
                        </figure>
                        <div className="w-100">
                          <FloatingLabel
                            controlId="floatingInput"
                            label={
                              <p>
                                Confirm Password <RedStar />
                              </p>
                            }
                            className=""
                          >
                            <Form.Control
                              placeholder="Confirm Password"
                              maxLength={16}
                              minLength={8}
                              onInput={(e) => preventMaxInput(e)}
                              type={Helpers.ternaryCondition(!conPassToggle, "password", "text")}
                              {...register("confirmPassword", {
                                required: {
                                  value: true,
                                  message: "Please enter confirm password.",
                                },
                                validate: (value) => {
                                  if (!isEmpty(watch("password"))) {
                                    if (value !== watch("password")) {
                                      return "Password and confirm password does not match.";
                                    }
                                  }
                                },
                                maxLength: {
                                  value: 16,
                                  message: "Maximum length must be 16.",
                                },
                              })}
                              onChange={(e) => {
                                setValue("confirmPassword", e.target.value, {
                                  shouldValidate: true,
                                });
                              }}
                            />
                            {Helpers.ternaryCondition(
                              conPassToggle,
                              <span className="input_grp" onClick={() => changeIcon()}>
                                {" "}
                                <Image src="/images/hide.png" width={24} height={24} alt="" />
                              </span>,
                              <span className="input_grp" onClick={() => changeIcon()}>
                                {" "}
                                <Image src="/images/eye.svg" width={24} height={24} alt="" />
                              </span>
                            )}
                          </FloatingLabel>
                          <ErrorMessage message={errors?.confirmPassword?.message} />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="agree_text d-flex align-items-center justify-content-between">
                    <label className="d-flex align-items-start fw-600 text-black">
                      <Form.Check
                        type="checkbox"
                        className="fw-bold text-black me-2"
                        {...register("terms", {
                          required: "Please select terms & conditions and privacy policy.",
                        })}
                      />
                      <span>
                        I agree to Empivo&apos;s{" "}
                        <a target="_blank" href={"/TermsCondition"} className="link text-decoration-none mx-1">
                          Terms & Conditions
                        </a>{" "}
                        and
                        <a target="_blank" href={"/privacyPolicy"} className="link text-decoration-none ms-1">
                          Privacy Policy.
                        </a>
                      </span>
                    </label>
                  </div>
                  <ErrorMessage message={errors?.terms?.message} />

                  <Button type="submit" className="theme_blue_btn mt-4">
                    Sign up
                  </Button>
                </Form>
              </div>

              <div className="auth_right">
                <figure>
                  <Image src="/images/register.png" width={448} height={407} alt="" />
                </figure>
              </div>
            </div>

            <AuthFooter />
          </Container>
        </section>
        {Helpers.andCondition(openVerify, <OTPVerify open={openVerify} bodyData={bodyData} sendOTP={onSubmit} onHide={() => setOpenVerify(false)} />)}
      </div>
    </>
  );
}

export default SignUp;
