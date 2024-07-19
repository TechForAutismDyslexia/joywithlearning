import axios from "axios";
import { useState } from "react";
import "./ContactUs.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [step, setStep] = useState(1);
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);
      const response = await axios.post(
        "https://jwlgamesbackend.vercel.app/api/jwl/feedback",
        formData
      );
      if (response.data.success) {
        setLoader(false);
        // toast.success(response.data.message)
        setStep(2);
      } else {
        setLoader(false);
        toast.error(response.data.message);
      }
      setFormData({
        name: "",
        email: "",
        feedback: "",
      });
    } catch (error) {
      setLoader(false);
      toast.error("Error Saving Feedback");
    }
  };

  return (
    <div className="contact-us">
      <ToastContainer />
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-lg-8">
            <form
              className="border contactusform m-auto p-4 bg-white"
              onSubmit={handleSubmit}
            >
              {step == 1 && (
                <div>
                  <h1 className="text-center fw-light mb-4">
                    Help Us By Providing Your Valuable Feedback
                  </h1>
                  <div className="mb-3 form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                    <label htmlFor="name">
                      Name<span className="text-danger"> *</span>
                    </label>
                  </div>
                  <div className="mb-3 form-floating">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                    <label htmlFor="email">
                      Email address<span className="text-danger"> *</span>
                    </label>
                  </div>
                  <div className="mb-3 form-floating">
                    <textarea
                      className="form-control"
                      id="feedback"
                      name="feedback"
                      value={formData.feedback}
                      placeholder="Leave a comment here"
                      onChange={handleChange}
                      required
                      style={{
                        height: "150px",
                      }}
                    ></textarea>
                    <label htmlFor="feedback">
                      Feedback<span className="text-danger"> *</span>
                    </label>
                  </div>
                  <div className="text-center">
                    {!loader && (
                      <button
                        type="submit"
                        className="btn btn-primary w-100 p-2"
                      >
                        Submit
                      </button>
                    )}
                    {loader && <Loader />}
                  </div>
                </div>
              )}
              {step == 2 && (
                <h1 className="text-center fw-light p-3">
                  Thank you for your feedback, We will contact you shortly
                </h1>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
