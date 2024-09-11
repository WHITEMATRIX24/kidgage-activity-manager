import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar'; // Ensure correct path
import './dashboard.css'; // Ensure correct path
import AddCourseForm from './AddCourseForm';
import EditCourseForm from './EditCourseForm';
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
import AddAdvertisement from './AddAdvertisement1';
import AddAdvertisement2 from './AddAdvertisement2';
import EditAdvertisementForm from './EditAdvertisement';
import { Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import ChangePasswordForm from './ChangePasswordForm';
import Logo from './assets/images/logo2.png';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'poster' or 'student'
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false); // New state
    const adminId = '66b22d7ec73e3b8a02fda241'; // The ID for the admin


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const handleSignOut = () => {
        window.location.replace('/');
    };

    const handleChangePassword = () => {
        setShowChangePasswordForm(true);
    };

    const handleCloseChangePasswordForm = () => {
        setShowChangePasswordForm(false);
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
            <div className='header-dash'>
            <img className='dash-logo' src={Logo}></img>
            <h1>Activity Manager</h1>
            </div>
            <div className={`dashboard-card ${sidebarOpen ? 'expanded' : ''}`}>
                
                <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`dashboard-content ${sidebarOpen ? 'expanded' : ''}`}>
                    <section id="courses" className="db-section">
                        <AddCourseForm />
                        <EditCourseForm />
                    </section>

                    <section id="academies" className="db-section">
                    <AddAcademyForm />
                        <EditAcademyForm />
                    </section>
                    <section id="parents" className="db-section">
                        <AddParentForm />
                        <EditParentForm />
                    </section>
                    <section id="students" className="db-section">
                        <AddStudentForm />
                        <EditStudentForm onDelete={handleDeleteStudent} />
                    </section>
                    <section id="add-banners" className="db-section">
                        <AddBannerForm />
                        <EditBannerForm />
                    </section>
                    <section id="event-posters" className="db-section">
                        <AddPosterForm />
                        <EditPosterForm onDelete={handleDeletePoster} />
                        <EventEnrollment />
                    </section>
                    <section id="add-advertisements" className="db-section">
                        <AddAdvertisement />
                        <AddAdvertisement2 />
                        <EditAdvertisementForm />
                    </section>
                    <section id="course-categories" className="db-section">
                        <AddCourseCategoryForm />
                        <EditCourseCategoryForm />
                    </section>
                    <section id="settings" className="db-section">
                        <div className="settings-content">
                            <button className="sidebar-heading-button" onClick={handleChangePassword}>
                                <FontAwesomeIcon icon={faRedoAlt} className="icon" />

                                Change Password
                            </button>
                            <Divider style={{ margin: '10px 0' }} />
                            <button className="sidebar-heading-button" onClick={handleSignOut}>
                                <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                                Sign Out
                            </button>
                        </div>
                    </section>
                    {showChangePasswordForm && (
                        <div className="change-password-overlay">
                            <div className="change-password-container">
                                <button className="close-button" onClick={handleCloseChangePasswordForm}>
                                    &times;
                                </button>
                                <ChangePasswordForm adminId={adminId} />
                            </div>
                        </div>
                    )}
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
