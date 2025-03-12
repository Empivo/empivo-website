import { useContext } from "react";
import ToastContext from "../context/ToastContext";

const useToastContext = () => {
  return useContext(ToastContext);
};

export default useToastContext;
