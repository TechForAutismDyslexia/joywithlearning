import axios from "axios";
import { useState, useRef } from "react";
import "./cssfiles/UploadVid.css";
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
  // eslint-disable-next-line no-unused-vars
  const [videoError, setVideoError] = useState("");
  const formRef = useRef(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const videoRef = useRef(null);
  const videoInputRef = useRef(null);

  const MAX_VIDEO_SIZE_MB = 5;
  const MAX_VIDEO_DURATION_SECONDS = 60;

  const questions = [
    "If you point at something across the room, does your child look at it? (For example, if you point at a toy or an animal, does your child look at the toy or animal?)",
    "Does your child get upset by everyday noises? (For example, does your child scream or cry to noise such as a vacuum cleaner or loud music?)",
    "Does your child play pretend or make-believe? (For example, pretend to drink from an empty cup, pretend to talk on a phone, or pretend to feed a doll or stuffed animal?)",
    "Does your child like climbing on things? (For example, furniture, playground equipment, or stairs)",
    "Does your child make unusual finger movements near his or her eyes? (For example, does your child wiggle his or her fingers close to his or her eyes?)",
    "Does your child point with one finger to ask for something or to get help? (For example, pointing to a snack or toy that is out of reach)",
    "Does your child point with one finger to show you something interesting? (For example, pointing to an airplane in the sky or a big truck in the road)",
    "Is your child interested in other children? (For example, does your child watch other children, smile at them, or go to them?)",
    "Does your child show you things by bringing them to you or holding them up for you to see — not to get help, but just to share? (For example, showing you a flower, a stuffed animal, or a toy truck)",
    "Does your child respond when you call his or her name? (For example, does he or she look up, talk or babble, or stop what he or she is doing when you call his or her name?)",
  ];

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
    e.preventDefault();
    setVideoPreview(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };
  const handleVideoChange = (e) => {
    setVideoError("");
    const video = e.target.files[0];
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.onloadedmetadata = function () {
      window.URL.revokeObjectURL(vid.src);
      if (vid.duration > MAX_VIDEO_DURATION_SECONDS) {
        toast.error("Video duration exceeds 60 seconds limit.");
        clearFileInput();
        return;
      } else if (vid.size > MAX_VIDEO_SIZE_MB) {
        toast.error("Video size exceeds 5MB.");
        clearFileInput();
        return;
      }
      setFormData({
        ...formData,
        video,
      });
      setVideoPreview(URL.createObjectURL(video));
      toast.success("Video uploaded");
    };

    vid.src = URL.createObjectURL(video);
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => {
        reject("Error loading video file");
      };

      video.src = URL.createObjectURL(file);
    });
  };

  // Your existing validateForm function, now using getVideoDuration
  const validateForm = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    form.classList.add("was-validated");

    let errorMessage = "";

    // Check if all required fields are filled
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value) {
        isValid = false;
      }

      // Special check for radio buttons
      if (field.type === "radio") {
        const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
        const isChecked = Array.from(radioGroup).some((radio) => radio.checked);
        if (!isChecked) {
          isValid = false;
        }
      }
    });

    // Video validation
    const videoInput = form.querySelector("#videoUpload");
    if (!videoInput.files.length) {
      isValid = false;
      errorMessage = "Please upload a video.";
    } else {
      const videoFile = videoInput.files[0];

      // Check file size
      const fileSizeMB = videoFile.size / (1024 * 1024);
      if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
        isValid = false;
        errorMessage = `Video size must be less than ${MAX_VIDEO_SIZE_MB}MB. Current size: ${fileSizeMB.toFixed(
          2
        )}MB`;
      }

      // Check video duration
      try {
        const duration = await getVideoDuration(videoFile);
        if (duration > MAX_VIDEO_DURATION_SECONDS) {
          isValid = false;
          errorMessage = `Video duration must be less than ${MAX_VIDEO_DURATION_SECONDS} seconds. Current duration: ${duration.toFixed(
            1
          )} seconds`;
        }
      } catch (error) {
        isValid = false;
        errorMessage = "Error checking video duration. Please try again.";
        console.error("Error checking video duration:", error);
      }
    }

    if (isValid) {
      handleSendOtp();
    } else {
      if (errorMessage) {
        setVideoError(errorMessage);
      }
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
        "https://jwlgamesbackend.vercel.app/api/jwl/send-otp",
        {
          otpEmail,
        }
      );
      if (response.data.success) {
        setLoading(false);
        setOtpSent(true);
        toast.success(response.data.messaage);
      } else {
        toast.error(response.data.message);
        setLoading(false);
        setOtpSent(false);
      }
    } catch (error) {
      toast.error("Error sending otp");
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
        "https://jwlgamesbackend.vercel.app/api/jwl/verify-otp",
        { email: email, otp: otp }
      );
      if (response.data.success) {
        sessionStorage.setItem("token", response.data.token);
        toast.success(response.data.message);
        handleSubmitForm();
      } else {
        setLoading(false);
        setVerified(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setVerified(false);
      toast.error("Error verifying OTP");
    }
  };

  const handleSubmitForm = async () => {
    setLoading(true);
    const finalFormData = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      finalFormData.append(key, formData[key]);
    });

    // Append checklist
    finalFormData.append("checklist", JSON.stringify(qna));
    const headToken = sessionStorage.getItem("token");
    try {
      const response = await axios.post(
        // "http://localhost:4000/api/jwl/enquire",
        "https://jwlgamesbackend.vercel.app/api/jwl/enquire",
        finalFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${headToken}`,
          },
        }
      );
      if (response.data.success) {
        setLoading(false);
        setVerified(true);
        setSubmitted(true);
        toast.success(response.data.message);
      } else {
        setLoading(false);
        setVerified(false);
        setSubmitted(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setVerified(false);
      setSubmitted(false);
      toast.error("Error Submitting form");
    }
  };

  return (
    <div className="upload-vid">
      <div className="container py-4 uploadvidform mt-5 rounded-4 bg-white">
        <h1 className="text-center mb-4 fw-bold">Enquiry Form</h1>
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1050 }}
        >
          <ToastContainer />
        </div>
        {!submitted && (
          <form className="needs-validation" noValidate ref={formRef}>
            <div className="card mb-4">
              <div className="card-header">
                <h2 className="mb-0">Personal Information</h2>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="childName" className="form-label ">
                      Child Name
                    </label>
                    <input
                      type="text"
                      className="form-control border border-black border-1"
                      id="childName"
                      name="childName"
                      onChange={handleChange}
                      required
                      placeholder="Child Name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="childAge" className="form-label">
                      Childs Age
                    </label>
                    <input
                      type="number"
                      className="form-control border border-black border-1"
                      id="childAge"
                      name="childAge"
                      onChange={handleChange}
                      required
                      placeholder="Child Age"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Childs Gender</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input border border-black border-1"
                          type="radio"
                          name="childGender"
                          id="male"
                          value="male"
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
                      Parent Name
                    </label>
                    <input
                      type="text"
                      className="form-control border border-black border-1"
                      id="parentName"
                      name="parentName"
                      onChange={handleChange}
                      required
                      placeholder="Parent Name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="parentEmail" className="form-label">
                      Parent Email
                    </label>
                    <input
                      type="email"
                      className="form-control border border-black border-1"
                      id="parentEmail"
                      name="parentEmail"
                      onChange={handleChange}
                      required
                      placeholder="Parent Email"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="parentPhone" className="form-label">
                      Parent Phone No.
                    </label>
                    <input
                      type="tel"
                      className="form-control border border-black border-1"
                      id="parentPhone"
                      name="parentPhoneNo"
                      onChange={handleChange}
                      required
                      placeholder="Parent Phone No."
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="preferredCenter" className="form-label">
                      Preferred Center
                    </label>
                    <select
                      className="form-select border border-black border-1"
                      id="preferredCenter"
                      name="preferredCenter"
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

            <div className="card mb-4">
              <div className="card-header">
                <h2 className="mb-0">Questionnaire</h2>
              </div>
              <div className="card-body">
                {questions.map((q, i) => (
                  <div key={i} className="mb-3">
                    <label className="form-label">{`Q${i + 1}: ${q}`}</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input border border-black border-1"
                          type="radio"
                          name={`q${i + 1}`}
                          id={`q${i + 1}_yes`}
                          value="yes"
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
                ))}
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h2 className="mb-0">Video Upload</h2>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="videoUpload" className="form-label">
                    Upload Video (Max 5MB, 60 seconds)
                  </label>
                  <input
                    className="form-control border border-black border-1"
                    type="file"
                    ref={videoInputRef}
                    id="videoUpload"
                    accept="video/*"
                    onChange={handleVideoChange}
                    required
                  />
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
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="videoCall">
                    Opt for video call consultation
                  </label>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h2 className="mb-0">OTP Verification</h2>
              </div>
              <div className="card-body">
                {!otpSent && !loading && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={validateForm}
                  >
                    Send OTP to Email
                  </button>
                )}
                {!otpSent && loading && <Loader />}
                {otpSent && !verified && !loading && (
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
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP and Submit
                    </button>
                    <p className="text-danger mt-2">
                      Note: OTP is valid for 5 minutes only
                    </p>
                  </div>
                )}
                {otpSent && !verified && loading && <Loader />}
              </div>
            </div>
          </form>
        )}
        {otpSent && verified && submitted && (
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center">
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
