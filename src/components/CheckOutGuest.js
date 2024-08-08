import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CheckOutGuest.css';

const CheckOutGuest = () => {
  const location = useLocation();
  const { attendees = 0, totalAmount = 0, courseId = '', courseName = '', startDate, endDate, selectedSlot } = location.state || {};

  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    email: '',
    phoneNumber: ''
  });

  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handlePopupYes = async () => {
    try {
      // Post data to the backend
      const response = await fetch('http://localhost:5000/api/personal/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          firstName: formData.fName,
          lastName: formData.lName,
        }),
      });
      const parentEmail=formData.email;
      if (response.ok) {
        // Navigate to the AttendeeInfo page with parameters
        navigate('/attendee-info', {
          state: { attendees, totalAmount, courseId, courseName, startDate, endDate, selectedSlot,parentEmail }
        });
      } else {
        const result = await response.json();
        alert(result.message || 'Error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className='form-body'>
      <div className="co-form-container">
        <div className="summary-container">
          <h3>Summary</h3>
          <p>Course: {courseName}</p>
          <p>Start Date: {new Date(startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(endDate).toLocaleDateString()}</p>
          <p>Selected Slot: {selectedSlot}</p>
          <p>Number of Attendees: {attendees}</p>
          <p>Total Amount: QAR {totalAmount}/-</p>
        </div>
        <h2>A little bit about you</h2>
        <form onSubmit={handleSubmit}>
          <label>Full Name *</label>
          <div className='side-by-side'>
            <input
              type="text"
              name="fName"
              value={formData.fName}
              onChange={handleChange}
              required
              placeholder='First Name'
            />
            <input
              type="text"
              name="lName"
              value={formData.lName}
              onChange={handleChange}
              required
              placeholder='Last Name'
            />
          </div>
          <label>E-mail address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Phone number *</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <button className='submit-button' type="submit">Proceed to Next</button>
        </form>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="popup-icon">
                <span className="exclamation-mark">!</span>
              </div>
              <h2>Confirmation</h2>
              <p>Are you sure you want to proceed?</p>
              <button className="popup-yes" onClick={handlePopupYes}>Yes</button>
              <button className="popup-no" onClick={handlePopupClose}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOutGuest;
