import axios from "axios";
import { useState } from "react";
import "./UploadVid.css";
import Loader from "./Loader";
import {toast , ToastContainer} from "react-toastify"

const UploadVid = () => {
  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    childGender: "",
    parentName: "",
    parentEmail: "",
    parentPhoneNo: "",
    alternateEmail: "",
    alternatePhoneNo: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loader, setLoader] = useState(false);
  const [radio, setRadio] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange = (e) => {
    setRadio(e.target.value);
    handleChange(e);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const storedData = JSON.parse(sessionStorage.getItem("form1Data"));
    // const otpEmail = storedData.parentEmail;
    const email = storedData.parentEmail;

    try {
      const response = await axios.post(
        "https://jwlgamesbackend.vercel.app/api/jwl/verify-otp",
        { email, otp },
        
      );
      setLoader(false);
      if (response.data.success) {
        sessionStorage.setItem("token", response.data.token);
        setStep(3); // Move to video upload step
      } else {
        toast.error("Error submitting otpForm");
      }
    } catch (error) {
      toast.error("Error submitting otpForm");
      setLoader(false);
    }
  };

  const handleVideoFormSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const video = e.target.uploadvideo.files[0];
    const storedData = JSON.parse(sessionStorage.getItem("form1Data"));
    const childName = storedData.childName
    const childAge = storedData.childAge
    const childGender = storedData.childGender
    const parentName = storedData.parentName
    const parentEmail = storedData.parentEmail
    const parentPhoneNo = storedData.parentPhoneNo
    const alternateEmail = storedData.alternateEmail
    const alternatePhoneNo = storedData.alternatePhoneNo
    
    const formData = new FormData();
    formData.append("childName",childName)
    formData.append("childAge",childAge)
    formData.append("childGender",childGender)
    formData.append("parentName",parentName)
    formData.append("parentEmail",parentEmail)
    formData.append("parentPhoneNo",parentPhoneNo)
    formData.append("alternateEmail",alternateEmail)
    formData.append("alternatePhoneNo",alternatePhoneNo)
    formData.append("video", video);
    const headToken = sessionStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://jwlgamesbackend.vercel.app/api/jwl/enquire",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${headToken}`,
          },
        }
      );
      setLoader(false);
      if (response.data.success) {
        setStep(4); // Move to success message step
      } else {
        toast.error("Error submitting video form");
      }
    } catch (error) {
      toast.error("Error submitting video form");
      setLoader(false);
    }
  };

  const handleForm1Submit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const dataToStore = {
      ...formData,
      alternateEmail: formData.alternateEmail || "",
      alternatePhoneNo: formData.alternatePhoneNo || "",
    };
    sessionStorage.setItem("form1Data", JSON.stringify(dataToStore));

    const otpEmail = dataToStore.parentEmail;

    try {
      const response = await axios.post("https://jwlgamesbackend.vercel.app/api/jwl/send-otp", {
        otpEmail,
      });
      setLoader(false);
      if (response.data.success) {
        setStep(2); // Move to OTP step
      } else {
        toast.error("Error submitting form");
      }
    } catch (error) {
      toast.error("Error submitting form");
      setLoader(false);
    }
  };

  return (
    <div className="upload-vid">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            {step === 1 && (
              <form
                className="border uploadvidform rounded-4 m-auto p-4 bg-white"
                onSubmit={handleForm1Submit}
              >
                <h1 className="text-center fw-light mb-4">Fill the Details</h1>
                <div className="mb-3 form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="childName"
                    name="childName"
                    value={formData.childName}
                    onChange={handleChange}
                    placeholder="Enter child's name"
                    required
                  />
                  <label htmlFor="childName">
                    Child Name <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="mb-3 form-floating">
                  <input
                    type="number"
                    className="form-control"
                    id="childAge"
                    name="childAge"
                    value={formData.childAge}
                    onChange={handleChange}
                    placeholder="Enter child's age"
                    required
                  />
                  <label htmlFor="childAge">
                    Child Age <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="mb-1 form-floating d-flex flex-wrap ms-1 gap-3">
                  <p className="ms-1">Child Gender :</p>
                  <div className="form-check">
                    <input
                      className="form-check-input border-dark"
                      type="radio"
                      name="childGender"
                      value="male"
                      checked={radio === "male"}
                      onChange={handleRadioChange}
                    />
                    <label className="form-check-label">Male</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input border-dark"
                      type="radio"
                      name="childGender"
                      value="female"
                      checked={radio === "female"}
                      onChange={handleRadioChange}
                    />
                    <label className="form-check-label">Female</label>
                  </div>
                </div>
                <div className="mb-3 form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="parentName"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    placeholder="Enter parent's name"
                    required
                  />
                  <label htmlFor="parentName">
                    Parent Name <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="mb-3 form-floating">
                  <input
                    type="email"
                    className="form-control"
                    id="parentEmail"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    placeholder="Enter parent's email"
                    required
                  />
                  <label htmlFor="parentEmail">
                    Parent Email <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="mb-3 form-floating">
                  <input
                    type="tel"
                    className="form-control"
                    id="parentPhoneNo"
                    name="parentPhoneNo"
                    value={formData.parentPhoneNo}
                    onChange={handleChange}
                    placeholder="Enter parent's phone number"
                    required
                  />
                  <label htmlFor="parentPhoneNo">
                    Parent Phone No <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="mb-3 form-floating">
                  <input
                    type="email"
                    className="form-control"
                    id="alternateEmail"
                    name="alternateEmail"
                    value={formData.alternateEmail}
                    onChange={handleChange}
                    placeholder="Enter alternate email"
                  />
                  <label htmlFor="alternateEmail">Alternate Email</label>
                </div>
                <div className="mb-3 form-floating">
                  <input
                    type="tel"
                    className="form-control"
                    id="alternatePhoneNo"
                    name="alternatePhoneNo"
                    value={formData.alternatePhoneNo}
                    onChange={handleChange}
                    placeholder="Enter alternate phone number"
                  />
                  <label htmlFor="alternatePhoneNo">Alternate Phone No</label>
                </div>
                <div className="text-center">
                  {!loader ? (
                    <button type="submit" className="btn btn-primary w-100 p-2">
                      Submit
                    </button>
                  ) : (
                    <Loader />
                  )}
                </div>
                <p className="text-center text-danger mt-3">
                  <i>
                    <strong>Note:</strong> After filling this form, an OTP is
                    sent to your email which is used for verification. After
                    verifying, you can upload the video of your child.
                  </i>
                </p>
              </form>
            )}

            {step === 2 && (
              <form
                className="border uploadvidform rounded-4 m-auto p-4 bg-white"
                onSubmit={handleOtpSubmit}
              >
                <h1 className="text-center fw-light mb-4">
                  Enter the OTP sent to your primary mail
                </h1>
                <div className="mb-3 form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter OTP"
                    required
                  />
                  <label htmlFor="otp">
                    OTP <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="text-center">
                  {!loader ? (
                    <button type="submit" className="btn btn-primary w-100 p-2">
                      Submit
                    </button>
                  ) : (
                    <Loader />
                  )}
                </div>
                <p className="text-center text-danger mt-3 fst-italic">
                  <strong>Note:</strong> The OTP is only valid for{" "}
                  <strong>5</strong> minutes !!
                </p>
              </form>
            )}

            {step === 3 && (
              <form
                className="border uploadvidform rounded-4 m-auto p-4 bg-white"
                onSubmit={handleVideoFormSubmit}
              >
                <h1 className="text-center fw-light mb-4">
                  OTP verification is done. Upload your video here
                </h1>
                <div className="mb-3 form-floating">
                  <input
                    type="file"
                    className="form-control"
                    id="uploadvideo"
                    name="uploadvideo"
                    placeholder="Upload Video"
                    required
                  />
                </div>
                <div className="text-center">
                  {!loader ? (
                    <button type="submit" className="btn btn-primary w-100 p-2">
                      Submit
                    </button>
                  ) : (
                    <Loader />
                  )}
                </div>
                <p className="text-center text-danger mt-3 fst-italic">
                  <strong>Note:</strong> The video size should be less than{" "}
                  <strong>10</strong> MB and the max duration of the video is{" "}
                  <strong>60</strong> seconds !!
                </p>
              </form>
            )}

            {step === 4 && (
              <div className="border uploadvidform rounded-4 m-auto p-4 bg-white">
                <h3 className="text-center fw-light mb-4">
                  Details and video uploaded successfully. An enquiry has been
                  raised. Our admin will contact you shortly.
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadVid;
