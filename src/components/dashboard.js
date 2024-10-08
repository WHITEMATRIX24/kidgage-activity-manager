import React, { useState, useRef, useEffect } from 'react';
import { faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Sidebar from './sidebar'; // Ensure correct path
import './dashboard.css'; // Ensure correct path
import AddCourseForm from './AddCourseForm';
import EditCourseForm from './EditCourseForm';
import AddAcademyForm from './AddAcademyForm';
import ManageCourses from './ManageCourses';
import AddParentForm from './AddParentForm';
import AddStudentForm from './AddStudentForm';
import AddBannerForm from './AddBannerForm';
import EditBannerForm from './EditBannerForm';
import AddPosterForm from './AddPosterForm';
import EditPosterForm from './EditPosterForm';
import AddCourseCategoryForm from './AddCourseCategory';
import EditCourseCategoryForm from './EditCourseCategoryForm';
import EditParentForm from './EditParentForm';
import EditStudentForm from './EditStudentForm';
import ManageAcademy from './ManageAcademy';
import RequestsPopup from './RequestsPopup';
import AddAdvertisement from './AddAdvertisement1';
import AddAdvertisement2 from './AddAdvertisement2';
import EditAdvertisementForm from './EditAdvertisement';
import PromoteCourse from './PromoteCourse';
import { Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import ChangePasswordForm from './ChangePasswordForm';
import Logo from './assets/images/logo2.png';
import ViewAcademy from './ViewAcademy';
import ViewCourses from './ViewCourses';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'poster' or 'student'
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false); // New state
    const [adminId, setAdminId] = useState('');
    const [adminRole, setAdminRole] = useState('');
    const [Name, setName] = useState('');
    const [email, setEmail] = useState('');


    useEffect(() => {
        // Retrieve adminId and adminRole from sessionStorage
        const storedId = sessionStorage.getItem('adminId');
        const storedRole = sessionStorage.getItem('adminRole');
        const storedName = sessionStorage.getItem('Name');
        const storedEmail = sessionStorage.getItem('email');


        if (storedId && storedRole) {
          setAdminId(storedId);
          setAdminRole(storedRole);
          setName(storedName);
          setEmail(storedEmail);


        }
      }, []);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const handleSignOut = () => {
        // Clear sessionStorage values for adminId, adminRole, and Name
        sessionStorage.removeItem('adminId');
        sessionStorage.removeItem('adminRole');
        sessionStorage.removeItem('Name');
        
        // Redirect to the homepage
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
    const [showRequests, setShowRequests] = useState(false); // Track requests list visibility
    const requestsRef = useRef(null); // Create a reference for the requests list
    const popupRef = useRef(null); // Reference for the popup window

    const toggleRequests = () => {
        setShowRequests(!showRequests); // Toggle requests list visibility
    };

    const closeRequests = () => {
        setShowRequests(false); // Close the requests list
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (requestsRef.current && !requestsRef.current.contains(event.target)) {
                setShowRequests(false); // Close if click is outside of requests container
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [requestsRef]);
    if (!adminRole) {
        return <div className="no-access">You do not have access to the dashboard.</div>;
    }
    return (
        <div className="dashboard-body">
            <div className="hamburger-menu" onClick={toggleSidebar}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className='header-dash'>
                <img className='dash-logo' src={Logo}></img>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <h1>Activity Manager</h1>
                    {adminRole === 'admin' && (
                    <>
                    <div style={{ alignSelf: 'flex-end', marginRight: '10%', fontSize: 'x-large', fontWeight: 'bold', color: 'black', cursor: 'pointer' }} onClick={toggleRequests}>
                        <FontAwesomeIcon icon={faEnvelope} /> Requests
                    </div>
                    </>
                    )}
                    {showRequests && (
                        <RequestsPopup show={showRequests} closeRequests={closeRequests} />
                    )}
                </div>
                
            </div>
            <div className={`dashboard-card ${sidebarOpen ? 'expanded' : ''}`}>

                <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`dashboard-content ${sidebarOpen ? 'expanded' : ''}`}>
                {adminRole === 'admin' && (
                    <>
                    <section id="courses" className="db-section">
                        <ViewCourses/>
                        {/* <AddCourseForm /> */}
                        <PromoteCourse />
                        {/* <EditCourseForm /> */}
                    </section>
                    <section id="academies" className="db-section">
                    <ViewAcademy/>
                        {/* <AddAcademyForm /> */}
                        {/* <EditAcademyForm /> */}
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
                    </section>
                    <section id="advertisements" className="db-section">
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
                    </>
                    )}
                {adminRole === 'provider' && (
                    <>
                    <section id="courses" className="db-section">
                        <ManageCourses/>
                        {/* <AddCourseForm /> */}
                        <PromoteCourse />
                        {/* <EditCourseForm /> */}
                    </section>
                    <section id="academies" className="db-section">
                        {/* <ViewAcademy/> */}
                        {/* <AddAcademyForm /> */}
                        <ManageAcademy/>
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
                    </>
                    )}
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
