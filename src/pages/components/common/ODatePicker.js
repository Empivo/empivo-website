import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { useEffect, useState } from "react";
import className from "classnames";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import ErrorMessage from "../ErrorMessage";
import { FloatingLabel } from "react-bootstrap";
import RedStar from "./RedStar";

const ODatePicker = (props) => {
  const [isFirstRenderDone, setIsFirstRenderDone] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [addFlex, setAddFlex] = useState(true);

  useEffect(() => {
    setIsFirstRenderDone(1);
    if (!isEmpty(props.expiryFrom)) {
      setStartDate(dayjs(props.expiryFrom).toDate());
    }
  }, [props.expiryFrom]);

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
  return (
    <>
      <div
        className={className("items-center mb-3 font-small", {
          flex: addFlex,
        })}
      >
        <FloatingLabel
          controlId="floatingInput"
          label={
            <p>
              DOB <RedStar />
            </p>
          }
          className="date-picker-dob"
        >
          <div>
            <Flatpickr
              name="start_data"
              className="form-control cursor-pointer pt-4"
              placeholder="mm/dd/yyyy"
              value={startDate}
              disabled={props?.disabled}
              options={{
                dateFormat: "m-d-Y",
                maxDate: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
              }}
              onChange={onChangeStartDate}
            />
            <ErrorMessage message={props.errors?.startDate} />
          </div>
        </FloatingLabel>
      </div>
    </>
  );
};

export default ODatePicker;
