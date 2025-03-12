import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { useEffect, useState } from "react";
import className from "classnames";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import ErrorMessage from "../ErrorMessage";
import { FloatingLabel } from "react-bootstrap";

const BasicDatePicker = (props) => {
  const [isFirstRenderDone, setIsFirstRenderDone] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [addFlex, setAddFlex] = useState(true);

  useEffect(() => {
    setIsFirstRenderDone(1);
    if (!isEmpty(props.value)) {
      setStartDate(dayjs(props.value).toDate());
    }
  }, [props.value]);

  const onChangeStartDate = ([date]) => {
    setStartDate(date);
    props?.handleDateChange(date);
  };
  const handleReset = () => {
    setStartDate("");
  };
  useEffect(() => {
    if (isFirstRenderDone === 1) {
      handleReset();
      if (props?.isReset) {
        props?.setIsReset(false);
      }
    }
    if (!props?.addFlex) {
      setAddFlex(props?.addFlex);
    }
  }, [props?.isReset]);

  console.log("startDate || props.value", startDate, props.value);

  return (
    <>
      <div
        className={className("items-center font-small", {
          flex: addFlex,
        })}
      >
        <FloatingLabel controlId="floatingInput" label={<p>{props.label}</p>} className="date-picker-dob employ-date-picker ">
          <div>
            <Flatpickr
              name="start_data"
              className="form-control cursor-pointer outline-none"
              placeholder="mm/dd/yyyy"
              disabled={props?.disabled}
              value={startDate ? startDate : props.value}
              options={{
                dateFormat: "m-d-Y",
              }}
              onChange={onChangeStartDate}
            />
            {props.errors && !props.state && <ErrorMessage message={props.errors} />}
          </div>
        </FloatingLabel>
      </div>
    </>
  );
};

export default BasicDatePicker;
