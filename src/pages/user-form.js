import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, FloatingLabel } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import ErrorMessage from "./components/ErrorMessage";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import apiPath from "@/utils/pathObj";
import { apiPost, apiGet } from "@/utils/apiFetch";
import AuthContext from "@/context/AuthContext";
import OImage from "./components/reusable/OImage";
import { isEmpty } from "lodash";
import VerifyEmail from "./components/VerifyEmail";
import noImageFound from "../../src/images/No-image-found.jpg";
import RedStar from "./components/common/RedStar";
import Helpers from "@/utils/helpers";

const UserForm = () => {
  const router = useRouter();
  const notification = useToastContext();
  const { companyDetails, setCompanyDetails, setSubscriptionDetails, initialData } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openVerify, setOpenVerify] = useState(false);
  const [data, setData] = useState(companyDetails);
  const [allCityList, setAllCityList] = useState([]);
  const [passportPic, setPassportPic] = useState("");
  const [logoPic, setLogoPic] = useState("");

  const [error, setError] = useState({});

  const formValidation = () => {
    let errorObj = {
      name: "",
      officialEmail: "",
      companyNumber: "",
      address: "",
      selectedCity: "",
      selected: "",
      profilePicture: "",
      logo: "",
    };
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const regexName = /^[a-zA-Z_ ]*$/;
    if (!data?.name) {
      errorObj.name = "Please enter company name.";
    } else if (data?.name?.trim().length < 2 || data?.name?.trim().length > 200) {
      errorObj.name = "minimum length must be 2.";
    } else if (!regexName.test(data?.name)) {
      errorObj.name = "Only alphabets are allowed.";
    }
    if (!data?.officialEmail) {
      errorObj.officialEmail = "Please enter company email ID.";
    } else if (!regex.test(data?.officialEmail)) {
      errorObj.officialEmail = "Please enter valid email ID as: example@domain.com.";
    }
    if (!data?.companyNumber) {
      errorObj.companyNumber = "Please enter company number.";
    } else if (data?.companyNumber?.trim().length < 2 || data?.companyNumber?.trim().length > 20) {
      errorObj.companyNumber = "minimum length must be 2.";
    }
    if (!data?.address) {
      errorObj.address = "Please enter address.";
    } else if (data?.address?.trim().length < 10 || data?.address?.trim().length > 200) {
      errorObj.address = "minimum length must be 10.";
    }
    if (!data?.selected) {
      errorObj.selected = "Please select country.";
    }
    if (!data?.selectedCity) {
      errorObj.selectedCity = "Please select city.";
    }
    if (!data?.profilePicture) {
      errorObj.profilePicture = "Please upload profile picture.";
    }
    if (!data?.logo) {
      errorObj.logo = "Please upload company logo.";
    }
    if (errorObj.name || errorObj.officialEmail || errorObj.companyNumber || errorObj.address || errorObj.selected || errorObj.selectedCity || errorObj.profilePicture || errorObj.logo) {
      setError(errorObj);
      return false;
    } else {
      return true;
    }
  };

  const handleChange = (e) => {
    let cDetail = { ...data };
    if (data?.is_email_verified == 1 && e.target.name == "officialEmail") {
      cDetail.is_email_verified = 0;
    }
    setData({ ...cDetail, [e.target.name]: e.target.value });
    if (e.target.value !== "") {
      setError({
        ...error,
        [e.target.name]: false,
      });
    }
  };

  const onSubmit = async (body) => {
    try {
      const obj = {
        email: body?.email,
      };
      const { status, data: item } = await apiPost(apiPath.companyExist, {
        ...obj,
      });
      if (status == 200) {
        if (item.success) {
          let objData = {
            name: item?.results?.company?.name,
            officialEmail: item?.results?.company?.officialEmail,
            companyNumber: item?.results?.company?.companyNumber,
            address: item?.results?.company?.address,
            logo: item?.results?.company?.logo,
            profilePicture: item?.results?.company?.profilePicture,
            selected: item?.results?.company?.Country,
            selectedCity: item?.results?.company?.City,
            options: data.options,
            is_email_verified: 1,
            optionsCity: allCityList
              .filter((x) => x?.countryID.toString() == item?.results?.company?.Country?._id.toString())
              ?.map((items) => {
                return { _id: items?._id, name: items?.name };
              }),
          };
          setData(objData);
          if (typeof window !== "undefined") localStorage.setItem("subscription", JSON.stringify(item?.results?.activeSubscription));
          setSubscriptionDetails(item?.results?.activeSubscription);
          setCompanyDetails(objData);
          if (typeof window !== "undefined") localStorage.setItem("company", JSON.stringify(objData));
          notification.success(item?.message);
          router.push("/new-user");
        } else {
          setData({
            ...initialData,
            // options: data.options,
            // optionsCity: data.optionsCity,
            is_email_verified: 0,
          });
          notification.error(item.message);
        }
      }
    } catch (errorData) {
      notification.error(errorData?.message);
    }
  };

  const validateFiles = (passportPics) => {
    let picError = "";
    const supportedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!isEmpty(supportedTypes.includes(passportPics.type))) {
      picError = "Only jpeg, jpg and png are supported.";
    }

    if (picError) {
      return false;
    } else {
      return true;
    }
  };

  const validateFilesLogo = (logoPics) => {
    let picError = "";
    const supportedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!isEmpty(supportedTypes.includes(logoPics.type))) {
      picError = "Only jpeg, jpg and png are supported.";
    }

    if (picError) {
      return false;
    } else {
      return true;
    }
  };

  const handleFileChangeLogo = async (e) => {
    const fr = new FileReader();
    fr.readAsDataURL(e.target.files[0]);
    fr.addEventListener("load", () => {
      const bannerImage = e?.target?.files[0];
      const fileSize = (e.target.files[0]?.size / (1024 * 1024)).toFixed(2);
      const isValidImage = validateFiles(bannerImage);
      if (e.target.value !== "") {
        setError({
          ...error,
          [e.target.name]: false,
        });
      }
      if (isValidImage) {
        if (fileSize > 2) {
          notification.error("Please select image below 2Mb.");
          return false;
        }
        setPassportPic(bannerImage);
        setData({
          ...data,
          isBlog: true,
          profilePicture: fr.result,
        });
      } else {
        setPassportPic(null);
      }
    });
  };

  const handleFileChangeLogoImage = async (e) => {
    const fr = new FileReader();
    fr.readAsDataURL(e.target.files[0]);
    fr.addEventListener("load", () => {
      const logoImage = e?.target?.files[0];
      const fileSize = (e.target.files[0]?.size / (1024 * 1024)).toFixed(2);
      const isValidImage = validateFilesLogo(logoImage);
      if (e.target.value !== "") {
        setError({
          ...error,
          [e.target.name]: false,
        });
      }
      if (isValidImage) {
        if (fileSize > 2) {
          notification.error("Please select image below 2Mb.");
          return false;
        }
        setLogoPic(logoImage);
        setData({ ...data, isBlog: true, logo: fr.result });
      } else {
        setLogoPic(null);
      }
    });
  };

  const getCountryList = async () => {
    try {
      const res = await apiGet(apiPath.getCountryList, {});
      setAllCityList(res?.data?.results?.city);
      let cDetail = {};
      if (typeof window !== "undefined") cDetail = JSON.parse(localStorage.getItem("company"));
      setData({
        ...cDetail,
        options: res?.data?.results?.country.map((item) => {
          return { _id: item?._id, name: item?.name };
        }),
      });
    } catch (errorCountry) {
      console.log("error:", errorCountry);
    }
  };

  const handleOTP = async () => {
    try {
      let payload = {
        email: data.officialEmail,
      };
      const res = await apiPost(apiPath.verifyOTP, payload);
      if (res.data.success === true) {
        notification.success(res.data.message);
        setOpenVerify(true);
        setSubscriptionDetails({});
      } else {
        notification.error(res?.data?.message);
      }
    } catch (errorOTP) {
      console.log("error:", errorOTP);
    }
  };
  useEffect(() => {
    getCountryList();
    if (typeof data?.profilePicture == "object") {
      setPassportPic(data?.profilePicture);
    }
    if (typeof data?.logo == "object") {
      setLogoPic(data?.logo);
    }
  }, []);

  const handelSubmitForm = () => {
    if (data?.is_email_verified == 1) {
      router.push("/new-user");
      setCompanyDetails(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("company", JSON.stringify(data));
      }
    } else {
      const isValid = formValidation();
      if (isValid) {
        handleOTP();
        setCompanyDetails(data);
        if (typeof window !== "undefined") {
          localStorage.setItem("company", JSON.stringify(data));
        }
      }
    }
  };

  const imageSrc = logoPic ? URL.createObjectURL(logoPic) : data?.logo;

  return (
    <section className="profile_main_wrap bg-light">
      <Container>
        <div className="fullpage_wrapper bg-white rounded_5">
          <div className="simple_text_article">
            <h5>Existing User</h5>
            <p>Please verify your email addresss.</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="user_form_main">
              <Row>
                <Col lg={4} md={6}>
                  <div className="theme-form-group">
                    <figure className="form_icon">
                      <Image src="/images/email.svg" width={17} height={20} alt="" />
                    </figure>
                    <FloatingLabel controlId="floatingInput" label="Registered Email ID">
                      <Form.Control
                        type="text"
                        placeholder="Full name"
                        {...register("email", {
                          required: "Please enter email.",
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
                <Col lg={4} md={6} className="top_button_space">
                  <Button className="theme_md_blue_btn right_marge" type="submit">
                    Check
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
          <div className="simple_text_article py-3 py-sm-4 mt-3 mt-md-0">
            <h5>New User</h5>
            <p>Please fill the below details to proceed.</p>
          </div>
          <div className="user_form_main">
            <Row>
              <Col lg={4} md={6}>
                <div className="theme-form-group">
                  <figure className="form_icon">
                    <Image src="/images/company.svg" width={17} height={20} alt="" />
                  </figure>
                  <FloatingLabel
                    controlId="floatingInput"
                    label={
                      <p>
                        Company Name
                        <RedStar />
                      </p>
                    }
                    className="star_red"
                  >
                    <Form.Control type="text" placeholder="Company Name" value={data.name} name="name" maxLength={200} onChange={(e) => handleChange(e)} />
                    {error && (
                      <p style={{ color: "red" }} className="error_msg">
                        {error.name}
                      </p>
                    )}
                  </FloatingLabel>
                </div>
              </Col>

              <Col lg={4} md={6}>
                <div className="theme-form-group">
                  <figure className="form_icon">
                    <Image src="/images/email.svg" width={17} height={20} alt="" />
                  </figure>
                  <FloatingLabel
                    controlId="floatingInput"
                    label={
                      <p>
                        Company Email ID
                        <RedStar />
                      </p>
                    }
                    className=""
                  >
                    <Form.Control type="text" placeholder="Company Email ID" value={data.officialEmail} name="officialEmail" onChange={(e) => handleChange(e)} />

                    {error && <p style={{ color: "red" }}>{error.officialEmail}</p>}
                  </FloatingLabel>
                </div>
              </Col>

              <Col lg={4} md={6}>
                <div className="theme-form-group">
                  <figure className="form_icon">
                    <Image src="/images/network.svg" width={20} height={20} alt="" />
                  </figure>
                  <FloatingLabel
                    controlId="floatingInput"
                    label={
                      <p>
                        Country
                        <RedStar />
                      </p>
                    }
                    className=""
                  >
                    <Form.Select
                      className="floating_select_left_space"
                      aria-label="Floating label select example "
                      value={data.selected?._id}
                      name="selected"
                      onChange={(e) => {
                        setData({
                          ...data,
                          selected: data.options.find((i) => i._id.toString() == e.target.value),
                          optionsCity: allCityList
                            .filter((item) => item?.countryID.toString() == e.target.value)
                            ?.map((item) => {
                              return { _id: item?._id, name: item?.name };
                            }),
                        });
                        if (e.target.value !== "") {
                          setError({
                            ...error,
                            [e.target.name]: false,
                          });
                        }
                      }}
                    >
                      <option value="">Please select country</option>
                      {data?.options.map((value, index) => (
                        <option value={value._id} key={index}>
                          {value.name}
                        </option>
                      ))}
                    </Form.Select>
                    {error && <p style={{ color: "red" }}>{error.selected}</p>}
                  </FloatingLabel>
                </div>
              </Col>

              <Col lg={4} md={6}>
                <div className="theme-form-group">
                  <figure className="form_icon">
                    <Image src="/images/city.svg" width={20} height={17} alt="" />
                  </figure>
                  <FloatingLabel
                    controlId="floatingInput"
                    label={
                      <p>
                        City
                        <RedStar />
                      </p>
                    }
                    className=""
                  >
                    <Form.Select
                      className="floating_select_left_space"
                      aria-label="Floating label select example"
                      value={data.selectedCity?._id}
                      name="selectedCity"
                      onChange={(e) => {
                        setData({
                          ...data,
                          selectedCity: data?.optionsCity.find((i) => i._id.toString() == e.target.value),
                        });
                        if (e.target.value !== "") {
                          setError({
                            ...error,
                            [e.target.name]: false,
                          });
                        }
                      }}
                    >
                      <option value="">Please select city</option>
                      {data?.optionsCity?.map((values, index) => (
                        <option value={values._id} key={index}>
                          {values.name}
                        </option>
                      ))}
                    </Form.Select>
                    {error && <p style={{ color: "red" }}>{error.selectedCity}</p>}
                  </FloatingLabel>
                </div>
              </Col>

              <Col lg={4} md={6}>
                <div className="theme-form-group">
                  <figure className="form_icon">
                    <Image src="/images/company_number.svg" width={17} height={20} alt="" />
                  </figure>
                  <FloatingLabel
                    controlId="floatingInput"
                    label={
                      <p>
                        Company Number
                        <RedStar />
                      </p>
                    }
                    className=""
                  >
                    <Form.Control type="text" placeholder="Company Number" value={data.companyNumber} name="companyNumber" maxLength={20} onChange={(e) => handleChange(e)} />
                    {error && <p style={{ color: "red" }}>{error.companyNumber}</p>}
                  </FloatingLabel>
                </div>
              </Col>
              <Col lg={4} md={6}>
                <div className="theme-form-group">
                  <figure className="form_icon">
                    <Image src="/images/locationdark.svg" width={17} height={20} alt="" />
                  </figure>
                  <FloatingLabel
                    controlId="floatingInput"
                    label={
                      <p>
                        Address
                        <RedStar />
                      </p>
                    }
                    className=""
                  >
                    <Form.Control type="text" placeholder="Address" value={data.address} name="address" maxLength={200} onChange={(e) => handleChange(e)} />
                    {error && <p style={{ color: "red" }}>{error.address}</p>}
                  </FloatingLabel>
                </div>
              </Col>
              <Col lg={4} md={6} className="mb-3 mb-md-0">
                <div className="upload_wrapper">
                  <div className="upload_tab">
                    <input type="file" name="profilePicture" className="form-control" accept="image/png,image/jpeg,image/jpg" onChange={(e) => handleFileChangeLogo(e)} />
                    <Image src="/images/upload.png" width={19} height={22} alt="" />
                  </div>
                  {passportPic || (data?.profilePicture && Object.keys(data?.profilePicture).length !== 0) ? (
                    <div className="uploaded_item">
                      <OImage src={data?.profilePicture} fallbackUrl={noImageFound} className="w-100 h-100" alt="" />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <span className="pt-2 d-block">
                  {
                    <p>
                      Profile Picture (Only image, upto 2Mb)
                      <RedStar />
                    </p>
                  }
                </span>
                {error && <p style={{ color: "red" }}>{error.profilePicture}</p>}
              </Col>
              <Col lg={4} md={6} className="mb-3 mb-md-0">
                <div className="upload_wrapper">
                  <div className="upload_tab">
                    <input type="file" name="logo" className="form-control" accept="image/png,image/jpeg,image/jpg" onChange={(e) => handleFileChangeLogoImage(e)} />
                    <Image src="/images/upload.png" width={19} height={22} alt="" />
                  </div>
                  {logoPic || (data?.logo && Object.keys(data?.logo).length !== 0) ? (
                    <div className="uploaded_item">
                      <OImage src={imageSrc} fallbackUrl={noImageFound} className="w-100 h-100" alt="" />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <span className="pt-2 d-block">
                  {
                    <p>
                      Company Logo (Only image, upto 2Mb)
                      <RedStar />
                    </p>
                  }
                </span>
                {Helpers.andCondition(error, <p style={{ color: "red" }}>{error.logo}</p>)}
              </Col>
            </Row>

            <div className="not_tag">
              <span className="text-black">Note : </span> To proceed, please verify your mobile number and email address.
            </div>
            <Link onClick={() => handelSubmitForm()} href={data?.is_email_verified == 1 ? "/new-user" : ""} className="theme_md_blue_btn btn btn-primary">
              Submit
            </Link>
          </div>
        </div>
      </Container>
      {Helpers.andCondition(openVerify, <VerifyEmail setData={setData} data={data} open={openVerify} onHide={() => setOpenVerify(false)} />)}
    </section>
  );
};

export default UserForm;
