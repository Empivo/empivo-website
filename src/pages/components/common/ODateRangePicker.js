import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import ErrorMessage from "../ErrorMessage";
import { useEffect, useState } from "react";
import Helpers from "@/utils/helpers";
import dayjs from "dayjs";

const ODateRangePicker = (props) => {
  const startMonthDate = new Date(new Date().setDate(1));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const onChangeStartDate = ([date]) => {
    setStartDate(date);
    props?.handleDateChange(date, endDate);
  };
  const onChangeEndDate = ([date]) => {
    setEndDate(date);
    props.handleDateChange(startDate, date);
  };
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    handleReset();
    if (props?.isReset) {
      props?.setIsReset(false);
    }
  }, [props?.isReset]);

  const handleDateToggle = () => {
    if (document.getElementById("remover")) {
      let element = document.getElementById("remover");
      const classesToToggle = "remover-calander";
      element.classList.toggle(classesToToggle);
    }
  };

  const handleToDateToggle = () => {
    if (document.getElementById("toRemover")) {
      let element = document.getElementById("toRemover");
      const classesToToggle = "remover-tocalander";
      element.classList.toggle(classesToToggle);
    }
  };

  return (
    <>
      <div className={props.type == "apply-leave" ? "w-100 me-3" : "relative d-flex align-items-center mb-3"}>
        <label className={props.type == "apply-leave" ? "d-block mb-2 text-[#B8BBBF] text-xs whitespace-nowrap" : "mx-2 text-[#B8BBBF] text-xs whitespace-nowrap"}>From</label>

        <div className="position-relative">
          {props.type == "apply-leave" && <div className="remove-data" id="remover" onClick={() => handleDateToggle()}></div>}

          <div className="position-relative">
            <Flatpickr
              className={Helpers.ternaryCondition(props.type == "apply-leave", "flat-picker-date w-100", "flat-picker-date")}
              name="start_date"
              placeholder="MM-DD-YYYY"
              value={startDate}
              options={{
                inline: Helpers.ternaryCondition(props.type == "apply-leave", true, false),
                minDate: props.minDate ? `${startMonthDate.getFullYear()}-${startMonthDate.getMonth() + 1}-${startMonthDate.getDate()}` : "",
                maxDate: endDate,
                dateFormat: "m-d-Y",
              }}
              onChange={(date) => {
                onChangeStartDate(date), handleDateToggle();
              }}
            />
            <ErrorMessage message={props.errors?.startDate} />
          </div>
        </div>
      </div>
      <div className={props.type == "apply-leave" ? "w-100" : "relative d-flex align-items-center mb-3"}>
        <label className={props.type == "apply-leave" ? "d-block mb-2 text-[#B8BBBF] text-xs whitespace-nowrap" : "mx-2 text-[#B8BBBF] text-xs whitespace-nowrap"}>To</label>
        <div className="position-relative">
          {props.type == "apply-leave" && <div className="remove-data" id="toRemover" onClick={() => handleToDateToggle()}></div>}
          <div className="position-relative">
            <Flatpickr
              className={props.type == "apply-leave" ? "flat-picker-date w-100" : "flat-picker-date"}
              name="end_date"
              placeholder="MM-DD-YYYY"
              value={endDate}
              disabled={props.isDisabled}
              options={{
                placeholder: "MM-DD-YYYY",
                inline: props.type == "apply-leave" ? true : false,
                minDate: startDate,
                dateFormat: "m-d-Y",
              }}
              onChange={(date) => {
                onChangeEndDate(date);
                handleToDateToggle();
              }}
            />
            <ErrorMessage message={props.errors?.endDate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ODateRangePicker;
