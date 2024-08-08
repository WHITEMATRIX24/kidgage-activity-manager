import React from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';
import './AttendeeCard.css';
import paintingImage from './assets/images/painting.jpg';

const AttendeeCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseName, startDate, endDate, selectedSlot, totalAmount, attendees, parentEmail } = location.state || {};


  return (
    <body className='attendee-body'>
        <div className="attendee-card">
      
      <div className="event-details">
        <img
          src={paintingImage}
          alt="Event"
          className="event-image"
        />
       
      </div>
    <div>
        <div className="event-info">
          <h2>{courseName}</h2>
          <p>Kaleidoscope Clubs and Courses</p>
          <div className="event-date">
            <span><span className="event-check">&#10003;</span>{new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()} ( {selectedSlot} )</span>
          </div>
        </div>
    <div className="booking-details">
        <h3>&#128188; {attendees} x Weekly booking (M-F, 10am-3pm)</h3>
        <div className="price">QAR {totalAmount}/-</div>
      </div>
      
      <div className="total-cost">
        <h3>Total cost</h3>
        <div className="price">QAR {totalAmount}/-</div>
      </div>
      <div className="booking-detail">
        <h2>Your Payment will be at the Office!</h2>
      </div>
      <div className="email-optin">
        <input type="checkbox" id="email-optin" />
        <label htmlFor="email-optin">
          We’d love to email you with activity ideas and exclusive offers. If you'd prefer to not receive emails from Kidgage, tick this box.
        </label>
      </div>
      <div className="terms">
        By clicking "Confirm Booking" you agree to Kidgage's <a href="/terms">T&C's</a> and <a href="/privacy">Privacy Policy</a>.
      </div>
      <button className="proceed-to-payment">Confirm Booking</button>
    </div>
    </div>
  </body>
  );
};

export default AttendeeCard;
