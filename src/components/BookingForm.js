import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingForm.css';

const BookingForm = () => {
  const location = useLocation();
  const { course, selectedSlot } = location.state || {};
  const [attendees, setAttendees] = useState(1);
  const navigate = useNavigate();

  const handleIncrement = () => setAttendees(attendees + 1);
  const handleDecrement = () => {
    if (attendees > 1) setAttendees(attendees - 1);
  };

  const handleNext = () => {
    const totalAmount = attendees * course.feeAmount;
    navigate('/checkout', { 
      state: { 
        attendees, 
        totalAmount,
        courseId: course._id, 
        courseName: course.name,
        startDate: course.startDate,
        endDate: course.endDate,
        selectedSlot
      } 
    });
  };

  if (!course || !selectedSlot) {
    return <div>No course or slot selected</div>;
  }

  return (
    <div className="booking-form">
      <h2 className="title">{course.name}</h2>
      <p className="session-date">{new Date(course.startDate).toLocaleDateString()} to {new Date(course.endDate).toLocaleDateString()}</p>
      <p className="session-date">{selectedSlot}</p>
      <div className="booking-details">
        <div className="session-info">
          <p>Duration: {course.duration} {course.durationUnit}</p>
          <p>Fees: QAR {course.feeAmount}/- ({course.feeType})</p>
          <p>Location: {course.location}</p>
          <div className="attendees">
            <button onClick={handleDecrement}>-</button>
            <button onClick={handleIncrement}>+</button>
          </div>
          <div className="small-price">
            <p>{attendees} attendee{attendees > 1 ? 's' : ''} QAR {attendees * course.feeAmount}/-</p>
          </div>
        </div>
      </div>
      <div className="total-cost">
        <p>Total cost: <span>QAR {attendees * course.feeAmount}/-</span></p>
      </div>
      <button className="book-next-button" onClick={handleNext}>Next</button>
    </div>
  );
};

export default BookingForm;
