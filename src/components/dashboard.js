import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar'; // Ensure correct path
import './dashboard.css'; // Ensure correct path
import AddCourseForm from './AddCourseForm';
import EditCourseForm from './EditCourseForm';
import CourseEnrollment from './CourseEnrollment';
import AddAcademyForm from './AddAcademyForm';
import AddParentForm from './AddParentForm';
import AddStudentForm from './AddStudentForm';
import AddBannerForm from './AddBannerForm';
import EditBannerForm from './EditBannerForm';
import AddPosterForm from './AddPosterForm';
import EditPosterForm from './EditPosterForm';
import AddCourseCategoryForm from './AddCourseCategory';
import EditCourseCategoryForm from './EditCourseCategoryForm';
import EditParentForm from './EditParentForm';
import EventEnrollment from './eventEnrollment';
import EditStudentForm from './EditStudentForm';
import EditAcademyForm from './EditAcademyForm';
import { Divider } from '@mui/material';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'poster' or 'student'
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            try {
                if (deleteType === 'poster') {
                    await axios.delete(`https://kidgage-adminbackend.onrender.com/api/posters/${itemToDelete._id}`);
                } else if (deleteType === 'student') {
                    await axios.delete(`https://kidgage-adminbackend.onrender.com/api/student/delete/${itemToDelete._id}`);
                }
                setItemToDelete(null);
                setDeleteType('');
                setShowPopup(false);
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    window.location.reload(); // Refresh the entire page
                }, 3000);
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const handleDeletePoster = (poster) => {
        setItemToDelete(poster);
        setDeleteType('poster');
        togglePopup();
    };

    const handleDeleteStudent = (student) => {
        setItemToDelete(student);
        setDeleteType('student');
        togglePopup();
    };

    return (
        <div className="dashboard-body">
            <div className="hamburger-menu" onClick={toggleSidebar}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className={`dashboard-card ${sidebarOpen ? 'expanded' : ''}`}>
                <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`dashboard-content ${sidebarOpen ? 'expanded' : ''}`}>
                    <section id="courses" className="db-section">
                        <h1>Courses</h1>
                        <CourseEnrollment />
                        <AddCourseForm />
                        <EditCourseForm />
                    </section>

                    <section id="academies" className="db-section">
                        <h1>Academies</h1>
                        <AddAcademyForm />
                        <EditAcademyForm/>
                    </section>
                    <section id="parents" className="db-section">
                        <h1>Parents</h1>
                        <AddParentForm />
                        <EditParentForm/>
                    </section>
                    <section id="students" className="db-section">
                        <h1>Students</h1>
                        <AddStudentForm />
                        <EditStudentForm onDelete={handleDeleteStudent}/>
                    </section>
                    <section id="add-banners" className="db-section">
                        <h1>Add Banners</h1>
                        <AddBannerForm />
                        <EditBannerForm />
                    </section>
                    <section id="event-posters" className="db-section">
                        <h1>Event Posters</h1>
                        <AddPosterForm />
                        <EditPosterForm onDelete={handleDeletePoster} />
                        <EventEnrollment/>
                    </section>
                    <section id="course-categories" className="db-section">
                        <h1>Course Categories</h1>
                        <AddCourseCategoryForm />
                        <EditCourseCategoryForm />
                    </section>
                    <button id="signout">
                    </button>
                </div>
                {showPopup && (
                    <>
                        <div className="confirm-popup-overlay" onClick={togglePopup}></div>
                        <div className="confirm-popup">
                            <p>Are you sure you want to delete this {deleteType === 'poster' ? 'poster' : 'student'}?</p>
                            <button onClick={handleConfirmDelete}>Confirm Delete</button>
                            <button onClick={togglePopup}>Cancel</button>
                        </div>
                    </>
                )}
                {showSuccessMessage && (
                    <div className="pop-success-message">
                        {deleteType === 'poster' ? 'Poster deleted successfully.' : 'Student deleted successfully.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
