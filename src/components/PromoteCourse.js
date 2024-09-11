import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCourseForm.css'; // Reuse the same CSS file for styling
import { FaChevronDown, FaEdit, FaTrash, FaSearch, FaTimes, FaPlus } from 'react-icons/fa';

const PromoteCourse = () => {
    const [showForm, setShowForm] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [provider, setProvider] = useState(null);
    const [courses, setCourses] = useState([]);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [promoteMode, setPromoteMode] = useState(true);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://kidgage-adminbackend.onrender.com/api/promoted/search?email=${searchQuery}`);
            setProvider(response.data);
            fetchCourses(response.data._id);
        } catch (error) {
            console.error('Error fetching provider:', error);
            setProvider(null);
            setCourses([]);
        }
    };

    const fetchCourses = async (providerId) => {
        try {
            const response = await axios.get(`https://kidgage-adminbackend.onrender.com/api/promoted/courses/${providerId}`);
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handlePromoteClick = (course, promote) => {
        setSelectedCourse(course);
        setPromoteMode(promote);
        setShowConfirmPopup(true);
    };

    const handleConfirmPromotion = async () => {
        if (!selectedCourse) return;

        try {
            await axios.post(`https://kidgage-adminbackend.onrender.com/api/promoted/promote/${selectedCourse._id}`, { promote: promoteMode });
            fetchCourses(provider._id); // Refresh the courses list
            setShowConfirmPopup(false);
            setSelectedCourse(null);
        } catch (error) {
            console.error('Error promoting/demoting course:', error);
        }
    };

    const handleCancelPromotion = () => {
        setShowConfirmPopup(false);
        setSelectedCourse(null);
    };

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="add-course-form-container">
            <div className="add-course-form-header" onClick={toggleFormVisibility}>
                <h2>Promote A Course</h2>
                <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} />
            </div>
            {showForm && (
                <div className='add-course-form'>
                    <div className="form-group search-provider-group">
                        <label htmlFor="search">Search Course</label>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter providers email..."
                        />
                        <button type="button" className="search-provider-button" onClick={handleSearch}>
                            <FaSearch />
                        </button>
                    </div>
                    {provider && (
                        <div className="search-result">
                            <h3>Provider: {provider.username}</h3>
                        </div>
                    )}
                    {courses.length > 0 && (
                        <div className="courses-item">
                            {courses.map((course) => (
                                <div key={course._id} className="course-item">
                                    <span>{course.name}</span>
                                    {course.promoted ? (
                                        <button onClick={() => handlePromoteClick(course, false)}>Remove from Promoted</button>
                                    ) : (
                                        <button onClick={() => handlePromoteClick(course, true)}>Promote</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {showConfirmPopup && (
                <div className="confirm-popup">
                    <div className="confirm-popup-content">
                        <p>Are you sure you want to {promoteMode ? 'promote' : 'remove promotion from'} this course?</p>
                        <button onClick={handleConfirmPromotion}>Yes</button>
                        <button onClick={handleCancelPromotion}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoteCourse;

