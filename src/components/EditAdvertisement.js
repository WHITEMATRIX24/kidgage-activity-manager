import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa';
import './EditBannerForm.css';

const EditAdvertisementForm = () => {
    const [showForm, setShowForm] = useState(false);
    const [advertisements, setAdvertisements] = useState([]);
    const [editingAdvertisement, setEditingAdvertisement] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingAdvertisementId, setDeletingAdvertisementId] = useState(null);
    const [desktopFileName, setDesktopFileName] = useState('No file chosen');
    const [mobileFileName, setMobileFileName] = useState('No file chosen');

    useEffect(() => {
        fetchAdvertisements();
    }, []);

    const fetchAdvertisements = async () => {
        try {
            const response = await axios.get('https://kidgage-admin-cxde.onrender.com/api/advertisement');
            setAdvertisements(response.data);
        } catch (error) {
            console.error('Error fetching advertisements:', error);
        }
    };

    const handleFileChange = (e, type) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setEditingAdvertisement((prev) => ({ ...prev, [type]: file }));
            type === 'desktopImage' ? setDesktopFileName(file.name) : setMobileFileName(file.name);
        } else {
            type === 'desktopImage' ? setDesktopFileName('No file chosen') : setMobileFileName('No file chosen');
        }
    };

    const handleEdit = (advertisement) => {
        setEditingAdvertisement(advertisement);
        setDesktopFileName('No file chosen');
        setMobileFileName('No file chosen');
    };

    const handleDelete = (advertisementId) => {
        setDeletingAdvertisementId(advertisementId);
        setShowDeleteModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingAdvertisement((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', editingAdvertisement.title);
            if (desktopFileName !== 'No file chosen') {
                formData.append('desktopImage', editingAdvertisement.desktopImage);
            }
            if (mobileFileName !== 'No file chosen') {
                formData.append('mobileImage', editingAdvertisement.mobileImage);
            }

            await axios.put(`https://kidgage-admin-cxde.onrender.com/api/advertisement/${editingAdvertisement._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchAdvertisements();
            setEditingAdvertisement(null);
            setDesktopFileName('No file chosen');
            setMobileFileName('No file chosen');
        } catch (error) {
            console.error('Error updating advertisement:', error);
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`https://kidgage-admin-cxde.onrender.com/api/advertisement/${deletingAdvertisementId}`);
            fetchAdvertisements();
            setShowDeleteModal(false);
            setDeletingAdvertisementId(null);
        } catch (error) {
            console.error('Error deleting advertisement:', error);
        }
    };

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="add-course-form-container">
            <div className="add-course-form-header" onClick={toggleFormVisibility}>
                <h2>Edit/Remove Advertisement</h2>
                <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} />
            </div>
            {showForm && (
                <div className="add-course-form">
                    {editingAdvertisement ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={editingAdvertisement.title}
                                    onChange={handleChange}
                                    placeholder="Enter Advertisement Title"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="desktop-file-upload">Desktop Image</label>
                                <input
                                    type="file"
                                    id="desktop-file-upload"
                                    onChange={(e) => handleFileChange(e, 'desktopImage')}
                                />
                                <span>{desktopFileName}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="mobile-file-upload">Mobile Image</label>
                                <input
                                    type="file"
                                    id="mobile-file-upload"
                                    onChange={(e) => handleFileChange(e, 'mobileImage')}
                                />
                                <span>{mobileFileName}</span>
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    ) : (
                        <div className="poster-list">
                            {advertisements.map(ad => (
                                <div key={ad._id} className="poster-box">
                                    <div className='poster-img-cont'>
                                    <img src={`data:image/jpeg;base64,${ad.mobileImage}`} alt={ad.title} />
                                    <img src={`data:image/jpeg;base64,${ad.desktopImage}`} alt={ad.title} />
                                    </div>
                                    <div className="poster-info">
                                        <div className='poster-info-text'>
                                            <h3>{ad.title}</h3>
                                        </div>
                                        <div className="button-container">
                                            <button className='edit-banner-button' onClick={() => handleEdit(ad)}>
                                                <FaEdit /> Edit
                                            </button>
                                            <button className='delete-banner-button' onClick={() => handleDelete(ad._id)}>
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
                    <p>Are you sure you want to delete this advertisement?</p>
                    <button onClick={confirmDelete}>Confirm</button>
                    <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default EditAdvertisementForm;
