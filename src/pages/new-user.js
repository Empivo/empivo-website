import { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Accordion } from "react-bootstrap";
import Image from "next/image";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";
import dayjs from "dayjs";
import apiPath from "../utils/pathObj";
import { apiGet, apiPost } from "../utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import OImage from "./components/reusable/OImage";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const NewUser = () => {
  const router = useRouter();
  const notification = useToastContext();
  const { companyDetails, subscriptionDetails } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [indexID, setIndexID] = useState(0);
  const [purchaseSubscription, setPurchaseSubscription] = useState([]);
  const [loader, setLoader] = useState(true);

  const handleClose = () => {
    setShow(false);
    router.push("/");
  };

  const [subscriptionList, setSubscriptionList] = useState([]);

  const getSubscriptionList = async () => {
    try {
      setLoader(true);
      let res = await apiGet(apiPath.getSubscriptionList, {});
      var id = "";
      if (localStorage.getItem("subscriptionID")) {
        id = localStorage.getItem("subscriptionID");
      }
      res.data.results.docs = res.data.results.docs.sort((a, b) => a.amount - b.amount);
      let index = res.data.results.docs.findIndex((item) => item._id.toString() == id.toString());
      if (index !== -1) {
        if (companyDetails?.is_email_verified == 0 || !localStorage.getItem("subscription")) {
          res.data.results.docs[index].status = "inactive";
          setIndexID(index);
        } else {
          let i = res.data.results.docs.findIndex((item) => item.amount > subscriptionDetails?.subscriptionAmount);
          if (i != -1) {
            res.data.results.docs[i].status = "inactive";
            setIndexID(i);
          } else res.data.results.docs = [];
        }
      } else res.data.results.docs[0].status = "inactive";
      setSubscriptionList(res?.data?.results?.docs);
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoader(false);
    }
  };

  const activeSubscription = async (index) => {
    const data = [...subscriptionList];
    data.forEach((item, i) => {
      if (i === index) {
        item.status = item.status === "active" ? "inactive" : "active";
      } else {
        item.status = "active";
      }
    });
    setSubscriptionList(data);
  };

  useEffect(() => {
    getSubscriptionList();
  }, [companyDetails]);

  const handlePurchase = async () => {
    try {
      var id = "";
      if (localStorage.getItem("subscriptionID")) {
        id = localStorage.getItem("subscriptionID");
      }
      const allList = subscriptionList?.filter((item) => item.status === "inactive");
      const previosSubscription = subscriptionList?.filter((item) => item._id.toString() === id?.toString());
      if (!allList?.length && subscriptionList?.length > 0) {
        notification.error("Please select one subscription");
        return;
      }
      if (allList?.[0]?.amount < previosSubscription?.[0]?.amount) {
        notification.error("Please select higher amount of current amount");
        return;
      }

      const formData = new FormData();
      formData.append("name", companyDetails.name);
      formData.append("email", companyDetails.officialEmail);
      formData.append("countryID", companyDetails?.selected?._id);
      formData.append("cityID", companyDetails?.selectedCity?._id);
      formData.append("companyNumber", companyDetails.companyNumber);
      formData.append("address", companyDetails.address);
      formData.append("subscriptionID", subscriptionList?.find((item) => item.status == "inactive")?._id);
      formData.append("amount", subscriptionList?.find((item) => item.status == "inactive")?.amount);
      if (companyDetails.profilePicture?.startsWith("data:image")) {
        let response = await fetch(companyDetails.profilePicture);
        let data = await response.blob();
        let metadata = {
          type: "image/jpeg",
        };
        let profilePicture = new File([data], "Image.jpg", metadata);
        formData.append("profilePicture", profilePicture);
      }
      if (companyDetails.logo?.startsWith("data:image")) {
        let response = await fetch(companyDetails.logo);
        let data = await response.blob();
        let metadata = {
          type: "image/jpeg",
        };
        let logo = new File([data], "ImageLogo.jpg", metadata);
        formData.append("logo", logo);
      }

      const res = await apiPost(apiPath.purchaseSubscription, formData);
      if (res?.data?.success === true) {
        window.location.href = res?.data?.results?.sessionUrl;
      } else {
        notification.error(res?.data?.message);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  let buttonLabel;
  if (subscriptionList?.length > 0) {
    if (companyDetails?.is_email_verified === 1 && Object.keys(subscriptionDetails || {})?.length) {
      buttonLabel = "Upgrade";
    } else {
      buttonLabel = "Purchase";
    }
  } else {
    buttonLabel = "You don't have any upgrade to subscription plan.";
  }

  return (
    <>
      <section className="profile_main_wrap bg-light ">
        <Container>
          <div className="fullpage_wrapper bg-white new_user rounded_5">
            <div className="detail_part_row">
              <div className="detail_part_left">
                <Row>
                  <Col sm={12} className="">
                    <h3 className="account_title mb-4">Account Details</h3>
                  </Col>
                  <Col sm={12} className="">
                    <div className="company_lg_logo news_user_pic mb-3 mb-sm-4">{companyDetails?.profilePicture && <OImage src={companyDetails?.profilePicture} width={84} height={84} alt="" />}</div>
                  </Col>
                  <Col sm={6}>
                    <div className="profile_detail_col">
                      <figure>
                        <Image src="/images/company.svg" width={17} height={20} alt="" />{" "}
                      </figure>
                      <div className="info_text">
                        <span className="d-block">Company Name</span>
                        <span className="text-dark d-block text-break">{companyDetails?.name}</span>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="profile_detail_col">
                      <figure>
                        <Image src="/images/phonecall.svg" width={17} height={20} alt="" />{" "}
                      </figure>
                      <div className="info_text">
                        <span className="d-block">Company Number</span>
                        <span className="text-dark d-block text-break">{companyDetails?.companyNumber}</span>
                      </div>
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="profile_detail_col">
                      <figure>
                        <Image src="/images/email.svg" width={17} height={20} alt="" />{" "}
                      </figure>
                      <div className="info_text">
                        <span className="d-block">Company Email ID</span>
                        <span className="text-dark d-block">{companyDetails?.officialEmail}</span>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="profile_detail_col">
                      <figure>
                        <Image src="/images/network.svg" width={17} height={20} alt="" />{" "}
                      </figure>
                      <div className="info_text">
                        <span className="d-block">Country</span>
                        <span className="text-dark d-block">{companyDetails?.selected?.name}</span>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="profile_detail_col">
                      <figure>
                        <Image src="/images/city.svg" width={17} height={20} alt="" />{" "}
                      </figure>
                      <div className="info_text">
                        <span className="d-block">City</span>
                        <span className="text-dark d-block">{companyDetails?.selectedCity?.name}</span>
                      </div>
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="profile_detail_col">
                      <figure>
                        <Image src="/images/locationdark.svg" width={17} height={20} alt="" />{" "}
                      </figure>
                      <div className="info_text">
                        <span className="d-block">Address</span>
                        <span className="text-dark d-block text-break">{companyDetails?.address}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Button className="theme_md_blue_btn" onClick={() => router.push("/user-form")}>
                  Edit
                </Button>
                {Object.keys(subscriptionDetails || {}).length > 0 && (
                  <div className="active_plan pt-3 pt-md-5">
                    <div className="active_plan_head d-sm-flex justify-content-between align-items-center mb-3 mb-sm-0">
                      <h3 className="account_title mb-2 mb-sm-4">Active Plan</h3>
                      <span>You can upgrade the plan</span>
                    </div>

                    <div className="list_point_box">
                      <ul>
                        <li className="fs-20">
                          <span className="text-black d-block fw-600">{subscriptionDetails?.subscriptionName}</span>
                          <strong className="text-blue d-block text-blue">${subscriptionDetails?.subscriptionAmount}</strong>
                        </li>

                        <li>
                          <span className="d-block fw-bold">Purchase date</span>
                          <strong className="text-black d-block fw-bold">{dayjs(subscriptionDetails?.subscriptionPurchaseDate).format("MM-DD-YYYY h:mm A")}</strong>
                        </li>
                        <li>
                          <span className="d-block fw-bold">Expiry date </span>
                          <strong className="text-black d-block fw-bold">{dayjs(subscriptionDetails?.subscriptionExpiryDate).format("MM-DD-YYYY h:mm A")}</strong>
                        </li>
                      </ul>
                    </div>

                    <div className="list_point pt-3">
                      <ul className="mb-1">
                        <li>{subscriptionDetails?.subscriptionDuration} days</li>
                        <li>
                          Number of HR <span className="text-black">{subscriptionDetails?.noOfHR}</span>
                        </li>
                        <li>
                          Number of employees
                          <span className="text-black">{subscriptionDetails?.noOfEmployee}</span>
                        </li>
                        <li>
                          Number of accountant
                          <span className="text-black">{subscriptionDetails?.noOfAccountant}</span>
                        </li>
                        <div className="plan_feature_list">
                          <ul className="theme_list_point">
                            {subscriptionDetails?.description?.map((line, index) => (
                              <li key={line + index}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="detail_part_right">
                <h3 className="account_title mb-4">Subscription Plans</h3>

                <div className="not">
                  <span className="text-black">Note :</span> The new plan will replace the previous one and will go into effect on the date and time of purchase.
                </div>
                <div className="theme_accordian mt-2 py-3">
                  {subscriptionList &&
                    subscriptionList.map((item, i) => {
                      return (
                        <Accordion key={i} defaultActiveKey={indexID} onClick={() => activeSubscription(i)}>
                          <Accordion.Item eventKey={i}>
                            <Accordion.Header>
                              <div className={item?.status == "inactive" ? "plan_check active" : "plan_check"}>
                                <span></span>
                              </div>
                              {item?.name}
                              <strong className="text-blue">${item?.amount}</strong>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="list_point">
                                <ul>
                                  <li>{item?.duration} days</li>
                                  <li>
                                    Number of HR <span className="text-black">{item?.noOfHR}</span>
                                  </li>
                                  <li>
                                    Number of employees
                                    <span className="text-black">{item?.noOfEmployee}</span>
                                  </li>
                                  <li>
                                    Number of accountant
                                    <span className="text-black">{item?.noOfAccountant}</span>
                                  </li>
                                  <div className="plan_feature_list">
                                    <ul className="theme_list_point">
                                      {item?.description?.map((line, index) => (
                                        <li key={line + index}>{line}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </ul>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      );
                    })}
                  {loader ? (
                    ""
                  ) : (
                    <Button
                      className="theme_md_blue_btn"
                      onClick={() => {
                        handlePurchase();
                      }}
                    >
                      {buttonLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* change_password_modal */}

      <Modal show={show} onHide={handleClose} className="theme_modal" centered>
        <Modal.Body>
          <div className="success_modal">
            <figure className="success_tic">
              <Image src="/images/success.svg" width={56} height={56} alt="" />
            </figure>
            <figcaption>
              <strong>Success !</strong>
              <span>
                Reference Id <strong>{purchaseSubscription?.transactionID}</strong>
              </span>
              <p>Thanks for choosing us, we will share the details on registered email </p>
              <Button className="theme_md_blue_btn mt-3" onClick={handleClose}>
                OK
              </Button>
            </figcaption>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewUser;
