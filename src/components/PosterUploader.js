import React from "react";
import { useNavigate } from "react-router-dom";
import "./PosterUploader.css";
import deviceimg from './assets/images/devices.png';
import chatbot from './assets/images/chatbot.png';

const PosterUploader = () => {
  const navigate = useNavigate();

  const handleChatbotClick = () => {
    navigate('/chatbotpage');
  };

  return (
    <div className="poster-uploader">
      <div className="poster-uploader-content">
        <h1 className="poster-uploader-title">
          One platform for all your activities
        </h1>
        <div className="contents-container">
          <div className="poster-uploader-info">
            <div className="poster-uploader-logo">
              <img
                src={chatbot}
                alt="Logo"
                className="poster-uploader-logo-image"
                onClick={handleChatbotClick}
              />
            </div>
            <div className="poster-uploader-text">
              <h2 className="poster-uploader-subtitle">
                Are you an activity provider?
              </h2>
              <h3 className="poster-uploader-subheading">List with us</h3>
              <p className="poster-uploader-description">
                Get more visibility, manage your listings and business all on one
                simple platform.
              </p>
              <button className="poster-uploader-button">Partner With Us</button>
            </div>
          </div>
          <div className="poster-uploader-image">
            <img
              src={deviceimg}
              alt="Device Screenshot"
              className="poster-uploader-device-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterUploader;
