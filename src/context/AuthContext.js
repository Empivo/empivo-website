import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import useToastContext from "@/hooks/useToastContext";
import { apiGet, apiPost } from "../utils/apiFetch";
import apiPath from "../utils/pathObj";
import dayjs from "dayjs";
import { pick } from "lodash";
import { getMessaging, onMessage } from "firebase/messaging";
import useFcmToken from "@/hooks/useFcmToken";
import { firebaseApp } from "@/utils/firebaseConfig";

const AuthContext = createContext();

export default AuthContext;
export const AuthProvider = ({ children }) => {
  const [isActive, setIsActive] = useState("profile");
  const [isFromMobileApps, setIsFromMobileApps] = useState(false);
  const [setVerifyOtpData] = useState({});
  const [user, setUser] = useState({});
  const [applyJobsData, setApplyJobsData] = useState([]);
  const [leavesData, setLeavesData] = useState([]);
  const [subscriptionDetails, setSubscriptionDetails] = useState({});
  const [config, setConfig] = useState({});
  const [filterData, setFilterData] = useState({
    isReset: false,
    isFilter: false,
    startDate: "",
    endDate: "",
  });
  const { fcmToken } = useFcmToken();
  const [routePath, setRoutePath] = useState("/");
  const [pagination, setPagination] = useState();
  const initialData = {
    name: "",
    officialEmail: "",
    companyNumber: "",
    address: "",
    logo: "",
    profilePicture: "",
    isBlog: false,
    options: [],
    optionsCity: [],
    selected: "",
    selectedCity: "",
    is_email_verified: 0,
  };
  const [companyDetails, setCompanyDetails] = useState(initialData);
  const router = useRouter();
  const notification = useToastContext();
  const [subscriptionID, setSubscriptionID] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authToken] = useState("");
  const [resetPasswordData, setResetPasswordData] = useState({});
  const [acceptedJobs, setAcceptedJob] = useState(typeof window !== "undefined" && JSON.parse(localStorage.getItem("approvedJobs")));
  const [dateValues, setDateValues] = useState([]);

  useEffect(() => {
    const fcmLocal = localStorage.getItem("fcm");
    if (fcmToken && !fcmLocal) {
      localStorage.setItem("fcm", fcmToken);
    }
  }, [fcmToken]);

  const dateList = async () => {
    try {
      const result = await apiGet(apiPath.employeeDateList);
      if (result?.data?.success) {
        setDateValues(result?.data?.results);
      }
    } catch (error) {}
  };

  // useEffect(() => {
  //   dateList()
  // }, [])

  const [currentFormItem, setCurrentItem] = useState({
    data: {},
    formCategoryType: "",
    indexForm: 0,
    view: false,
    edit: false,
    formLength: 0,
  });

  const [formLists, setFormLists] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      let temp = {};
      if (applyJobsData?.length) {
        temp = applyJobsData.find((el) => el.status === "accepted") || {};
      }
      if (Object.keys(temp)?.length) {
        localStorage.setItem("approvedJobs", JSON.stringify(temp));
      }
      const job = localStorage.getItem("approvedJobs");
      if (job === "null") {
        setAcceptedJob({});
      }
      if (job && job !== "null") {
        const data = JSON.parse(job);
        setAcceptedJob(data);
      }
    }
  }, [applyJobsData]);

  useEffect(() => {
    if (
      router.pathname !== "/forms" ||
      router.pathname !== "/job-applied" ||
      router.pathname !== "/edit/[slug]" ||
      router.pathname !== "/view/[slug]" ||
      router.pathname !== "/pay-slip" ||
      router.pathname !== "/employee-tasks-scheduling" ||
      router.pathname !== "/assign-task-request"
    ) {
      // localStorage.removeItem('approvedJobs')
      setAcceptedJob({});
    }
  }, [router.pathname]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const getConfig = async () => {
    const { status, data } = await apiGet(apiPath.getConfigApi);
    if (status === 200) {
      if (data.success) {
        setConfig(data?.results);
      }
    }
  };

  let loginUser = async (body) => {
    document.getElementById("loader").style.display = "flex";
    const { status, data } = await apiPost(apiPath.userLogin, pick(body, ["email", "password", "deviceId", "deviceType", "deviceToken"]));
    if (status === 200) {
      if (data.success) {
        const token = data?.results?.token || null;
        const refresh_token = data?.results?.refresh_token || null;
        localStorage.setItem("token", token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.removeItem("currentItem");
        localStorage.removeItem("approvedJobs");
        setUser(jwt_decode(token));
        router.push(routePath);
        notification.success(data.message);
      } else {
        notification.error(data?.message);
      }
    } else {
      notification.error(data?.message);
    }
    document.getElementById("loader").style.display = "none";
  };

  const applyJobList = async (page = 1) => {
    try {
      const { startDate, endDate } = filterData;
      let payload = {
        page: page || 1,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
      };
      const path = apiPath.applyJobList;
      const result = await apiGet(path, payload);
      const response = result?.data?.results;
      setApplyJobsData(response.docs);
      setPagination(response);
    } catch (error) {
      console.log("error in get all jobs list==>>>>", error.message);
    }
  };
  const leaveList = async (page = 1) => {
    try {
      const { startDate, endDate } = filterData;
      let payload = {
        page: page || 1,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
      };
      const path = apiPath.leaveList;
      const result = await apiGet(path, payload);
      const response = result?.data?.results;
      setLeavesData(response.docs);
      setPagination(response);
    } catch (error) {
      console.log("error in get all jobs list==>>>>", error.message);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground push notification received:", payload);
      });
      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
  }, []);

  const applyJobApi = () => {
    if (["dashboard", "job-applied", "profile", "forms", "edit/[slug]", "view/[slug]", "leaves", "pay-slip", "employee-tasks-scheduling", "assign-task-request", "mobile"].includes(router.pathname.slice(1))) applyJobList();
  };

  useEffect(() => {
    getConfig();
    setIsActive(router.pathname.slice(1));
    if (typeof window !== "undefined" && ["new-user"].includes(router.pathname.slice(1)) && !localStorage.getItem("company")) {
      router.push("/signIn");
    }
  }, []);

  const formList = async () => {
    try {
      const res = await apiGet(apiPath.formsList, {});
      setFormLists(res?.data?.results);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("subscription")) {
        setSubscriptionDetails(JSON.parse(localStorage.getItem("subscription")));
      }
      if (localStorage.getItem("company")) {
        setCompanyDetails(JSON.parse(localStorage.getItem("company")));
      } else {
        setCompanyDetails(initialData);
      }
      if (localStorage.getItem("subscriptionID")) {
        setSubscriptionID(localStorage.getItem("subscriptionID"));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("token")) {
        let userData = jwt_decode(localStorage.getItem("token"));
        setUser(userData);
      }
    }
  }, []);

  useEffect(() => {
    if (router.pathname === "/employeeResetPassword") return;
    if (!["/signIn", "/signUp", "/forgotPassword"].includes(router.asPath)) setRoutePath(router.asPath);
  }, [router.asPath]);

  let logoutUser = async () => {
    const { data } = await apiGet(apiPath.logout);
    console.log("data", data);
    notification.success("Logout successfully.");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };

  let contextData = {
    user,
    logoutUser: logoutUser,
    loginUser: loginUser,
    setUser,
    handleShowPassword,
    showPassword,
    subscriptionDetails,
    setSubscriptionDetails,
    companyDetails,
    setCompanyDetails,
    initialData,
    config,
    setSubscriptionID,
    subscriptionID,
    setVerifyOtpData,
    authToken,
    resetPasswordData,
    setResetPasswordData,
    isActive,
    setIsActive,
    applyJobsData,
    leavesData,
    filterData,
    setFilterData,
    applyJobList,
    leaveList,
    pagination,
    applyJobApi,
    acceptedJobs,
    setCurrentItem,
    currentFormItem,
    formList,
    formLists,
    dateValues,
    dateList,
    routePath,
    isFromMobileApps,
    setIsFromMobileApps,
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};
