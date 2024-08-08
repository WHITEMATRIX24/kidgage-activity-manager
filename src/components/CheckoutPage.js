import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { attendees, totalAmount, courseId, courseName, startDate, endDate, selectedSlot } = location.state || {};

  const handleGuestCheckout = () => {
    navigate('/checkoutguest', { 
      state: { 
        attendees, 
        totalAmount, 
        courseId, 
        courseName,
        startDate,
        endDate,
        selectedSlot
      } 
    });
  };

  return (
    <div className="wrapper">
      <div className="checkout-container">
        <div className="summary-container">
          <p>Course: {courseName}</p>
          <p>Start Date: {new Date(startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(endDate).toLocaleDateString()}</p>
          <p>Selected Slot: {selectedSlot}</p>
          <p>Number of Attendees: {attendees}</p>
          <p>Total Amount: QAR {totalAmount}/-</p>
        </div>
        <div className="options-container">
          <button className="guest-button" onClick={handleGuestCheckout}>Checkout as guest</button>
          <p>or</p>
          <Link to="/personal-signup">
            <button className="account-button">Create an Account</button>
          </Link>
          <p className="login-link">
            Already have an account? <Link to="/personal-signup">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
