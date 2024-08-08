import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCourseForm.css'; // Reuse the same CSS file for styling
import { FaChevronDown, FaEdit, FaTrash, FaSearch,FaTimes ,FaPlus} from 'react-icons/fa';

const EditCourseForm = () => {
    const [showForm, setShowForm] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [courseData, setCourseData] = useState(null);
    const [formData, setFormData] = useState({
        providerId: '',
        name: '',
        hashtags: [],
        duration: '',
        durationUnit: 'days',
        startDate: '',
        endDate: '',
        description: '',
        feeAmount: '',
        feeType: '',
        days: [],
        timeSlots: [{ from: '', to: '' }],
        location: '',
        newHashtag: '#' // Initialize with '#'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchError, setSearchError] = useState('');
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch course categories when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/course-category/categories');
                // Handle categories if needed
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/courses/search?name=${searchQuery}`);
            if (response.data) {
                setCourseData(response.data);
                setFormData({
                    providerId: response.data.providerId,
                    name: response.data.name,
                    hashtags: response.data.hashtags,
                    duration: response.data.duration,
                    durationUnit: response.data.durationUnit,
                    startDate: response.data.startDate,
                    endDate: response.data.endDate,
                    description: response.data.description,
                    feeAmount: response.data.feeAmount,
                    feeType: response.data.feeType,
                    days: response.data.days,
                    timeSlots: response.data.timeSlots,
                    location: response.data.location
                });
                setSearchError('');
                setError('');
                setIsEditMode(false);
            } else {
                setSearchError('Course not found.');
                setCourseData(null);
            }
        } catch (error) {
            setSearchError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
            setCourseData(null);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleHashtagsChange = (e) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            hashtags: value.split(',').map(tag => tag.trim()).filter(tag => tag)
        }));
    };

    const handleDayChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            days: checked
                ? [...prevState.days, value]
                : prevState.days.filter(day => day !== value)
        }));
    };

    const handleTimeSlotChange = (index, e) => {
        const { name, value } = e.target;
        const timeSlots = [...formData.timeSlots];
        timeSlots[index] = { ...timeSlots[index], [name]: value };
        setFormData(prevState => ({ ...prevState, timeSlots }));
    };

    const addTimeSlot = () => {
        setFormData(prevState => ({
            ...prevState,
            timeSlots: [...prevState.timeSlots, { from: '', to: '' }]
        }));
    };

    const removeTimeSlot = (index) => {
        setFormData(prevState => ({
            ...prevState,
            timeSlots: prevState.timeSlots.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditMode) {
            try {
                const response = await axios.put(`http://localhost:5001/api/courses/update/${courseData._id}`, formData);
                setSuccess('Course updated successfully!');
                setError('');
                setIsEditMode(false);
            } catch (error) {
                setError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
                setSuccess('');
            }
        }
    };

    const handleDelete = () => {
        setShowConfirmPopup(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5001/api/courses/delete/${courseData._id}`);
            setCourseData(null);
            setFormData({
                providerId: '',
                name: '',
                hashtags: [],
                duration: '',
                durationUnit: 'days',
                startDate: '',
                endDate: '',
                description: '',
                feeAmount: '',
                feeType: '',
                days: [],
                timeSlots: [{ from: '', to: '' }],
                location: ''
            });
            setShowConfirmPopup(false);
            setSuccess('Course deleted successfully!');
        } catch (error) {
            setError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
            setSuccess('');
            setShowConfirmPopup(false);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmPopup(false);
    };

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    const handleHashtagChange = (e) => {
        // Ensure that '#' is always the prefix for hashtags
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, newHashtag: value }));
    };

    const addHashtag = () => {
        const hashtag = formData.newHashtag.trim();
        if (hashtag && !formData.hashtags.includes(hashtag)) {
            setFormData((prev) => ({
                ...prev,
                hashtags: [...prev.hashtags, hashtag],
                newHashtag: '#' // Reset to default '#'
            }));
        }
    };

    const removeHashtag = (hashtag) => {
        setFormData((prev) => ({
            ...prev,
            hashtags: prev.hashtags.filter(h => h !== hashtag)
        }));
    };


    return (
        <div className="add-course-form-container">
            <div className="add-course-form-header" onClick={toggleFormVisibility}>
                <h2>Edit/Remove a Course</h2>
                <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} />
            </div>
            {showForm && (
                <div className='add-course-form'>
                    {!isEditMode && (
                        <div className="form-group search-provider-group">
                            <label htmlFor="search">Search Course</label>
                            <input
                                type="text"
                                id="search"
                                name="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter course name..."
                            />
                            <button type="button" className="search-provider-button" onClick={handleSearch}>
                                <FaSearch />
                            </button>
                        </div>
                    )}
                    {searchError && <p className="error-message">{searchError}</p>}
                    {courseData && (
                        <form className="add-course-form" onSubmit={handleSubmit}>
                            <div className="form-group add-course-label-group">
                        <label htmlFor="name">Course Name</label>
                            </div>
                            <div className="form-group add-course-group">
                            <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Course Name"
                                        required
                                        disabled={!isEditMode}
                                    />
                            </div>
                            <label>Course Hashtags</label>
                            <div className="side-by-side2">
                                <div className="interest-input-group">
                                    <input
                                        type="text"
                                        id="newHashtag"
                                        name="newHashtag"
                                        value={formData.newHashtag}
                                        onChange={handleHashtagChange}
                                        placeholder="Add new hashtag"
                                        disabled={!isEditMode}
                                    
                                    />
                                    <button disabled={!isEditMode} type="button" className="add-interest-btn" onClick={addHashtag}>
                                        <FaPlus />
                                    </button>
                                </div>
                                <div className="interest-box">
                                    {formData.hashtags && formData.hashtags.map((hashtag) => (
                                        <div key={hashtag} className="interest-item">
                                            <span>{hashtag}</span>
                                            <button
                                                type="button"
                                                className="remove-interest-btn"
                                                onClick={() => removeHashtag(hashtag)}
                                                disabled={!isEditMode}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group add-duration-label-group">
                                <label htmlFor="startDate">Course Duration</label>
                            </div>
                            <div className="form-group add-duration-group">
                                <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    placeholder='Course Duration'
                                    value={formData.duration}
                                    onChange={handleChange}
                                    disabled={!isEditMode}
                                />
                                <select
                                    id="durationUnit"
                                    name="durationUnit"
                                    value={formData.durationUnit}
                                    onChange={handleChange}
                                    disabled={!isEditMode}
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
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    disabled={!isEditMode}
                                />
                                <input
                                    className='start-date-ip'
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Course Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div className="form-group">
                                <label>Fee Structure</label>
                                <div className="fee-structure">
                                    <input
                                        type="number"
                                        id="feeAmount"
                                        name="feeAmount"
                                        value={formData.feeAmount}
                                        onChange={handleChange}
                                        placeholder="Amount"
                                        disabled={!isEditMode}
                                    />
                                    <span className="currency-symbol">QAR</span>
                                    <select
                                        id="feeType"
                                        name="feeType"
                                        value={formData.feeType}
                                        onChange={handleChange}
                                        disabled={!isEditMode}
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
                                                checked={formData.days.includes(day)}
                                                onChange={handleDayChange}
                                                className='days-checkbox'
                                                disabled={!isEditMode}
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Time Slots:</label>
                                <button disabled={!isEditMode} type="button" className="add-time-slot-btn" onClick={addTimeSlot}>
                                    Add Time Slot
                                </button>
                                {formData.timeSlots.map((slot, index) => (
                                    <div key={index} className="time-slot">
                                        <input
                                            type="time"
                                            name="from"
                                            value={slot.from}
                                            onChange={(e) => handleTimeSlotChange(index, e)}
                                            disabled={!isEditMode}
                                        />
                                        <span>to</span>
                                        <input
                                            type="time"
                                            name="to"
                                            value={slot.to}
                                            onChange={(e) => handleTimeSlotChange(index, e)}
                                            disabled={!isEditMode}
                                        />
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                className="rem-button"
                                                onClick={() => removeTimeSlot(index)}
                                                disabled={!isEditMode}
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
                                    value={formData.location}
                                    onChange={handleChange}
                                    disabled={!isEditMode}
                                />
                            </div>     
                            
                            <div className="button-container">
                                {!isEditMode ? (
                                    <>
                                    <></>
                                        <button type="button" onClick={() => setIsEditMode(true)}><FaEdit /> Edit</button>
                                        <button type="button" className='delete-course-button' onClick={handleDelete}>
                                            <FaTrash /> Delete
                                        </button>
                                    </>
                                ) : (
                                    <button type="submit">Save</button>
                                )}
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            {success && <p className="success-message">{success}</p>}
                        </form>
                    )}
                </div>
            )}
            {showConfirmPopup && (
                <div className="confirm-popup">
                    <div className="confirm-popup-content">
                        <p>Are you sure you want to delete this course?</p>
                        <button onClick={handleConfirmDelete}>Yes</button>
                        <button onClick={handleCancelDelete}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditCourseForm;
