import React, { useState, useEffect, useRef } from "react";
import "./IntroSearch.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const IntroSearch = () => {
  const [activeOption, setActiveOption] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [age, setAge] = useState("");
  const searchBarRef = useRef(null);

  const locations = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
  const activities = ["Swimming", "Skating", "Cricket", "MMA", "Basketball"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setActiveOption(null);
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    setActiveOption(option === activeOption ? null : option);
    if (option !== "date") setShowCalendar(false);
  };

  const handleDateClick = () => {
    setShowCalendar(!showCalendar);
    setActiveOption("date");
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 99)) {
      setAge(value);
    }
  };

  const incrementAge = () => {
    setAge((prev) =>
      parseInt(prev) < 99 ? (parseInt(prev) + 1).toString() : prev
    );
  };

  const decrementAge = () => {
    setAge((prev) =>
      parseInt(prev) > 0 ? (parseInt(prev) - 1).toString() : prev
    );
  };

  return (
    <div className="intro-search">
      <div className="intro-content">
        <h1 className="intro-title">A world of adventure awaits!</h1>
        <p className="intro-subtitle">
          Instantly book from 1000s of activities for your children from trusted
          providers
        </p>
      </div>
      <div className="search-container" ref={searchBarRef}>
        <div className="intro-search-bar">
          <div className="search-options">
            <span
              className={`search-option ${activeOption === "location" ? "active" : ""}`}
              onClick={() => handleOptionClick("location")}
            >
              Location
            </span>
            <span className="separator">|</span>
            <span
              className={`search-option ${activeOption === "age" ? "active" : ""}`}
              onClick={() => handleOptionClick("age")}
            >
              Age
            </span>
            <span className="separator">|</span>
            <span
              className={`search-option ${activeOption === "date" ? "active" : ""}`}
              onClick={handleDateClick}
            >
              Date
            </span>
            <span className="separator">|</span>
            <span
              className={`search-option ${activeOption === "activity" ? "active" : ""}`}
              onClick={() => handleOptionClick("activity")}
            >
              Activity
            </span>
          </div>
          <button className="intro-search-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="intro-search-icon"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        {activeOption === "location" && (
          <div className="dropdown">
            {locations.map((loc, index) => (
              <div key={index} className="dropdown-item">
                {loc}
              </div>
            ))}
          </div>
        )}
        {activeOption === "age" && (
          <div className="age-input-container">
            <button onClick={decrementAge}>-</button>
            <input
              type="text"
              className="age-input"
              value={age}
              onChange={handleAgeChange}
              placeholder="Age"
            />
            <button onClick={incrementAge}>+</button>
          </div>
        )}
        {showCalendar && (
          <div className="calendar-dropdown">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              minDetail="decade"
            />
          </div>
        )}
        {activeOption === "activity" && (
          <div className="dropdown">
            {activities.map((activity, index) => (
              <div key={index} className="dropdown-item">
                {activity}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroSearch;
