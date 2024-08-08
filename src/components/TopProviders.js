import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./TopProviders.css";
import badge from './assets/images/badge1.png';

const TopProviders = () => {
  const [position, setPosition] = useState(0);
  const [providers, setProviders] = useState([]);
  const [imageWidth, setImageWidth] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [mounted, setMounted] = useState(false); // Track if the component has mounted
  const logoSliderRef = useRef(null);

  useEffect(() => {
    // Fetch the providers from the backend
    const fetchProviders = async () => {
      try {
        const response = await axios.get('https://kidgage-adminbackend.onrender.com/api/users/all'); // Adjust the endpoint if necessary
        setProviders(response.data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    if (logoSliderRef.current) {
      // Calculate image width and slider width after providers are set
      const slides = logoSliderRef.current.querySelectorAll('.logo-slide');
      if (slides.length > 0) {
        setImageWidth(slides[0].offsetWidth);
        const numSlides = Math.max(providers.length - 4, 0) -0.5; // Number of slides based on original set minus 4 plus half slide for the effect
        setSliderWidth(numSlides * slides[0].offsetWidth); // Total width of the slider based on slides
        setMounted(true); // Set mounted to true after calculating image width
      }
    }
  }, [providers]);

  useEffect(() => {
    if (mounted) {
      setPosition(-imageWidth / 2); // Initially set position to half the width of a slide to the left
    }
  }, [mounted, imageWidth]);

  useEffect(() => {
    let interval;
    if (providers.length > 4) {
      interval = setInterval(() => {
        setPosition((prevPosition) => {
          const slideWidth = imageWidth || 0;
          const newPosition = prevPosition - slideWidth;
          if (Math.abs(newPosition) >= sliderWidth) {
            return -imageWidth / 2; // Reset position to start for seamless effect, initially shifted to half a slide
          }
          return newPosition;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [providers.length, imageWidth, sliderWidth]);

  // Calculate the number of dots based on the total number of images minus 4 plus 1
  const activeDot = Math.floor(Math.abs(position + imageWidth / 2) / (imageWidth || 1)); // Adjust activeDot calculation
  const dotCount = Math.max(providers.length - 4, 0) -1; // Number of dots based on original set minus 4 plus 1

  return (
    <div className="top-prov-body">
      <div className="top-providers">
        <h2>Top Providers</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas massa
          lacus.
        </p>
        <div className="logo-container">
          <div
            className="logo-slider"
            style={{ transform: `translateX(${position}px)` }}
            ref={logoSliderRef}
          >
            {/* Duplicate images for continuous scroll effect */}
            {[...providers, ...providers].map((provider, index) => (
              <div key={index} className="logo-slide">
                {provider.logo && <img src={`data:image/jpeg;base64,${provider.logo}`} alt={provider.username} />}
              </div>
            ))}
          </div>
        </div>
        {providers.length > 4 && dotCount > 0 && (
          <div className="provider-dots">
            {[...Array(dotCount)].map((_, index) => (
              <span
                key={index}
                className={`provider-dot ${index === activeDot ? "active" : ""}`}
              ></span>
            ))}
          </div>
        )}
      </div>
      <div className="badge-image">
        <img alt="badge" src={badge}></img>
      </div>
    </div>
  );
};

export default TopProviders;
