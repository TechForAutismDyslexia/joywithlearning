import axios from "axios";
import { useState, useRef } from "react";
import "./cssfiles/Enquire.css";
import Loader from "./Loader";
// eslint-disable-next-line no-unused-vars
import { toast, ToastContainer } from "react-toastify";

const Enquire = () => {
  const [formData, setFormData] = useState({});
  const [qna, setQna] = useState({});
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const formRef = useRef(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isInputHidden, setIsInputHidden] = useState(false);
  const videoRef = useRef(null);
  const videoInputRef = useRef(null);

  const MAX_VIDEO_SIZE_MB = 5;
  const MAX_VIDEO_DURATION_SECONDS = 60;

  const questions = [
    "If you point at something across the room, does your child look at it? (For example, If you point at a toy or an animal, does your child look at the toy or animal?)",
    "Does your child get upset by everyday noises? (For example, Does your child scream or cry to noise such as a vacuum cleaner or loud music?)",
    "Does your child play pretend or make-believe? (For example, Pretend to drink from an empty cup, pretend to talk on a phone, or pretend to feed a doll or stuffed animal?)",
    "Does your child like climbing on things? (For example, Furniture, playground equipment, or stairs)",
    "Does your child make unusual finger movements near his or her eyes? (For example, Does your child wiggle his or her fingers close to his or her eyes?)",
    "Does your child point with one finger to ask for something or to get help? (For example, Pointing to a snack or toy that is out of reach)",
    "Does your child point with one finger to show you something interesting? (For example, Pointing to an airplane in the sky or a big truck in the road)",
    "When you smile at your child, does he or she smile back at you?",
    "Does your child show you things by bringing them to you or holding them up for you to see — not to get help, but just to share? (For example, Showing you a flower, a stuffed animal, or a toy truck)",
    "Does your child respond when you call his or her name? (For example, Does he or she look up, talk or babble, or stop what he or she is doing when you call his or her name?)",
  ];

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleQnaChange = (e) => {
    const { name, value } = e.target;
    setQna((prevQna) => ({
      ...prevQna,
      [name]: value,
    }));
  };

  const clearFileInput = (e) => {
    e?.preventDefault();
    setIsInputHidden(false);
    setFormData({
      ...formData,
      video: null,
    });
    setVideoPreview(null);
    if (videoInputRef?.current) {
      videoInputRef.current.value = "";
    }
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
        video.remove();
      };

      video.onerror = () => {
        toast.error("Error loading video file", { autoClose: 2000 });
        reject("Error loading video file");
        video.remove();
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoChange = async (e) => {
    const video = e.target.files[0];

    try {
      const duration = await getVideoDuration(video);

      if (duration > MAX_VIDEO_DURATION_SECONDS) {
        toast.error("Video duration exceeds 60 seconds limit.", {
          autoClose: 2000,
        });
        clearFileInput();
        return;
      }

      if (video.size / (1024 * 1024) > MAX_VIDEO_SIZE_MB) {
        toast.error("Video size exceeds 5MB.", { autoClose: 2000 });
        clearFileInput();
        return;
      }

      setFormData({
        ...formData,
        video,
      });

      setVideoPreview(URL.createObjectURL(video));
      setIsInputHidden(true);
      toast.success("Video uploaded", { autoClose: 2000 });
    } catch (error) {
      clearFileInput();
      toast.error("Unable to process video.", { autoClose: 2000 });
    }
  };

  const validateForm = async (e) => {
    e.preventDefault();

    const form = formRef.current;
    form.classList.add("was-validated");

    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value) {
        isValid = false;
      }

      if (field.type === "radio") {
        const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
        const isChecked = Array.from(radioGroup).some((radio) => radio.checked);
        if (!isChecked) {
          isValid = false;
        }
      }
    });

    if (isValid) {
      handleSendOtp();
    } else {
      toast.error("Please fill all the required fields", { autoClose: 2000 });
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };
  const handleSendOtp = async () => {
    const otpEmail = formData.parentEmail;
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.joywithlearning.com/api/jwl/send-otp",
        {
          otpEmail,
        }
      );
      if (response.data.success) {
        setLoading(false);
        setOtpSent(true);
        nextStep();
        toast.success(response.data.messaage, { autoClose: 2000 });
      } else {
        toast.error(response.data.message, { autoClose: 2000 });
        setLoading(false);
        setOtpSent(false);
      }
    } catch (error) {
      toast.error("Error sending otp", { autoClose: 2000 });
      setLoading(false);
      setOtpSent(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = formData.parentEmail;
    try {
      const response = await axios.post(
        "https://api.joywithlearning.com/api/jwl/verify-otp",
        { email: email, otp: otp }
      );
      if (response.data.success) {
        sessionStorage.setItem("token", response.data.token);
        toast.success(response.data.message, { autoClose: 2000 });
        handleSubmitForm();
      } else {
        setLoading(false);
        setVerified(false);
        toast.error(response.data.message, { autoClose: 2000 });
      }
    } catch (error) {
      setLoading(false);
      setVerified(false);
      toast.error("Error verifying OTP", { autoClose: 2000 });
    }
  };

  const handleSubmitForm = async () => {
    setLoading(true);
    const finalFormData = new FormData();

    Object.keys(formData).forEach((key) => {
      finalFormData.append(key, formData[key]);
    });

    finalFormData.append("checklist", JSON.stringify(qna));
    const headToken = sessionStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://api.joywithlearning.com/api/jwl/enquire",
        finalFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${headToken}`,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        setLoading(false);
        setVerified(true);
        setSubmitted(true);
        toast.success(response.data.message, { autoClose: 2000 });
      } else {
        setLoading(false);
        setVerified(false);
        setSubmitted(false);
        toast.error(response.data.message, { autoClose: 2000 });
      }
    } catch (error) {
      setLoading(false);
      setVerified(false);
      setSubmitted(false);
      toast.error("Error Submitting form", { autoClose: 2000 });
    }
  };

  return (
    <div className="enquire ">
      <div className="container py-4 uploadvidform mt-5 rounded-4 ">
        <h1 className="text-center mb-4 fw-bold">Enquiry Form</h1>
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1050 }}
        >
          <ToastContainer />
        </div>
        {!submitted && (
          <form className="needs-validation" noValidate ref={formRef}>
            {currentStep === 1 && (
              <div className="card mb-4">
                <div className="card-header">
                  <h2 className="mb-0">Personal Information</h2>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="childName" className="form-label ">
                        Child Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control border border-black border-1"
                        id="childName"
                        name="childName"
                        value={formData.childName || ""}
                        onChange={handleChange}
                        required
                        placeholder="Child Name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="childAge" className="form-label">
                        Childs Age <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control border border-black border-1"
                        id="childAge"
                        name="childAge"
                        value={formData.childAge || ""}
                        onChange={handleChange}
                        required
                        placeholder="Child Age"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Child Gender <span className="text-danger">*</span>
                      </label>
                      <div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input border border-black border-1"
                            type="radio"
                            name="childGender"
                            id="male"
                            value="male"
                            checked={formData.childGender === "male"}
                            onChange={handleChange}
                            required
                          />
                          <label className="form-check-label" htmlFor="male">
                            Male
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input border border-black border-1"
                            type="radio"
                            name="childGender"
                            id="female"
                            value="female"
                            checked={formData.childGender === "female"}
                            onChange={handleChange}
                            required
                          />
                          <label className="form-check-label" htmlFor="female">
                            Female
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="parentName" className="form-label">
                        Parent Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control border border-black border-1"
                        id="parentName"
                        name="parentName"
                        value={formData.parentName || ""}
                        onChange={handleChange}
                        required
                        placeholder="Parent Name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="parentEmail" className="form-label">
                        Parent Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control border border-black border-1"
                        id="parentEmail"
                        name="parentEmail"
                        value={formData.parentEmail || ""}
                        onChange={handleChange}
                        required
                        placeholder="Parent Email"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="parentPhone" className="form-label">
                        Parent Phone No. <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control border border-black border-1"
                        id="parentPhone"
                        name="parentPhoneNo"
                        value={formData.parentPhoneNo || ""}
                        onChange={handleChange}
                        required
                        placeholder="Parent Phone No."
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="preferredCenter" className="form-label">
                        Preferred Center <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select border border-black border-1"
                        id="preferredCenter"
                        name="preferredCenter"
                        value={formData.preferredCenter || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Center</option>
                        <option value="Barkathpura">Barkathpura</option>
                        <option value="Champapet">Champapet</option>
                        <option value="Nacharam">Nacharam</option>
                        <option value="Himayatnagar">Himayatnagar</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="card mb-4">
                <div className="card-header">
                  <h2 className="mb-0">Few things we want to know. . .</h2>
                </div>
                <div className="card-body">
                  {questions.map((q, i) => {
                    const [mainQuestion, example] = q.split(" (For example,");
                    return (
                      <div key={i} className="mb-3">
                        <label className="form-label d-block">
                          <strong>
                            {`Q${i + 1}: ${mainQuestion}`}{" "}
                            <span className="text-danger">*</span>
                          </strong>
                        </label>
                        {example && (
                          <small className="text-muted">
                            ( {example.trim().replace(/\)$/, "")} )
                          </small>
                        )}
                        <div className="mt-3">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input border border-black border-1"
                              type="radio"
                              name={`q${i + 1}`}
                              id={`q${i + 1}_yes`}
                              value="yes"
                              checked={qna[`q${i + 1}`] === "yes"}
                              onChange={handleQnaChange}
                              required
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`q${i + 1}_yes`}
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input border border-black border-1"
                              type="radio"
                              name={`q${i + 1}`}
                              id={`q${i + 1}_no`}
                              value="no"
                              checked={qna[`q${i + 1}`] === "no"}
                              onChange={handleQnaChange}
                              required
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`q${i + 1}_no`}
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="card mb-4">
                <div className="card-header">
                  <h2 className="mb-0">Video Upload</h2>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="videoUpload" className="form-label">
                      (Maximum Size : 5MB, Maximum Duration : 60 seconds){" "}
                      <span className="text-danger">*</span>
                    </label>
                    {!isInputHidden && (
                      <input
                        className="form-control border border-black border-1"
                        type="file"
                        ref={videoInputRef}
                        id="videoUpload"
                        accept="video/*"
                        onChange={handleVideoChange}
                        required
                      />
                    )}
                  </div>
                  {videoPreview && (
                    <div className="mb-3">
                      <h5>Video Preview</h5>
                      <video
                        ref={videoRef}
                        src={videoPreview}
                        controls
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      />
                      <div className="d-flex justify-content-start">
                        <button
                          onClick={clearFileInput}
                          className="btn btn-sm btn-outline-danger"
                        >
                          Clear Video Selection
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="form-check">
                    <input
                      className="form-check-input border border-black border-1"
                      type="checkbox"
                      id="videoCall"
                      name="videoCall"
                      checked={formData.videoCall || false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="videoCall">
                      Opt for video call consultation
                    </label>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 4 && otpSent && !verified && (
              <div className="card mb-4">
                <div className="card-header">
                  <h2 className="mb-0">OTP Verification</h2>
                </div>
                <div className="card-body">
                  <div>
                    <div className="mb-3">
                      <label htmlFor="otpInput" className="form-label">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="otpInput"
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <p className="text-danger mt-2">
                      Note: OTP is valid for 5 minutes only
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={prevStep}
                >
                  Back
                </button>
              )}
              {currentStep < 3 && (
                <button
                  type="button"
                  className="btn btn-info text-white ms-auto"
                  onClick={nextStep}
                >
                  Next
                </button>
              )}
              {currentStep === 3 && !loading && (
                <>
                  <button
                    type="button"
                    className="btn btn-info border btn-outline-success text-white"
                    onClick={validateForm}
                  >
                    Send OTP To Email
                  </button>
                </>
              )}
              {currentStep === 4 && otpSent && !loading && (
                <>
                  <button
                    type="button"
                    className="btn btn-info border btn-outline-success text-white"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP and Submit
                  </button>
                </>
              )}
              {(!otpSent || (otpSent && !verified)) && loading && <Loader />}
            </div>
          </form>
        )}
        {otpSent && verified && submitted && (
          <div className="card p-4">
            <div className="card-body bg-white">
              <h3 className="card-title text-center ">
                Details and video uploaded successfully. An enquiry has been
                raised. Our admin will contact you shortly.
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enquire;
