import React, { useEffect, useState } from 'react';
import './AddCourseForm.css'; // Reuse the same CSS file for styling
import { FaChevronDown, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const PromoteCourse = () => {
    const [showForm, setShowForm] = useState(true);
    const [providers, setProviders] = useState([]);
    const [courses, setCourses] = useState({});
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [promoteMode, setPromoteMode] = useState(true);

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await axios.get('https://kidgage-admin-eyau.onrender.com/api/users/all'); // Adjust the URL as needed
                setProviders(response.data);
            } catch (error) {
                console.error('Error fetching providers:', error);
            }
        };

        fetchProviders();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            const providerIds = providers.map(provider => provider._id);
            try {
                const response = await axios.get('https://kidgage-admin-eyau.onrender.com/api/courses/by-providers', {
                    params: { providerIds }
                });
                const coursesByProvider = response.data.reduce((acc, course) => {
                    const providerId = course.providerId;
                    if (!acc[providerId]) {
                        acc[providerId] = [];
                    }
                    acc[providerId].push(course);
                    return acc;
                }, {});
                setCourses(coursesByProvider);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        if (providers.length > 0) {
            fetchCourses();
        }
    }, [providers]);

    const handlePromoteClick = (course, promote) => {
        setSelectedCourse(course);
        setPromoteMode(promote);
        setShowConfirmPopup(true);
    };

    const handleConfirmPromotion = async () => {
        if (!selectedCourse) return;

        try {
            await axios.post(`https://kidgage-admin-eyau.onrender.com/api/promoted/promote/${selectedCourse._id}`, { promote: promoteMode });
            // Refresh the courses list
            setCourses((prevCourses) => ({
                ...prevCourses,
                [selectedCourse.providerId]: prevCourses[selectedCourse.providerId].map(course =>
                    course._id === selectedCourse._id ? { ...course, promoted: promoteMode } : course
                )
            }));
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

    return (
        <div className="add-course-form-container">
            <div className="add-course-form-header" onClick={toggleFormVisibility}>
                <h2>Promote A Course</h2>
                <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} />
            </div>
            {showForm && (
                <div className='add-course-form'>
                    <h2>Total providers registered: {providers.length}</h2>
                    {providers.map((provider) => (
                        <div key={provider._id} className="provider-section">
                            <h3>{provider.username}</h3>
                            <div className="courses-item">
                                {courses[provider._id] && courses[provider._id].map((course) => (
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
                        </div>
                    ))}
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
