import React, { useState,useEffect } from 'react';
import { FaChevronDown, FaSearch, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './AddCourseForm.css';

function AddCourseForm() {
    const initialCourseState = {
        providerId: '',
        name: '',
        duration: '',
        durationUnit: 'days',
        startDate: '',
        endDate: '',
        description: '',
        feeAmount: '',
        feeType: 'full_course',
        days: [],
        timeSlots: [{ from: '', to: '' }],
        location: '',
        hashtags: [],
        newHashtag: '#' // Initialize with '#'
    };

    const [course, setCourse] = useState(initialCourseState);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchError, setSearchError] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prev) => ({ ...prev, [name]: value }));
    };

    const handleDayChange = (e) => {
        const { value, checked } = e.target;
        setCourse((prev) => ({
            ...prev,
            days: checked
                ? [...prev.days, value]
                : prev.days.filter((day) => day !== value)
        }));
    };
    useEffect(() => {
        if (success) {
          const timer = setTimeout(() => {
            setSuccess('');
          }, 5000); // Hide success message after 5 seconds
    
          return () => clearTimeout(timer); // Cleanup the timer on component unmount
        }
      }, [success]);
    
    const handleHashtagChange = (e) => {
        // Ensure that '#' is always the prefix for hashtags
        const value = e.target.value;
        setCourse((prev) => ({ ...prev, newHashtag: value }));
    };

    const addHashtag = () => {
        const hashtag = course.newHashtag.trim();
        if (hashtag && !course.hashtags.includes(hashtag)) {
            setCourse((prev) => ({
                ...prev,
                hashtags: [...prev.hashtags, hashtag],
                newHashtag: '#' // Reset to default '#'
            }));
        }
    };

    const removeHashtag = (hashtag) => {
        setCourse((prev) => ({
            ...prev,
            hashtags: prev.hashtags.filter(h => h !== hashtag)
        }));
    };

    const handleTimeSlotChange = (index, e) => {
        const { name, value } = e.target;
        const timeSlots = [...course.timeSlots];
        timeSlots[index] = { ...timeSlots[index], [name]: value };
        setCourse((prev) => ({ ...prev, timeSlots }));
    };

    const addTimeSlot = () => {
        setCourse((prev) => ({ ...prev, timeSlots: [...prev.timeSlots, { from: '', to: '' }] }));
    };

    const removeTimeSlot = (index) => {
        setCourse((prev) => ({ ...prev, timeSlots: prev.timeSlots.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://kidgage-adminbackend.onrender.com/api/courses/addcourse', course);
            console.log('Course added successfully', response.data);
            setCourse(initialCourseState);
            setSuccess('Course added successfully!');
            setError('');
        } catch (error) {
            console.error('Error adding course', error);
            setError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
            setSuccess('');
        }
    };

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://kidgage-adminbackend.onrender.com/api/users/search?query=${searchQuery}`);
            setSearchResult(response.data);
            setSearchError('');
            setCourse((prev) => ({ ...prev, providerId: response.data._id }));
        } catch (error) {
            setSearchResult(null);
            setSearchError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
        }
    };

    return (
        <div className="add-course-form-container">
            <div className="add-course-form-header" onClick={toggleFormVisibility}>
                <h2>Add Course</h2>
                <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} />
            </div>
            {showForm && (
                <form className="add-course-form" onSubmit={handleSubmit}>
                    <div className="form-group search-provider-group">
                        <label htmlFor="provider">Provider</label>
                        <input
                            type="text"
                            id="provider"
                            name="provider"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search provider..."
                            required
                        />
                        <button type="button" className="search-provider-button" onClick={handleSearch}>
                            <FaSearch />
                        </button>
                    </div>
                    {searchError && <p className="error-message">{searchError}</p>}
                    {searchResult && (
                        <div className="search-result">
                            <p>Provider: {searchResult.username}</p>
                            <p>Email: {searchResult.email}</p>
                            <p>ID: {searchResult._id}</p>
                        </div>
                    )}
                    <div className="form-group add-course-label-group">
                        <label htmlFor="name">Course Name</label>
                    </div>
                    <div className="form-group add-course-group">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder='Course Name'
                            value={course.name}
                            onChange={handleChange}
                        />
                    </div>
                    <label>Course Hashtags</label>
                    <div className="side-by-side2">
                        <div className="interest-input-group">
                            <input
                                type="text"
                                id="newHashtag"
                                name="newHashtag"
                                value={course.newHashtag}
                                onChange={handleHashtagChange}
                                placeholder="Add new hashtag"
                            />
                            <button type="button" className="add-interest-btn" onClick={addHashtag}>
                                <FaPlus />
                            </button>
                        </div>
                        <div className="interest-box">
                            {course.hashtags && course.hashtags.map((hashtag) => (
                                <div key={hashtag} className="interest-item">
                                    <span>{hashtag}</span>
                                    <button
                                        type="button"
                                        className="remove-interest-btn"
                                        onClick={() => removeHashtag(hashtag)}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="form-group add-duration-group">
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            placeholder='Course Duration'
                            value={course.duration}
                            onChange={handleChange}
                        />
                        <select
                            id="durationUnit"
                            name="durationUnit"
                            value={course.durationUnit}
                            onChange={handleChange}
                        >
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                        </select>
                    </div>
                    <div className="form-group add-duration-label-group">
                        <label htmlFor="startDate">Start Date</label>
                        <label htmlFor="endDate">End Date</label>
                    </div>
                    <div className="form-group add-duration-group">
                        <input
                            className='start-date-ip'
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={course.startDate}
                            onChange={handleChange}
                        />
                        <input
                            className='start-date-ip'
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={course.endDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Course Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={course.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Fee Structure</label>
                        <div className="fee-structure">
                            <input
                                type="number"
                                id="feeAmount"
                                name="feeAmount"
                                value={course.feeAmount}
                                onChange={handleChange}
                                placeholder="Amount"
                            />
                            <span className="currency-symbol">QAR</span>
                            <select
                                id="feeType"
                                name="feeType"
                                value={course.feeType}
                                onChange={handleChange}
                            >
                                <option value="full_course">Full Course</option>
                                <option value="per_month">Per Month</option>
                                <option value="per_week">Per Week</option>
                                <option value="per_class">Per Class</option>
                            </select>
                        </div>
                    </div>
                    <label className='selecet-days-label'>Select Days:</label>
                    <div className="form-group add-days-group">
                        
                        <div className="days-selection">
                        
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                <label key={day} className="day-checkbox">
                                    <input
                                        type="checkbox"
                                        value={day}
                                        checked={course.days.includes(day)}
                                        onChange={handleDayChange}
                                        className='days-checkbox'
                                    />
                                    {day}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Time Slots:</label>
                        <button type="button" className="add-time-slot-btn" onClick={addTimeSlot}>
                            Add Time Slot
                        </button>
                        {course.timeSlots.map((slot, index) => (
                            <div key={index} className="time-slot">
                                <input
                                    type="time"
                                    name="from"
                                    value={slot.from}
                                    onChange={(e) => handleTimeSlotChange(index, e)}
                                />
                                <span>to</span>
                                <input
                                    type="time"
                                    name="to"
                                    value={slot.to}
                                    onChange={(e) => handleTimeSlotChange(index, e)}
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        className="rem-button"
                                        onClick={() => removeTimeSlot(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={course.location}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </form>
            )}
        </div>
    );
}

export default AddCourseForm;
