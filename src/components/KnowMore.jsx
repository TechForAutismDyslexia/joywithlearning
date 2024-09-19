import { useState } from "react";
import "./KnowMore.css";
import Loader from "./Loader";
import axios from "axios";
import { toast } from "react-toastify";

const KnowMore = () => {
  const videoUrls = [
    "https://www.youtube.com/embed/ciyvRFyt4as",
    "https://www.youtube.com/embed/pu_jOLuinNs",
    "https://www.youtube.com/embed/FgJr_L9ALm4",
  ];

  const [loader, setLoader] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    parentName: "",
    parentEmail: "",
    parentPhoneNo: "",
    alternateEmail: "",
    alternatePhoneNo: "",
    childGender: "",
    preferredCenter: "",
    video1: "",
    video2: "",
    video3: "",
  });
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      const response = await axios.post(
        "https://jwlgamesbackend.vercel.app/api/jwl/send-otp",
        {
          otpEmail,
        }
      );
      setLoader(false);
      if (response.data.success) {
        setStep(3); // Move to OTP step
      } else {
        toast.error("Error submitting form");
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const storedData = JSON.parse(sessionStorage.getItem("form1Data"));
    const email = storedData.parentEmail;
    try {
      const response = await axios.post(
        "https://jwlgamesbackend.vercel.app/api/jwl/verify-otp",
        { email: email, otp: otp }
      );
      if (response.data.success) {
        const headToken = response.data.token;
        try {
          const response = await axios.post(
            "https://jwlgamesbackend.vercel.app/api/jwl/know-more",
            storedData,
            {
              headers: {
                Authorization: `${headToken}`,
              },
            }
          );
          setLoader(false);
          if (response.data.success) {
            setStep(4); // Move to success message step
          } else {
            toast.error("Error submitting form");
          }
        } catch (error) {
          toast.error("Error saving data");
          setLoader(false);
        }
        setLoader(false);
      } else {
        setLoader(false);
        toast.error("Error submitting otp, try again");
      }
    } catch (error) {
      toast.error("Error submitting otp");
      setLoader(false);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [symptomStatus, setSymptomStatus] = useState(null); // State to track user selection
  const [gender, setGender] = useState(null);

  const nextVideo = () => {
    if (currentIndex < videoUrls.length && symptomStatus !== null) {
      const videoKey = `video${currentIndex + 1}`;
      setFormData({ ...formData, [videoKey]: symptomStatus });
      setCurrentIndex(currentIndex + 1);
      setSymptomStatus(null); // Reset selection when changing videos
      if (currentIndex === videoUrls.length - 1) {
        setStep(2);
      }
    }
  };

  const handleRadioChange = (e) => {
    setSymptomStatus(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    handleChange(e);
  };

  return (
    <div className="knowmore-outer">
      {step === 1 && currentIndex < videoUrls.length ? (
        <div className="container  knowmoreone bg-white rounded-4">
          <div className="video-container border border-lg border-white  rounded-4">
            <div className="d-flex justify-content-center mt-5 align-items-center">
              <Loader />
              </div>
              <iframe
                src={videoUrls[currentIndex]}
                title={`Video ${currentIndex + 1}`}
                allowFullScreen
              ></iframe>
          </div>
          <div className="radio-buttons my-3">
            <div className="form-check">
              <input
                className="form-check-input border-dark"
                type="radio"
                name="symptomStatus"
                value="yes"
                checked={symptomStatus === "yes"}
                onChange={handleRadioChange}
              />
              <label className="form-check-label">Yes</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input border-dark"
                type="radio"
                name="symptomStatus"
                value="no"
                checked={symptomStatus === "no"}
                onChange={handleRadioChange}
              />
              <label className="form-check-label">No</label>
            </div>
          </div>
          <div className="text-center">
            <button
              className="btn btn-primary"
              onClick={nextVideo}
              disabled={symptomStatus === null}
            >
              Next Video
            </button>
          </div>
          <p className="text-center text-danger mt-3">
            <i>
              <strong>Note : </strong>Kindly ensure that all videos are viewed
              until completion. Thank you for your attention to detail.
            </i>
          </p>
        </div>
      ) : step === 2 ? (
        <div className="form-container d-flex justify-content-center align-items-center">
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
            <div className="mb-1 form-floating d-flex ms-1 gap-3 flex-wrap">
              <p className="ms-1">Child Gender :</p>
              <div className="form-check">
                <input
                  className="form-check-input border-dark"
                  type="radio"
                  name="childGender"
                  value="male"
                  checked={gender === "male"}
                  onChange={handleGenderChange}
                />
                <label className="form-check-label">Male</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input border-dark"
                  type="radio"
                  name="childGender"
                  value="female"
                  checked={gender === "female"}
                  onChange={handleGenderChange}
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
            <select className="form-select mb-3" onChange={handleChange} name="preferredCentre">
                  <option selected>Preferred Centre</option>
                  <option value="Barkathpura">Barkathpura</option>
                  <option value="Champapet">Champapet</option>
                  <option value="Himayathnagar">Himayathnagar</option>
                  <option value="Nacharam">Nacharam</option>
            </select>
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
                <strong>Note:</strong> After filling this form, an OTP is sent
                to your email which is used for verification. After verifying,
                The details will be submitted.
              </i>
            </p>
          </form>
        </div>
      ) : step === 3 ? (
        <div className="otp-container d-flex justify-content-center align-items-center">
          <form
            className="border otpform rounded-4 m-auto p-4 bg-white"
            onSubmit={handleOtpSubmit}
          >
            <h1 className="text-center fw-light mb-4">Enter OTP</h1>
            <div className="mb-3 form-floating">
              <input
                type="text"
                className="form-control"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
                  Submit OTP
                </button>
              ) : (
                <Loader />
              )}
            </div>
            <p className="text-center text-danger mt-3">
              <i>
                <strong>Note:</strong> Please enter the OTP sent to your email.
              </i>
            </p>
          </form>
        </div>
      ) : step === 4 ? (
        <div className="confirmation-container d-flex justify-content-center align-items-center">
          <div className="border confirmation rounded-4 m-auto p-4 bg-white">
            {/* <h1 className="text-center fw-light mb-4">
              OTP Verified Successfully
            </h1> */}
            <h2 className="text-center">
              Form details are submitted. Our admin will contact you shortly.
            </h2>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default KnowMore;
