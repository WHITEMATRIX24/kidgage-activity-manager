import React from "react";
import "./Tagline.css";

const Tagline = () => {
  return (
    <div className="tagline">
      <div className="tagline-item">
        <span className="tagline-icon verified">✓</span>
        <h3 className="tagline-title">Verified</h3>
        <p className="tagline-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget
          nunc vitae felis
        </p>
      </div>
      <div className="tagline-item">
        <span className="tagline-icon easy">👍</span>
        <h3 className="tagline-title">Easy</h3>
        <p className="tagline-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget
          nunc vitae felis
        </p>
      </div>
      <div className="tagline-item">
        <span className="tagline-icon safe">↗</span>
        <h3 className="tagline-title">Safe</h3>
        <p className="tagline-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget
          nunc vitae felis
        </p>
      </div>
    </div>
  );
};

export default Tagline;
