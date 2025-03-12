import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import { Container, Nav, Navbar, Dropdown } from "react-bootstrap";
import { IoIosCall } from "react-icons/io";
import { isEmpty } from "lodash";
import logo from "../../images/logo.svg";
import AuthContext from "@/context/AuthContext";
import helper from "../../utils/helpers";
import { useRouter } from "next/router";
import { AiOutlineMail } from "react-icons/ai";
import { apiGet } from "@/utils/apiFetch";
import apiPath from "@/utils/pathObj";
import classNames from "classnames";

function Header() {
  const router = useRouter();
  const { user, logoutUser, config, isActive, setIsActive, isFromMobileApps } = useContext(AuthContext);
  const [image, setImage] = useState("");
  const [route, setRoute] = useState("/");
  const [settingDetails, setSettingDetails] = useState({});
  const [notification, setNotification] = useState(false);

  const getSlug = (slug) => {
    const obj = config?.staticContent?.find((s) => s.slug === slug);
    return `/${obj?.publicSlug}`;
    
  };

  const getSetting = async () => {
    try {
      var path = apiPath.getSetting;
      const result = await apiGet(path, {}, false);
      setSettingDetails({ ...settingDetails, ...result.data.results });
    } catch (error) {
      console.log("error in get all category list==>>>>", error.message);
    }
  };

  const getDropdownItemClassName = (target) => {
    return isActive === target ? "active" : "";
  };

  const getNotification = async () => {
    try {
      const path = apiPath.checkNotification;
      const result = await apiGet(path, {}, false);
      setNotification(result?.data?.results?.unreadNotification);
    } catch (error) {
      console.log("error:", error);
    }
  };
  const readNotification = async () => {
    try {
      const path = apiPath.readNotification;
      const result = await apiGet(path, {});
      console.log("result", result);
      getNotification();
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handelApiCall = () => {
    readNotification();
  };
  useEffect(() => {
    getSetting();
  }, []);

  useEffect(() => {
    if (!isEmpty(user)) {
      if (user?.profilePic !== "https://octal-dev.s3.ap-south-1.amazonaws.com/no_image.png") {
        setImage(user?.profilePic);
      } else {
        setImage("../images/user.png");
      }
    }
  }, [user]);

  const handleLogout = () => {
    logoutUser();
  };

  const activeShow = (e, path) => {
    setRoute(path);
  };
  useEffect(() => {
    if (Object.keys(user || {}).length > 0) getNotification();
  }, [user]);

  useEffect(() => {
    setRoute(router.asPath);
  }, [router.asPath]);

  if (isFromMobileApps) {
    return <></>;
  }

  return (
    <div>
      <div className="header position-relative">
        <div className="md_header">
          <Container>
            <div className="md-header_content">
              <div className="header_content_left">
                <ul>
                  <li>
                    <a href={isEmpty(user) ? "javascript:void(0)" : `tel:${settingDetails?.countryCode + settingDetails?.mobile}`} className="btn_link  d-flex align-items-center bg-green text-white call_tag under_text">
                      <span>
                        <IoIosCall />
                      </span>{" "}
                      {"+" + (settingDetails?.countryCode || " N/A") + " " + (settingDetails?.mobile || "")}
                    </a>
                  </li>
                  <li>
                    <a href={isEmpty(user) ? "javascript:void(0)" : `mailto:${settingDetails?.email || " N/A"}`} className="btn_link  d-flex align-items-center bg-green text-white call_tag under_text">
                      <span>
                        <AiOutlineMail />
                      </span>{" "}
                      {settingDetails?.email}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="header_social">
                <Link href="https://www.facebook.com/empivo/" target="_blank">
                  <img src="/images/facebook.png" width={34} height={34} />
                </Link>
                <Link href="https://twitter.com/i/flow/login?redirect_after_login=%2F" target="_blank">
                  <img src="/images/twiter.png" width={34} height={34} />
                </Link>
                <Link href="https://myaccount.google.com/" target="_blank">
                  <img src="/images/google.png" width={34} height={34} />
                </Link>
                <Link href="https://www.linkedin.com/company/empivo/" target="_blank">
                  <img src="/images/linkdin.png" width={34} height={34} />
                </Link>
                <Link href="https://www.instagram.com/empivohr/" target="_blank">
                <img src="/images/Instagram.png" width={34} height={34} alt="" />
              </Link>
              </div>
            </div>
          </Container>
        </div>
        <Navbar expand="lg">
          <Container className="justify-content-between">
            <div className="brand_outer">
              <Navbar.Brand href="/" as={Link}>
                <Image width={213} height={54} src={logo} alt="" className="wow slideInUp" data-wow-delay="5s" data-wow-duration="2s" />
              </Navbar.Brand>
            </div>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="m-auto">
                <Nav.Link
                  href="/"
                  onClick={(e) => {
                    activeShow(e, "/");
                  }}
                  active={route === "/"}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  href="/#categories"
                  onClick={(e) => {
                    activeShow(e, "/#categories");
                  }}
                  active={route === "/#categories"}
                >
                  Job Seeker
                </Nav.Link>
                {isEmpty(user) && (
                  <Nav.Link
                    href="/#subscription"
                    className={classNames("nav-link")}
                    onClick={(e) => {
                      activeShow(e, "/#subscription");
                    }}
                    active={route === "/#subscription"}
                  >
                    Company
                  </Nav.Link>
                )}

                <Nav.Link href={getSlug("about-us")} active={route === "/about-us"}>
                  About Us
                </Nav.Link>
                <Nav.Link
                  href="/empivo-feature"
                  onClick={(e) => {
                    activeShow(e, "/empivo-feature");
                  }}
                  active={route === "/empivo-feature"}
                >
                  Empivo feature
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
            <div className="header_right">
              {!isEmpty(user) ? (
                <div className="unlocked_user notify-user-log">
                  {notification ? (
                    <Link href="/notifications" className="position-relative notification me-md-3 me-2" title="Notification" onClick={() => handelApiCall()}>
                      <Image src="./images/notifiation.svg" alt="" width={30} height={30} /> <span className="position-absolute d-block rounded-circle bg-danger"></span>
                    </Link>
                  ) : (
                    <Link href="/notifications" className="position-relative notification me-md-3 me-2" onClick={() => handelApiCall()}>
                      <Image src="./images/notifiation.svg" alt="" width={30} height={30} />
                    </Link>
                  )}
                  <Dropdown className="dropdown-header-menu">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      <figure className="mb-0">
                        <img src={image} width={36} height={36} alt="" />
                      </figure>{" "}
                      <span>{user?.name}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <div className="profile_nav">
                        <Dropdown.Item as={Link} href="/profile" onClick={() => setIsActive("profile")} className={getDropdownItemClassName("profile")}>
                          <Image src="/images/user_icon.svg" width={14} height={16} alt="" />
                          My Account
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} href="/job-applied" onClick={() => setIsActive("job-applied")} className={getDropdownItemClassName("job-applied")}>
                          <Image src="/images/employee-request.svg" width={14} height={16} alt="" />
                          Job Applied
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => helper.alertFunction(`Are you sure you want to logout`, "", handleLogout)}>
                          <Image src="/images/logout.svg" width={14} height={16} alt="" />
                          Logout
                        </Dropdown.Item>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : (
                <div className="locked_user">
                  <Link as="/signIn" href="/signIn">
                    <span className=" d-none d-md-inline-block">Job Seeker</span> Login
                  </Link>
                  <Link as="/signUp" href="/signUp">
                    <span className=" d-none d-md-inline-block">Job Seeker</span> Register
                  </Link>
                </div>
              )}
            </div>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </Container>
        </Navbar>
      </div>
    </div>
  );
}

export default Header;
