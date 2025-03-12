import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/style.css";
import "@/styles/responsive.css";
import "@/styles/form.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContextProvider } from "@/context/ToastContext";
import { useRouter } from "next/router";

function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const notAuthUrl = ["/signIn", "/signUp"];

  const checkRoutes = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const isUserLogin = token;
      const isRoutes = notAuthUrl?.includes(router?.pathname);

      if (isUserLogin && isRoutes) {
        router.push("/");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    checkRoutes();
  }, [router?.pathname]);

  return (
    <>
      <ToastContextProvider>
        <AuthProvider>
          {!["/signIn", "/signUp", "/forgotPassword", "/employeeResetPassword"].includes(router.pathname) ? router.pathname !== "/form/[slug]" && <Header /> : null}
          {!loading && <Component {...pageProps} />}
          {!["/signIn", "/signUp", "/forgotPassword", "/employeeResetPassword"].includes(router.pathname) ? router.pathname !== "/form/[slug]" && <Footer /> : null}
        </AuthProvider>
      </ToastContextProvider>
    </>
  );
}

export default App;
