import { useContext, useState, useEffect, useRef } from "react";
import { Container, Breadcrumb, Row, Col, Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import ProfileSidebar from "./components/ProfileSidebar";
import Image from "next/image";
import AuthContext from "@/context/AuthContext";
import ErrorMessage from "./components/ErrorMessage";
import dayjs from "dayjs";
import { apiPost, apiPut, apiGet } from "@/utils/apiFetch";
import apiPath from "@/utils/pathObj";
import useToastContext from "@/hooks/useToastContext";
import { handleKeyDown, preventMaxInput, validationRules } from "@/utils/constants";
import { useForm } from "react-hook-form";
import { isEmpty, pick } from "lodash";
import jwt_decode from "jwt-decode";
import CropperModal from "./components/CropperModal";
import { BiMenuAltRight } from "react-icons/bi";
import Helpers from "@/utils/helpers";
import RedStar from "./components/common/RedStar";
import userImage from "../images/user.png";

const Profile = () => {
  const notification = useToastContext();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    unregister,
    reset,
    formState: { errors },
  } = useForm();
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: errorsProfile },
  } = useForm();
  const [show, setShow] = useState(false);
  const [showData, setShowData] = useState(false);
  const { user, setUser, logoutUser, applyJobApi, applyJobsData } = useContext(AuthContext);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShowData = () => setShowData(true);
  const handleCloseData = () => setShowData(false);
  const [src, setSrc] = useState(null);
  const [userData] = useState([]);
  const [preview, setPreview] = useState(userData?.profilePic);
  const [modalOpen, setModalOpen] = useState(false);
  const imageRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageData, setImageData] = useState("");
  const [oldPassToggle, setOldPassToggle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [conPassToggle, setConPassToggle] = useState(false);

  const [cat, setCat] = useState(user?.countryID);
  const [subCat, setSubCat] = useState(user?.cityID);
  const [recordsTemp, setRecordTemp] = useState([]);
  const [listTemp, setListTemp] = useState([]);
  const [isCatError, setIsCatError] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [isSubCatError, setIsSubCatError] = useState(false);

  useEffect(() => {
    resetProfile({
      mobile: user?.mobile,
      countryID: user?.countryID,
      cityID: user?.cityID,
      countryCode: user?.countryCode,
    });
    setCat(user?.countryID);
    setSubCat(user?.cityID);
    setSelectedCountry(user?.countryID);
  }, [user]);
  console.log("user", cat, user?.countryID);

  useEffect(() => {
    applyJobApi();
  }, []);

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

  const onSubmitProfile = async (body) => {
    const isValid = checkFields();
    const countryCodes = recordsTemp.find((item) => item?.countryCode);

    if (!isValid) return;
    const payload = {
      mobile: body?.mobile,
      countryID: cat,
      cityID: subCat,
      countryCode: countryCodes?.countryCode,
    };
    const { status, data } = await apiPut(apiPath.uploadProfile, payload);
    if (status === 200) {
      function successCallback() {
        resetProfile();
        notification.success(data?.message);
        localStorage.setItem("token", data?.results?.token);
        localStorage.setItem("refresh_token", data?.results?.refresh_token);
        setUser(jwt_decode(data?.results?.token));
        setShowData(false);
      }
      function errorCallback() {
        notification.error(data?.message);
      }
      Helpers.handleResult(data.success, successCallback, errorCallback);
    } else {
      notification.error(data?.message);
    }
  };

  const onSubmit = async (body) => {
    const { status, data } = await apiPost(apiPath.changePassword, pick(body, ["oldPassword", "newPassword", "confirmPassword"]));
    if (status === 200) {
      function successCallback() {
        reset();
        notification.success(data?.message);
        setShow(false);
        logoutUser();
      }
      function errorCallback() {
        notification.error(data?.message);
      }
      Helpers.handleResult(data.success, successCallback, errorCallback);
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

  const handleImageUpload = async (body) => {
    const formData = new FormData();
    if (preview) {
      let response = await fetch(preview);
      let dataImage = await response.blob();
      let metadata = {
        type: "image/jpeg",
      };
      let file = new File([dataImage], "test.jpg", metadata);
      formData.append("profilePic", file);
    } else if (imageData !== "") {
      formData.append("profilePic", imageData);
    }
    const { status, data } = await apiPut(apiPath.uploadImage, formData);
    if (status === 200) {
      function successCallback() {
        reset();
        notification.success(data?.message);
        localStorage.setItem("token", data?.results?.token);
        localStorage.setItem("refresh_token", data?.results?.refresh_token);
        setUser(jwt_decode(data?.results?.token));
      }
      function errorCallback() {
        notification.error(data?.message);
      }
      Helpers.handleResult(data.success, successCallback, errorCallback);
    } else {
      notification.error(data?.message);
    }
  };

  const handleInputClick = (e) => {
    e.preventDefault();
    imageRef.current.click();
  };

  const handleFileUpload = async (e) => {
    const getType = e.target.files[0].type.split("/");
    const fileSize = (e.target.files[0]?.size / (1024 * 1024)).toFixed(2);
    if (fileSize > 2) {
      notification.error("Please select image below 2Mb.");
      return false;
    }
    if (getType[1] !== undefined && (getType[1] === "jpeg" || getType[1] === "png" || getType[1] === "jpg" || getType[1] === "gif")) {
      unregister("image");
      setModalOpen(true);
      setSrc(URL.createObjectURL(e.target.files[0]));
      setImageData(e.target.files[0]);
      setPreview(window.URL.createObjectURL(e.target.files[0]));
    } else {
      notification.error("Only jpeg,png,jpg,gif formats are allowed");
    }
  };

  useEffect(() => {
    if (!isEmpty(user)) {
      if (user?.profilePic !== "https://octal-dev.s3.ap-south-1.amazonaws.com/no_image.png") {
        setImageUrl(user?.profilePic);
      } else {
        setImageUrl(userImage?.src);
      }
    }
  }, [user]);

  const openProfileSidebar = () => {
    if (document.body) {
      let element = document.body;
      const classesToToggle = "remover-sidebar";
      element.classList.toggle(classesToToggle);
    }
  };

  useEffect(() => {
    if (!isEmpty(watch("confirmPassword"))) {
      if (watch("newPassword")) {
        trigger("confirmPassword");
      }
    }
  }, [watch("newPassword")]);

  return (
    <>
      <section className="profile_main_wrap bg-light">
        <Container>
          <div className="account_row">
            <ProfileSidebar />

            <div className="account_content_right">
              <button className={`open_sidebar_mobile`} onClick={openProfileSidebar}>
                <BiMenuAltRight />
              </button>
              <Breadcrumb className="">
                <Breadcrumb.Item href="#">
                  <Image src="/images/home.svg" width={15} height={14} alt="" />
                </Breadcrumb.Item>
                <Breadcrumb.Item active>My Account</Breadcrumb.Item>
              </Breadcrumb>

              <div className="personal_detail pt-2 pt-sm-4">
                <h3 className="account_title">Personal Details</h3>

                <div className="change_profile_main">
                  <div className="change_profile_pic">
                    <figure>
                      <Image src={Helpers.orCondition(imageUrl, preview)} width={132} height={132} alt="image" />
                    </figure>
                    <div className="upload_wrap">
                      <a
                        href="#"
                        onClick={handleInputClick}
                        {...register("image", {
                          required: Helpers.ternaryCondition(imageUrl, false, true),
                        })}
                        className="position-relative camera green-bg"
                      >
                        <img src="/images/change_profile.png" alt="image" />
                      </a>
                      <input type="file" style={{ display: "none" }} accept="image/png, image/jpeg, image/jpg" ref={imageRef} className="position-absolute" onChange={(e) => handleFileUpload(e)} />
                    </div>
                    <CropperModal modalOpen={modalOpen} src={src} setPreview={setPreview} setModalOpen={setModalOpen} handleImageUpload={handleImageUpload} />
                  </div>
                  <span>Upload Profile Image (Only image, upto 2Mb)</span>
                </div>
                <div className="user_detail">
                  <Row>
                    {applyJobsData?.map((item) => {
                      if (item?.formStatus == "accepted") {
                        return (
                          <>
                            <Col sm={6}>
                              <div className="profile_detail_col">
                                <figure>
                                  <Image src="/images/user.svg" width={17} height={20} alt="" />{" "}
                                </figure>
                                <div className="info_text">
                                  <span className="d-block">Employee ID </span>
                                  <span className="text-dark d-block">{item?.Employee?.employeeId}</span>
                                </div>
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="profile_detail_col">
                                <figure>
                                  <Image src="/images/user.svg" width={17} height={20} alt="" />{" "}
                                </figure>
                                <div className="info_text">
                                  <span className="d-block">Duration Type </span>
                                  <span className="text-dark d-block">{item?.duration}</span>
                                </div>
                              </div>
                            </Col>
                          </>
                        );
                      }
                    })}

                    <Col sm={6}>
                      <div className="profile_detail_col">
                        <figure>
                          <Image src="/images/user.svg" width={17} height={20} alt="" />{" "}
                        </figure>
                        <div className="info_text">
                          <span className="d-block">Employee Name </span>
                          <span className="text-dark d-block">{user?.name}</span>
                        </div>
                      </div>
                    </Col>

                    <Col sm={6}>
                      <div className="profile_detail_col">
                        <figure>
                          <Image src="/images/email.svg" width={20} height={17} alt="" />{" "}
                        </figure>
                        <div className="info_text">
                          <span className="d-block">Email ID </span>
                          <span className="text-dark d-block text-break">{user?.email}</span>
                        </div>
                      </div>
                    </Col>

                    {/* <Col sm={6}>
                      <div className="profile_detail_col">
                        <figure>
                          <Image src="/images/mobile.svg" width={16} height={20} alt="" />{" "}
                        </figure>
                        <div className="info_text">
                          <span className="d-block">Mobile Number </span>
                          <span className="text-dark d-block">{user?.mobile}</span>
                        </div>
                      </div>
                    </Col> */}

                    <Col sm={6}>
                      <div className="profile_detail_col">
                        <figure>
                          <Image src="/images/network.svg" width={20} height={20} alt="" />{" "}
                        </figure>
                        <div className="info_text">
                          <span className="d-block">Country </span>
                          <span className="text-dark d-block">{user?.countryName}</span>
                        </div>
                      </div>
                    </Col>

                    <Col sm={6}>
                      <div className="profile_detail_col">
                        <figure>
                          <Image src="/images/city.svg" width={20} height={17} alt="" />{" "}
                        </figure>
                        <div className="info_text">
                          <span className="d-block">City </span>
                          <span className="text-dark d-block">{user?.cityName}</span>
                        </div>
                      </div>
                    </Col>

                    {/* <Col sm={6}>
                      <div className="profile_detail_col">
                        <figure>
                          <Image src="/images/dob.svg" width={20} height={17} alt="" />{" "}
                        </figure>
                        <div className="info_text">
                          <span className="d-block">DOB</span>
                          <span className="text-dark d-block">{dayjs(user?.dob).format("MM-DD-YYYY")} </span>
                        </div>
                      </div>
                    </Col> */}
                  </Row>

                  <Button className="theme_blue_btn btn btn-primary me-3" onClick={handleShow}>
                    Change Password{" "}
                  </Button>
                  <Button className="theme_blue_btn btn btn-primary me-3" onClick={handleShowData}>
                    Edit{" "}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* change_password_modal */}

      <Modal show={show} onHide={handleClose} className="theme_modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="change_password modal_body_spacing" onSubmit={handleSubmit(onSubmit)}>
            <div className="theme-form-group">
              <figure className="form_icon">
                <Image src="/images/lock.svg" width={20} height={17} alt="" />
              </figure>
              <div className="w-100">
                <FloatingLabel controlId="floatingInput" label="Old Password" className="">
                  <Form.Control
                    type={Helpers.ternaryCondition(!oldPassToggle, "password", "text")}
                    placeholder="Enter old password"
                    maxLength={16}
                    minLength={8}
                    onInput={(e) => preventMaxInput(e)}
                    {...register("oldPassword", {
                      required: "Please enter old password.",
                      validate: (value) => {
                        return value === "" || !!value.trim();
                      },
                      pattern: {
                        value: validationRules.password,
                        message: "Old password must contain lowercase,uppercase characters, numbers, special character and must be 8 character long.",
                      },
                    })}
                  />
                  {Helpers.ternaryCondition(
                    oldPassToggle,
                    <span className="input_grp" onClick={() => setOldPassToggle(!oldPassToggle)}>
                      {" "}
                      <Image src="/images/hide.png" width={24} height={24} alt="" />
                    </span>,
                    <span className="input_grp" onClick={() => setOldPassToggle(!oldPassToggle)}>
                      {" "}
                      <Image src="/images/eye.svg" width={24} height={24} alt="" />
                    </span>
                  )}
                </FloatingLabel>
                <ErrorMessage message={errors?.oldPassword?.message} />
              </div>
            </div>

            <div className="theme-form-group">
              <figure className="form_icon">
                <Image src="/images/lock.svg" width={20} height={17} alt="" />
              </figure>
              <div className="w-100">
                <FloatingLabel controlId="floatingInput" label="New Password" className="">
                  <Form.Control
                    type={Helpers.ternaryCondition(!showPassword, "password", "text")}
                    maxLength={16}
                    minLength={8}
                    placeholder="Enter new password"
                    onInput={(e) => preventMaxInput(e)}
                    {...register("newPassword", {
                      required: "Please enter new password.",
                      validate: (value) => {
                        if (value === "") {
                          return true;
                        }
                        if (!!value.trim()) {
                          return true;
                        }
                      },
                      pattern: {
                        value: validationRules.password,
                        message: "New password must contain lowercase,uppercase characters, numbers, special character and must be 8 character long.",
                      },
                    })}
                  />
                  {Helpers.ternaryCondition(
                    showPassword,
                    <span className="input_grp" onClick={() => setShowPassword(!showPassword)}>
                      {" "}
                      <Image src="/images/hide.png" width={24} height={24} alt="" />
                    </span>,
                    <span className="input_grp" onClick={() => setShowPassword(!showPassword)}>
                      {" "}
                      <Image src="/images/eye.svg" width={24} height={24} alt="" />
                    </span>
                  )}
                </FloatingLabel>
                <ErrorMessage message={errors?.newPassword?.message} />
              </div>
            </div>

            <div className="theme-form-group">
              <figure className="form_icon">
                <Image src="/images/lock.svg" width={20} height={17} alt="" />
              </figure>
              <div className="w-100">
                <FloatingLabel controlId="floatingInput" label="Confirm New Password" className="">
                  <Form.Control
                    placeholder="Enter confirm password"
                    onInput={(e) => preventMaxInput(e)}
                    maxLength={16}
                    minLength={8}
                    type={Helpers.ternaryCondition(!conPassToggle, "password", "text")}
                    {...register("confirmPassword", {
                      required: {
                        value: true,
                        message: "Please enter confirm password.",
                      },
                      validate: (value) => {
                        if (!isEmpty(watch("newPassword"))) {
                          if (value !== watch("newPassword")) {
                            return "Password and confirm password does not match.";
                          }
                        }
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
                    <span className="input_grp" onClick={() => setConPassToggle(!conPassToggle)}>
                      {" "}
                      <Image src="/images/hide.png" width={24} height={24} alt="" />
                    </span>,
                    <span className="input_grp" onClick={() => setConPassToggle(!conPassToggle)}>
                      {" "}
                      <Image src="/images/eye.svg" width={24} height={24} alt="" />
                    </span>
                  )}
                </FloatingLabel>
                <ErrorMessage message={errors?.confirmPassword?.message} />
              </div>
            </div>

            <Button className="theme_md_blue_btn btn btn-primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showData} onHide={handleCloseData} className="theme_modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            className="change_password modal_body_spacing"
            onSubmit={handleSubmitProfile(onSubmitProfile, () => {
              const isValid = checkFields();
              console.log("abcs", isValid);
              if (!isValid) return;
            })}
          >
            <div className="theme-form-group">
              <figure className="form_icon">
                <Image src="/images/network.svg" width={20} height={17} alt="" />
              </figure>
              <div className="w-100">
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
                      setSubCat("");
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
            </div>

            {/* <div className="theme-form-group">
              <figure className="form_icon">
                <Image src="/images/mobile.svg" width={20} height={17} alt="" />
              </figure>
              <div className="w-100 d-flex align-items-center">
                {recordsTemp?.length > 0 &&
                  recordsTemp?.map((item) => {
                    if (selectedCountry === item?._id) {
                      return (
                        <>
                          <span className="countryCode me-3 bg-transparent border-0 d-flex align-items-center">
                            {" "}
                            <Image src="/images/mobile.svg" width={20} height={17} alt="" className="me-2" />
                            {item?.countryCode}
                          </span>
                        </>
                      );
                    }
                  })}

                <FloatingLabel
                  controlId="floatingInput"
                  label={
                    <p>
                      Mobile number <RedStar />
                    </p>
                  }
                  className=""
                >
                  <Form.Control
                    type="text"
                    placeholder="Mobile number"
                    maxLength={15}
                    onKeyDown={(event) => handleKeyDown(event)}
                    {...registerProfile("mobile", {
                      required: "Please enter mobile number.",
                      minLength: {
                        value: 8,
                        message: "Minimum length should be 8 digits.",
                      },
                      maxLength: {
                        value: 15,
                        message: "Maximum length should be 15 digits.",
                      },
                      pattern: {
                        value: /^(?:[1-9]\d*|0)$/,
                        message: "First character can not be 0.",
                      },
                    })}
                  />
                  <ErrorMessage message={errorsProfile?.mobile?.message} />
                </FloatingLabel>
              </div>
            </div> */}

            <div className="theme-form-group">
              <figure className="form_icon">
                <Image src="/images/city.svg" width={20} height={17} alt="" />
              </figure>
              <div className="w-100">
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
            </div>

            <Button className="theme_md_blue_btn btn btn-primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Profile;
