import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import './AddCourseForm.css';

const EditCourseCategoryForm = () => {
    const [courses, setCourses] = useState([]);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [fileName, setFileName] = useState('No file chosen');
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('https://main.d3781xttwrodcq.amplifyapp.com/api/course-category/categories');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
            setFile(e.target.files[0]);
        } else {
            setFileName('No file chosen');
            setFile(null);
        }
    };

    const handleEdit = (banner) => {
        setSelectedBanner(banner);
        setEditMode(true);
    };

    const handleDelete = (banner) => {
        setBannerToDelete(banner);
        setShowConfirmPopup(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`https://main.d3781xttwrodcq.amplifyapp.com/api/course-category/delete/${bannerToDelete._id}`);
            setSelectedBanner(null);
            setEditMode(false);
            setShowConfirmPopup(false);
            setBannerToDelete(null);
            fetchCourses(); // Refresh the course list
        } catch (error) {
            console.error('Error deleting course category:', error);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmPopup(false);
        setBannerToDelete(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedBanner((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', selectedBanner.name);
        if (file) {
            formData.append('image', file);
        }

        try {
            await axios.put(`https://main.d3781xttwrodcq.amplifyapp.com/api/course-category/update/${selectedBanner._id}`, formData);
            setEditMode(false);
            setSelectedBanner(null);
            setFileName('No file chosen');
            setFile(null);
            fetchCourses(); // Refresh the course list
        } catch (error) {
            console.error('Error updating course category:', error);
        }
    };

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="add-course-form-container">
            <div className="add-course-form-header" onClick={toggleFormVisibility}>
                <h2>Edit/Remove Course Category</h2>
                <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} />
            </div>
            {showForm && (
                <div className="add-course-form">
                    {!editMode ? (
                        <div className="banner-list">
                            {courses.map((banner) => (
                                <div className="banner-box" key={banner._id}>
                                    <img src={`data:image/jpeg;base64,${banner.image}`} alt={banner.name} />
                                    <div className="banner-info">
                                        <h3>{banner.name}</h3>
                                        <div className="button-container">
                                            <button className='edit-banner-button' onClick={() => handleEdit(banner)}>
                                                <FaEdit /> Edit
                                            </button>
                                            <button className='delete-banner-button' onClick={() => handleDelete(banner)}>
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group add-course-label-group">
                                <label htmlFor="name">Title</label>
                                <label htmlFor="file-upload">Image</label>
                            </div>
                            <div className="form-group add-course-group">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder='Enter Banner Title'
                                    value={selectedBanner.name}
                                    onChange={handleChange}
                                />
                                <input
                                    type="file"
                                    id="file-upload"
                                    name="file-upload"
                                    onChange={handleFileChange}
                                />
                               
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    )}
                </div>
            )}

            {showConfirmPopup && (
                <>
                <div className="confirm-popup-overlay" ></div>
                <div className="confirm-popup">
                    <p>Are you sure you want to delete this banner?</p>
                    <button onClick={handleConfirmDelete}>Confirm Delete</button>
                    <button onClick={handleCancelDelete}>Cancel</button>
                </div>
                </>
                
            )}
        </div>
    );
};

export default EditCourseCategoryForm;
