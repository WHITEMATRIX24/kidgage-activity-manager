import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './EventDetails.css';

const EventDetails = () => {
  const location = useLocation();
  const { event } = location.state;

  const [form, setForm] = useState({
    studentName: '',
    studentDOB: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    eventName: event.name,
    eventId: event._id
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleBookNow = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://kidgage-adminbackend.onrender.com/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Booking successful:', result);
        setForm({
          studentName: '',
          studentDOB: '',
          parentName: '',
          parentPhone: '',
          parentEmail: '',
          eventName: event.name,
          eventId: event._id
        });

        // Show popup and hide after 5 seconds
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      } else {
        const errorData = await response.json();
        console.error('Failed to book:', errorData);
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network error
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return date.toLocaleDateString('en-GB'); // Format as dd-mm-yy
  };

  return (
    <div className="event-details">
      <div className='events-details'> 
        <img 
          src={`data:image/jpeg;base64,${event.image}`} 
          alt={event.name} 
        />
        <div className='event-descrep'>
          <h2>{event.name}</h2>
          <p>{event.description}</p>
          <div className='event-detail'>
          <h4>Venue:<a href={event.location}>View Location</a></h4>
          <h4>Date: {formatDate(event.startDate)} - {formatDate(event.endDate)}</h4>
          <h4>Phone:{event.phone}</h4>
          </div>
        </div>
      </div>
      <form className="booking-form" onSubmit={handleBookNow}>
        <div className='booking-form-details'>
          <h3>Booking Form</h3>
          <div className='side-by-side'>
            <label>
              Student's Full Name:
              <input
                type="text"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Student's Date of Birth:
              <input
                type="date"
                name="studentDOB"
                value={form.studentDOB}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label>
            Parent's Name:
            <input
              type="text"
              name="parentName"
              value={form.parentName}
              onChange={handleChange}
              required
            />
          </label>
          <div className='side-by-side'>
            <label>
              Parent's Phone Number:
              <input
                type="tel"
                name="parentPhone"
                value={form.parentPhone}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Parent's Email:
              <input
                type="email"
                name="parentEmail"
                value={form.parentEmail}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <button id="book-now" type="submit">
            <i className="fas fa-arrow-right"></i>BOOK NOW
          </button>
        </div>
      </form>

      {/* Popup Notification */}
      {showPopup && (
        <div className="c-popup">
          <p>Booking Successful!</p>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
