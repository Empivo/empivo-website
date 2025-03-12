import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Forms from "../forms";
import AuthContext from "@/context/AuthContext";
import jwt_decode from "jwt-decode";
const Index = () => {
  const [state, setState] = useState("");
  const router = useRouter();

  let { setUser, setIsFromMobileApps } = useContext(AuthContext);

  useEffect(() => {
    if (router?.query?.token) {
      const token = router?.query?.token;
      // localStorage.setItem("token", router?.query?.token);
      // setState(router?.query?.token);
      localStorage.setItem("token", token);
      localStorage.setItem("refresh_token", token);
      localStorage.removeItem("currentItem");
      localStorage.removeItem("approvedJobs");
      setIsFromMobileApps(true);
      setUser(jwt_decode(token));

      router.push("/forms");
    }
  }, [router?.query?.token]);

  return <>{state && <Forms />}</>;
};

export default Index;
