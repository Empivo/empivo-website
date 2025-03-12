import React, { useContext, useState } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import { apiPost } from "@/utils/apiFetch";
import apiPath from "@/utils/pathObj";
import useToastContext from "@/hooks/useToastContext";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import Select from "react-select";
import RedStar from "../components/common/RedStar";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "../components/ErrorMessage";
import Image from "next/image";
import { LuUpload } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import photoClose from "../../images/photo_close.png";

const ApplyJobs = ({ open, onHide, skillApply }) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const notification = useToastContext();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [experienceType, setExperienceType] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [jobData, setJobData] = useState(false);
  const [successData, setSuccessData] = useState(true);
  const [images, setImages] = useState([]);
  const experienceTypeOptions = [
    {
      key: "0 to 6 months",
      value: "0 to 6 months",
    },
    {
      key: "6 months to 1 year",
      value: "6 months to 1 year",
    },
    {
      key: "1 year to 3 years",
      value: "1 year to 3 years",
    },
    {
      key: "3 year to 5 years",
      value: "3 year to 5 years",
    },
    {
      key: "More than 5 years",
      value: "More than 5 years",
    },
  ];

  const checkFields = () => {
    let isValid = true;
    if (experienceType === "") {
      setExperienceError(true);
      isValid = false;
    } else {
      setExperienceError(false);
    }
    return isValid;
  };

  const statusPage = (e) => {
    setExperienceType(e.target.value);
  };
  const onSubmit = async (data) => {
    try {
      const isValid = checkFields();
      if (!isValid) return;
      let link = [];
      if (data.skillIds?.length > 0) {
        link = data.skillIds?.map((item) => item?.value);
      }
      const formData = new FormData();
      formData.append("skillIds", link);
      formData.append("yearOfExperiece", experienceType);
      formData.append("jobID", skillApply._id);
      formData.append("companyID", skillApply.companyId);
      formData.append("employeeID", user?._id);

      if (images?.length > 0) {
        images?.map((item) => {
          formData.append("file", item);
        });
      }
      const res = await apiPost(apiPath.applyJob, formData);
      if (res.data.success === true) {
        setSuccessData(false);
        setJobData(true);
        notification.success(res.data.message);
      } else {
        notification.error(res?.data?.message);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = e.target.files;

    const areAllImages = Array.from(selectedFiles).every((file) => ["pdf"].includes(file.name.split(".")[file.name.split(".").length - 1]));

    if (areAllImages) {
      const newImages = Array.from(selectedFiles).slice(0, 1);

      const fileSize = (e.target.files[0]?.size / (1024 * 1024)).toFixed(2);
      if (fileSize > 15) {
        notification.error("Please select file below 15Mb.");
        return false;
      }
      if (images.length + newImages.length <= 1) {
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    } else {
      notification.error(`Please select only pdf files.`);
    }
  };
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };
  const handleClose = () => {
    setJobData(false);
    router.push("/job-applied");
  };

  return (
    <div>
      {successData && (
        <Modal show={open} onHide={onHide} centered className="agent-modal">
          <Modal.Header className="d-flex justify-content-center" closeButton>
            <Modal.Title>Enter Your Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              onSubmit={handleSubmit(onSubmit, () => {
                const isValid = checkFields();
                if (!isValid) return;
              })}
              method="post"
            >
              <Form.Group className="mb-3" controlId="">
                <Form.Label>
                  Select your skills
                  <RedStar />
                </Form.Label>
                <Controller
                  control={control}
                  name="skillIds"
                  rules={{
                    required: "Please select skills.",
                  }}
                  render={({ field: { ref, ...field } }) => (
                    <Select
                      {...field}
                      inputExtraProps={{
                        ref,
                        required: true,
                        autoFocus: true,
                      }}
                      placeholder="Please select skills"
                      options={skillApply.skills}
                      isMulti
                    />
                  )}
                />
                <ErrorMessage message={errors?.skillIds?.message} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Year of experience
                  <RedStar />
                </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  value={experienceType}
                  onChange={(e) => {
                    statusPage(e);
                    if (e) {
                      setExperienceError(false);
                    }
                  }}
                >
                  <option value="">Please select experience</option>
                  {experienceTypeOptions?.map((res, index) => {
                    return (
                      <option key={index} value={res.value}>
                        {res.value}
                      </option>
                    );
                  })}
                </Form.Select>
                {experienceError && <ErrorMessage message="Please select experience." />}
              </Form.Group>

              <div className="">
                <div className="relative z-0  w-full group mb-4">
                  <label htmlFor="uploadFile" className="mb-3 fw-bold text-black">
                    {" "}
                    Upload Resume
                  </label>
                  <div className="upload-doc-file position-relative block py-4  px-0 w-full text-sm text-gray-900 bg-transparent  appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer">
                    <input type="file" className="form-control opacity-0 position-absolute top-0 bottom-0 cursor-pointer z-index-small" accept="application/pdf" multiple={false} onChange={handleImageChange} />

                    <div className="d-flex align-items-center position-absolute top-0  cursor-pointer">
                      <figure className="p-3 py-2 border rounded-lg me-3 mb-0">
                        <LuUpload />
                      </figure>
                      <figcaption>Choose a file to upload</figcaption>
                    </div>
                  </div>

                  <Row>
                    {images?.map((image, index) => (
                      <Col md={4} className="mb-3" key={index}>
                        <div className="border border-2 p-3 rounded-lg position-relative report_img_h w-100 h-100 rounded-3 report_imag_resize">
                          <button variant="link" className="position-absolute me-1 mt-1  border-0 p-0 close-doc-icon" onClick={() => handleRemoveImage(index)}>
                            <Image src={photoClose} width={24} alt="" height={24} />
                          </button>

                          <div className="">
                            <span className="block mr-3">
                              <IoDocumentTextOutline className="fs-1 mb-3" />
                            </span>
                            <span className="text-truncate d-block max-w-[160px]">{image?.name}</span>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>

              <div className="text-center">
                {" "}
                <Button type="submit" className="theme_lg_btn text-decoration-none category-btn w-100">
                  Apply On Job
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
      {jobData ? (
        <Modal show={jobData} onHide={handleClose} className="theme_modal" centered>
          <Modal.Body>
            <div className="success_modal">
              <figure className="success_tic">
                <Image src="/images/success.svg" width={56} height={56} alt="" />
              </figure>
              <figcaption>
                <strong>Success !</strong>
                <p>You have successfully applied for the job, the company will contact you !! </p>
                <Button className="theme_md_blue_btn mt-3" onClick={handleClose}>
                  OK
                </Button>
              </figcaption>
            </div>
          </Modal.Body>
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
};

export default ApplyJobs;
