import axios from 'axios';
import ThankYouModal from './ThankYouModal';
import { useState } from 'react';
import "./ContactUs.css"

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: ''
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.error('Please enter a valid email address.');
      return;
    }

    const apiUrl = 'https://your-api-endpoint.com/submitFeedback';

    try {
      const response = await axios.post(apiUrl, formData);
      console.log('Form data sent successfully:', response.data);

      setShowModal(true);
      setFormData({
        name: '',
        email: '',
        feedback: ''
      });
    } catch (error) {
      console.error('Error sending form data:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="contact-us">
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-lg-8">
            <form className="border contactusform m-auto p-4 bg-white" onSubmit={handleSubmit}>
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
                <label htmlFor="name">Name<span className="text-danger"> *</span></label>
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
                <label htmlFor="email">Email address<span className="text-danger"> *</span></label>
              </div>
              <div className="mb-3 form-floating">
                <label htmlFor="feedback">Feedback<span className="text-danger"> *</span></label>
                <textarea
                  className="form-control"
                  id="feedback"
                  name="feedback"
                  rows="8" // Adjust the number of rows here
                  value={formData.feedback}
                  onChange={handleChange}
                  placeholder="Enter your feedback"
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary w-100 p-2">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ThankYouModal show={showModal} onClose={closeModal} />
    </div>
  );
};

export default ContactUs;
