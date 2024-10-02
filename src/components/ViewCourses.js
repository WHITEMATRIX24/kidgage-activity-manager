import React, { useEffect, useState } from "react";
import './AddCourseForm.css';
import './ViewForm.css';
import { FaChevronDown, FaPlus, FaTimes } from "react-icons/fa";
import axios from 'axios';
import AddCourseForm from './AddCourseForm';
import EditCourseForm from './EditCourseForm';

const ViewCourses = ({ handleSubmit }) => {
    const [showForm, setShowForm] = useState(true);
    const [showAForm, setShowAForm] = useState(false);
    const [providers, setProviders] = useState([]);
    const [courses, setCourses] = useState({});
    const [selectedCourse, setSelectedCourse] = useState(null); // State for the selected course
    const [selectedProviderId, setSelectedProviderId] = useState(null); // State for the selected course

    const [visibleCourses, setVisibleCourses] = useState({});

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    useEffect(() => {
        axios.get('https://kidgage-admin-eyau.onrender.com/api/users/all')
            .then((response) => {
                setProviders(response.data);
            })
            .catch((error) => {
                console.error('There was an error fetching the users!', error);
            });
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

    const handleAddAcademyClick = (providerId) => {
        setShowAForm(true);
        setShowForm(false);
        setSelectedProviderId(providerId);

    };

    const handleCloseForm = () => {
        setShowAForm(false);
        setShowForm(true);
    };

    const handleEditCourseClick = (course) => {
        console.log(course);
        setSelectedCourse(course); // Set the selected course for editing
        setShowForm(false); // Hide the provider list when editing a course
    };

    const handleCloseEditForm = () => {
        setSelectedCourse(null); // Close the Edit Course form
        setShowForm(true); // Show the provider list again
    };

    const toggleCourseVisibility = (providerId) => {
        setVisibleCourses(prevVisibleCourses => ({
            ...prevVisibleCourses,
            [providerId]: !prevVisibleCourses[providerId]
        }));
    };
    const totalCourses = Object.values(courses).reduce((acc, courseList) => acc + courseList.length, 0);

    return (
        <div className="add-course-form-container">
            {!showAForm && (
                <>
                    <div className="add-course-form-header" onClick={toggleFormVisibility}>
                        <h2>Courses/Activities</h2>
                        {/* <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} /> */}
                    </div>
                    {showForm && (
                        <form className="add-course-form">
                            <h3 style={{color:'green',marginTop:'0px'}}>Total {totalCourses} Activities registered under {providers.length} Academies</h3>
                            {/* <h2>Total courses/activities listed: {totalCourses}</h2> */}

                            <div className="users-contain">
                                {providers.map((provider) => (
                                    <div className="use-card" key={provider.username}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '60%' }}>
                                                <img src={`data:image/jpeg;base64,${provider.logo}`} alt={`${provider.username}'s logo`} className="use-logo" />
                                                <p className="users-name">{provider.username}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleAddAcademyClick(provider._id)}
                                                className="add-image-button"
                                                title="Add Academy"
                                                style={{ color: 'black', display: 'flex', alignItems: 'center', padding: ' 0 5px', background: 'transparent', border: '1px solid #ccc' }}
                                            >
                                                <p>Add a new course</p><FaPlus style={{ marginLeft: '10px', fontSize: '16px', color: '#387CB8' }} />
                                            </button>
                                        </div>
                                        <div className="see-courses" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                                            <h4  className="no-of-course" style={{alignSelf:'flex-start'}}>Courses/Activities listed: {courses[provider._id] ? courses[provider._id].length : 0}</h4>
                                            <button
                                                type="button"
                                                onClick={() => toggleCourseVisibility(provider._id)}
                                                className="see-courses-button"
                                            >
                                                {visibleCourses[provider._id] ? 'Hide Courses' : 'See Courses'}
                                            </button>
                                        </div>
                                        {visibleCourses[provider._id] && courses[provider._id] && courses[provider._id].length > 0 && (
                                            <div className="courses-container" style={{ width: '100%' }}>
                                                {courses[provider._id].map((course) => (
                                                    <div key={course._id} className="course-card" onClick={() => handleEditCourseClick(course)}>
                                                     <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent: 'space-between', width:'60%'}}>
                                                        <p style={{ color: 'darkblue' }}>{course.name}</p>
                                                        <p style={{ color: 'green' }}>{course.courseType}</p>
                                                        </div>
                                                        <button>view</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </form>
                    )}
                </>
            )}

            {showAForm && (
                <div className="add-academy-form-container">
                    <div className="form-header">
                        <h3>Add New Academy</h3>
                        <button className="close-form-button" onClick={handleCloseForm}>
                            <FaTimes style={{ fontSize: '24px', color: 'red' }} />
                        </button>
                    </div>
                    <AddCourseForm handleSubmit={handleCloseForm} providerId={selectedProviderId}/>
                </div>
            )}

            {/* Show EditCourseForm when a course is selected */}
            {selectedCourse && (
                <div className="edit-course-form-container">
                    <div className="form-header">
                        <h3>Edit Course</h3>
                        <button className="close-form-button" onClick={handleCloseEditForm}>
                            <FaTimes style={{ fontSize: '24px', color: 'red' }} />
                        </button>
                    </div>
                    <EditCourseForm
                        course={selectedCourse} // Pass selected course to edit
                        id={selectedCourse._id}
                        handleSubmit={handleCloseEditForm} // Close form after submission
                    />
                </div>
            )}
        </div>
    );
};

export default ViewCourses;
