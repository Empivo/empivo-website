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
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

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
    <header>
      <nav className="navbar navbar-expand-lg navbar-light custum1">
        <div className="container-fluid" style={{ paddingRight: 0, alignItems: 'baseline' }}>
          <div className="brand_outer">
            <Navbar.Brand href="/" as={Link}>
              <Image width={213} height={54} src={logo} alt="" className="wow slideInUp" data-wow-delay="5s" data-wow-duration="2s" />
            </Navbar.Brand>
          </div>
          <button
            className={`navbar-toggler ${!isNavCollapsed ? 'collapsed' : ''}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
            onClick={handleNavCollapse}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" href="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/#categories">
                  Job Seeker
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/#subscription">
                  Company
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/empivo-feature">
                  Empivo Feature
                </Link>
              </li>
            </ul>
            
            <div className="btn-header">
              {!isEmpty(user) ? (
                <div className="unlocked_user notify-user-log">
                  {notification ? (
                    <Link href="/notifications" className="position-relative notification me-md-3 me-2" title="Notification" onClick={() => handelApiCall()}>
                      <Image src="./images/notifiation.svg" alt="" width={30} height={30} /> 
                      <span className="position-absolute d-block rounded-circle bg-danger"></span>
                    </Link>
                  ) : (
                    <Link href="/notifications" className="position-relative notification me-md-3 me-2" onClick={() => handelApiCall()}>
                      <Image src="./images/notifiation.svg" alt="" width={30} height={30} />
                    </Link>
                  )}
                  <Dropdown className="dropdown-header-menu">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      <figure className="mb-0">
                        <Image src={image} width={36} height={36} alt="" />
                      </figure>
                      <span>{user?.name}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <div className="profile_nav">
                        <Dropdown.Item 
                          as={Link} 
                          href="/profile" 
                          onClick={() => setIsActive("profile")} 
                          className={getDropdownItemClassName("profile")}
                        >
                          <Image src="/images/user_icon.svg" width={14} height={16} alt="" />
                          My Account
                        </Dropdown.Item>
                        <Dropdown.Item 
                          as={Link} 
                          href="/job-applied" 
                          onClick={() => setIsActive("job-applied")} 
                          className={getDropdownItemClassName("job-applied")}
                        >
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
                <div className="">
                  <Link as="/signIn" href="/signIn">
                    <span className="job-login">Job Seeker Login</span> 
                  </Link>
                  <Link as="/signUp" href="/signUp">
                    <span className="job-log-out">Job Seeker Register</span> 
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <style jsx global>{`
        .navbar-toggler:not(.collapsed) .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%280, 0, 0, 0.55%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        .navbar-toggler.collapsed .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%280, 0, 0, 0.55%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 4L26 26M26 4L4 26'/%3e%3c/svg%3e");
        }
      `}</style>
    </header>
  );
}

export default Header;