// SplashScreen.js
import React, { useEffect } from 'react';
import './SplashScreen.css';
import logo from './assets/images/logo.png';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Show splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <img src={logo} alt="KIDGAGE" className="splash-logo" />
    </div>
  );
};

export default SplashScreen;
