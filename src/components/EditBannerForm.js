import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa';
import './EditBannerForm.css';

const EditBannerForm = () => {
    const [showForm, setShowForm] = useState(false);
    const [banners, setBanners] = useState([]);
    const [editingBanner, setEditingBanner] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingBannerId, setDeletingBannerId] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await axios.get('https://kidgage-adminbackend.onrender.com/api/banners');
            setBanners(response.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
            setEditingBanner((prev) => ({ ...prev, image: e.target.files[0] }));
        } else {
            setFileName('No file chosen');
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
    };

    const handleDelete = (bannerId) => {
        setDeletingBannerId(bannerId);
        setShowDeleteModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingBanner((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', editingBanner.title);
            formData.append('bookingLink', editingBanner.bookingLink);
            if (fileName !== 'No file chosen') {
                formData.append('image', editingBanner.image);
            }

            await axios.put(`https://kidgage-adminbackend.onrender.com/api/banners/${editingBanner._id}`, formData);
            fetchBanners();
            setEditingBanner(null);
            setFileName('No file chosen');
        } catch (error) {
            console.error('Error updating banner:', error);
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`https://kidgage-adminbackend.onrender.com/api/banners/${deletingBannerId}`);
            fetchBanners();
            setShowDeleteModal(false);
            setDeletingBannerId(null);
        } catch (error) {
            console.error('Error deleting banner:', error);
        }
    };

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="add-course-form-container">
            <div className="add-course-form-header" onClick={toggleFormVisibility}>
                <h2>Edit/Remove Banner</h2>
                <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} />
            </div>
            {showForm && (
                <div className="add-course-form">
                    {editingBanner ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group add-course-label-group">
                                <label htmlFor="title">Title</label>
                                <label htmlFor="file-upload">Image</label>
                            </div>
                            <div className="form-group add-course-group">
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={editingBanner.title}
                                    onChange={handleChange}
                                    placeholder="Enter Banner Title"
                                />
                                <input
                                    type="file"
                                    id="file-upload"
                                    name="file-upload"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bookingLink">Booking Link</label>
                                <input
                                    type="text"
                                    id="bookingLink"
                                    name="bookingLink"
                                    value={editingBanner.bookingLink}
                                    onChange={handleChange}
                                    placeholder="Enter Booking Link"
                                />
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    ) : (
                        <div className="banner-list">
                            {banners.map(banner => (
                                <div key={banner._id} className="banner-box">
                                    <img src={banner.imageUrl} alt={banner.title} />
                                    <div className="banner-info">
                                        <h3>{banner.title}</h3>
                                        <p>{banner.bookingLink}</p>
                                        <div className="button-container">
                                            <button className='edit-banner-button' onClick={() => handleEdit(banner)}>
                                                <FaEdit /> Edit
                                            </button>
                                            <button className='delete-banner-button' onClick={() => handleDelete(banner._id)}>
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {showDeleteModal && (
                <div className="confirm-popup">
                    <h2>Confirm Delete</h2>
                    <p>Are you sure you want to delete this banner?</p>
                    <button onClick={confirmDelete}>Confirm</button>
                    <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default EditBannerForm;
