import AuthContext from "@/context/AuthContext";
import Image from "next/image";
import React, { useContext, useState, useEffect } from "react";
import { isEmpty } from "lodash";
import helper from "../../utils/helpers";
import { useRouter } from "next/router";

const ProfileSidebar = () => {
  const [image, setImage] = useState("");
  const router = useRouter();
  const { user, logoutUser, isActive, setIsActive, applyJobsData, dateList, isFromMobileApps } = useContext(AuthContext);
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

  useEffect(() => {
    dateList();
  }, []);

  if (isFromMobileApps) {
    return <></>;
  }

  return (
    <>
      <div className="profile_sidebar">
        <div className="user_info_wrapper">
          <figure className="profile_pic">
            <img src={image} width={96} height={96} alt="image" />
          </figure>
          <strong>{user?.name}</strong>
        </div>

        <div className="profile_nav">
          <ul>
            {applyJobsData?.map(
              (applyJobsDataStatus, index) =>
                applyJobsDataStatus?.formStatus == "accepted" && (
                  <>
                    <li key={index}>
                      <button
                        onClick={() => {
                          setIsActive("dashboard");
                          router.push("/dashboard");
                        }}
                        className={isActive == "dashboard" && "active"}
                      >
                        <Image src="/images/profilejob.svg" width={14} height={16} alt="" />
                        Dashboard
                      </button>
                    </li>
                  </>
                )
            )}
            <li>
              <button
                onClick={() => {
                  setIsActive("profile");
                  router.push("/profile");
                }}
                className={isActive == "profile" && "active"}
              >
                <Image src="/images/user_icon.svg" width={14} height={16} alt="" />
                My Account
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  setIsActive("job-applied");
                  router.push("/job-applied");
                }}
                className={isActive == "job-applied" && "active"}
              >
                <Image src="/images/employee-request.svg" width={14} height={16} alt="" />
                Job Applied
              </button>
            </li>
            {applyJobsData?.map(
              (applyJobsDataStatus, index) =>
                applyJobsDataStatus?.formStatus == "accepted" && (
                  <>
                    <li key={index}>
                      <button
                        onClick={() => {
                          setIsActive("leaves");
                          router.push("/leaves");
                        }}
                        className={isActive == "leaves" && "active"}
                      >
                        <Image src="/images/Leaves-manager.svg" width={14} height={16} alt="" />
                        Leaves
                      </button>
                    </li>
                  </>
                )
            )}
            {applyJobsData?.map(
              (applyJobsDataStatus, index) =>
                applyJobsDataStatus?.status == "accepted" && (
                  <>
                    <li key={index}>
                      <button
                        onClick={() => {
                          setIsActive("forms");
                          router.push("/forms");
                        }}
                        className={isActive == "forms" && "active"}
                      >
                        <Image src="/images/forms-manager.svg" width={14} height={16} alt="" />
                        Forms
                      </button>
                    </li>
                  </>
                )
            )}
            {applyJobsData?.map(
              (applyJobsDataStatus, index) =>
                applyJobsDataStatus?.formStatus == "accepted" && (
                  <>
                    <li key={index}>
                      <button
                        onClick={() => {
                          setIsActive("pay-slip");
                          router.push("/pay-slip");
                        }}
                        className={isActive == "pay-slip" && "active"}
                      >
                        <Image src="/images/manage-jobs.svg" width={14} height={16} alt="" />
                        Pay Slip
                      </button>
                    </li>
                  </>
                )
            )}
            {applyJobsData?.map(
              (applyJobsDataStatus, index) =>
                applyJobsDataStatus?.formStatus == "accepted" && (
                  <>
                    <li key={index}>
                      <button
                        onClick={() => {
                          setIsActive("employee-tasks-scheduling");
                          router.push("/employee-tasks-scheduling");
                        }}
                        className={isActive == "employee-tasks-scheduling" && "active"}
                      >
                        <Image src="/images/employee-task-schedule.svg" width={14} height={16} alt="" />
                        Employee tasks scheduling
                      </button>
                    </li>
                  </>
                )
            )}

            <li>
              <button onClick={() => helper.alertFunction(`Are you sure you want to logout`, "", handleLogout)}>
                <Image src="/images/logout.svg" width={14} height={16} alt="" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
