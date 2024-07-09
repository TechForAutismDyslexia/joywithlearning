// KnowMore.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./KnowMore.css";

const KnowMore = () => {
  const videoUrls = [
    "https://www.youtube.com/embed/ciyvRFyt4as",
    "https://www.youtube.com/embed/pu_jOLuinNs",
    "https://www.youtube.com/embed/FgJr_L9ALm4",
  ];

  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [symptomStatus, setSymptomStatus] = useState(null); // State to track user selection

  const prevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSymptomStatus(null); // Reset selection when changing videos
    }
  };

  const nextVideo = () => {
    if (currentIndex < videoUrls.length - 1 && symptomStatus !== null) {
      setCurrentIndex(currentIndex + 1);
      setSymptomStatus(null); // Reset selection when changing videos
    }
  };

  const handleRadioChange = (e) => {
    setSymptomStatus(e.target.value);
  };

  const navigateToForm = () => {
    navigate("/knowmoreform");
  };

  return (
    <div className="knowmore-outer">
      <div className="container py-3 border border-black rounded-4">
        <div className="video-container border border-lg border-black rounded-4">
          <iframe
            src={videoUrls[currentIndex]}
            title={`Video ${currentIndex + 1}`}
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="text-center fst-italic">
        Note: Kindly ensure that all videos are viewed until completion. Thank
        you for your attention to detail.
      </div>
    </div>
  );
};

export default KnowMore;
