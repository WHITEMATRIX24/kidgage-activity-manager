import React, { useState, useEffect } from 'react';
import './UpcomingEvents.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import heart from'./assets/images/heart.png';

const WishlistPage = () => {
  const [wishlistEvents, setWishlistEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(null); // State for popup visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://kidgage-adminbackend.onrender.com/api/posters?wishlist=true');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWishlistEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wishlist events:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWishlistEvents();
  }, []);

  const getEventStatus = (startDateString, endDateString) => {
    const today = new Date();
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (today >= startDate && today <= endDate) {
      return 'Live';
    } else if (today < startDate) {
      return 'Upcoming';
    } else {
      return 'Past';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return date.toLocaleDateString('en-GB'); // Format as dd-mm-yy
  };

  const bookNow = (event) => {
    navigate('/event-details', { state: { event } });
  };

  const getImageSource = (imageBase64) => {
    if (imageBase64) {
      return `data:image/jpeg;base64,${imageBase64}`;
    }
    return null;
  };

  const removeFromWishlist = async (eventId) => {
    try {
      const response = await fetch(`https://kidgage-adminbackend.onrender.com/api/posters/${eventId}/wishlist`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wishlist: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to update wishlist');
      }

      setWishlistEvents(wishlistEvents.filter(event => event._id !== eventId));
      setShowPopup('removed'); // Show popup on success
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  return (
    <div className="upcoming-events">
      {showPopup && (
        <div className="msg-popup">
          <p>{showPopup === 'removed' ? 'Removed from Wishlist!' : 'Added to Wishlist!'}</p>
        </div>
      )}
      <div className="wishlist-events-heading">
        <img src={heart}></img>
        <h2> My Wishlist</h2>
      </div>

      {loading && <div className="loading">Loading wishlist...</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && (
        <>
          {wishlistEvents.length > 0 ? (
            <div className="events-grid">
              {wishlistEvents.map(event => {
                const imageUrl = getImageSource(event.image);
                const status = getEventStatus(event.startDate, event.endDate);
                return (
                  <div key={event._id} className="event-card">
                    <img src={imageUrl} alt={event.name} />
                    <p className={status === 'Upcoming' ? 'upcoming' : ''}>{status}</p>
                    <h3>{event.name}</h3>
                    <h4 className='event-description'>{event.description}</h4>
                    <h4>{formatDate(event.startDate)} - {formatDate(event.endDate)}</h4>
                    <a href={event.location}>View Location</a>
                    
                    <button id="book-now" onClick={() => bookNow(event)}><i className="fas fa-arrow-right"></i>BOOK NOW</button>
                    <button id="calendar"><i className="fa-regular fa-calendar-plus"></i></button>
                    <button id="call"><i className="fa-solid fa-phone"></i></button>
                    <button id="wishlist" onClick={() => removeFromWishlist(event._id)}>
                      <i className="fa-solid fa-heart-crack"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-events">No events in your wishlist.</div>
          )}
        </>
      )}
      <button className="floating-btn wishlist-btn" onClick={() => navigate('/')}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
  );
}

export default WishlistPage;
