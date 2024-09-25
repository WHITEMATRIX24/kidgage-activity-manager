import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCourseForm.css'; // Reuse the same CSS file for styling
import { FaChevronDown, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import LocationInput from './LocationInput'; // Reuse the LocationInput component

const EditCourseForm = () => {
    const [showForm, setShowForm] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [courseData, setCourseData] = useState(null);
    const [formData, setFormData] = useState({
        providerId: '',
        name: '',
        duration: '',
        durationUnit: 'days',
        startDate: '',
        endDate: '',
        description: '',
        feeAmount: '',
        feeType: 'full_course',
        days: [],
        timeSlots: [{ from: '', to: '' }],
        location: [
            { address: '', city: '', phoneNumber: '' }
        ],
        courseType: '',
        images: [],
        promoted: false,
        ageGroup: { ageStart: '', ageEnd: '' },
        preferredGender: 'Any'
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
                const response = await axios.get('https://kidgage-admin-rdld.onrender.com/api/course-category/categories');
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
            const response = await axios.get(`https://kidgage-admin-rdld.onrender.com/api/courses/search?name=${searchQuery}`);
            if (response.data) {
                setCourseData(response.data);
                setFormData({
                    providerId: response.data.providerId,
                    name: response.data.name,
                    duration: response.data.duration,
                    durationUnit: response.data.durationUnit,
                    startDate: response.data.startDate,
                    endDate: response.data.endDate,
                    description: response.data.description,
                    feeAmount: response.data.feeAmount,
                    feeType: response.data.feeType,
                    days: response.data.days,
                    timeSlots: response.data.timeSlots,
                    location: response.data.location,
                    courseType: response.data.courseType,
                    images: [], // Images are handled separately
                    promoted: response.data.promoted,
                    ageGroup: response.data.ageGroup,
                    preferredGender: response.data.preferredGender
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
                const response = await axios.put(`https://kidgage-admin-rdld.onrender.com/api/courses/update/${courseData._id}`, formData);
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
            await axios.delete(`https://kidgage-admin-rdld.onrender.com/api/courses/delete/${courseData._id}`);
            setCourseData(null);
            setFormData({
                providerId: '',
                name: '',
                duration: '',
                durationUnit: 'days',
                startDate: '',
                endDate: '',
                description: '',
                feeAmount: '',
                feeType: 'full_course',
                days: [],
                timeSlots: [{ from: '', to: '' }],
                location: [
                    { address: '', city: '', phoneNumber: '' }
                ],
                courseType: '',
                images: [],
                promoted: false,
                ageGroup: { ageStart: '', ageEnd: '' },
                preferredGender: 'Any'
            });
            setShowConfirmPopup(false);
            setSuccess('Course deleted successfully!');
        } catch (error) {
            setError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
            setSuccess('');
            setShowConfirmPopup(false);
        }
    };
    const [courseTypes, setCourseTypes] = useState([]);

    // Fetch course categories when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://kidgage-admin-rdld.onrender.com/api/course-category/categories');
                setCourseTypes(response.data);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };
        fetchCategories();
    }, []);

    const handleCancelDelete = () => {
        setShowConfirmPopup(false);
    };

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };
    // Handle location changes
    const handleLocationChange = (index, field, value) => {
        const updatedLocation = [...formData.location];
        updatedLocation[index] = {
            ...updatedLocation[index],
            [field]: value
        };
        setFormData(prev => ({ ...prev, location: updatedLocation }));
    };

    // Add a new location
    const addLocation = () => {
        setFormData(prev => ({ ...prev, location: [...prev.location, { address: '', city: '', phoneNumber: '' }] }));
    };

    // Remove a location
    const removeLocation = (index) => {
        setFormData(prev => ({ ...prev, location: prev.location.filter((_, i) => i !== index) }));
    };
    // Add a new image input
    const addImage = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    // Remove an image input
    const removeImage = (index) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    // Handle image uploads
    const handleImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => {
                const newImages = [...prev.images];
                newImages[index] = file;
                return { ...prev, images: newImages };
            });
        }
    };

    const handleAgeGroupChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            ageGroup: Array.isArray(prev.ageGroup) && prev.ageGroup.length > 0
                ? prev.ageGroup.map((group, index) =>
                    index === 0
                        ? { ...group, [name]: value }  // Update the first object in the array
                        : group
                )
                : [{ [name]: value }] // If ageGroup is empty or not an array, initialize it with an object
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

                            <div className="form-group add-course-group">
                                <label htmlFor="name">Course Name</label>
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
                            {/* Preferred Gender and Course Type */}
                            <div className="form-group add-course-label-group">
                                <label htmlFor="preferredGender">Preferred Gender</label>
                                <label htmlFor="courseType">Course Type</label>
                            </div>
                            <div className='form-group add-duration-group'>
                                <select
                                    id="preferredGender"
                                    name="preferredGender"
                                    value={formData.preferredGender}
                                    onChange={handleChange}
                                    required
                                    disabled={!isEditMode}
                                >
                                    <option value="Any">Any</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <select
                                    id="courseType"
                                    name="courseType"
                                    value={formData.courseType}
                                    onChange={handleChange}
                                    required
                                    disabled={!isEditMode}
                                >
                                    <option value="">Select Course Type</option>
                                    {courseTypes.map((type) => (
                                        <option key={type._id} value={type.name}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
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
                                    value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    disabled={!isEditMode}
                                />
                                <input
                                    className='start-date-ip'
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
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

                                <div className='btn-grpp'>
                                    <label>Time Slots:</label>
                                    <button disabled={!isEditMode} type="button" className="add-time-slot-btn" onClick={addTimeSlot}>
                                        Add Time Slot
                                    </button>
                                </div>
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
                            {/* Age Group */}
                            <div className="form-group add-course-label-group">
                                <label htmlFor="ageStart">Age Group Start</label>
                                <label htmlFor="ageEnd">Age Group End</label>
                            </div>
                            <div className="form-group add-duration-group">
                                <input
                                    type="date"
                                    id="ageStart"
                                    name="ageStart"
                                    placeholder='Start Age'
                                    value={
                                        formData.ageGroup && formData.ageGroup[0]?.ageStart
                                            ? new Date(formData.ageGroup[0].ageStart).toISOString().split('T')[0]
                                            : ''
                                    }
                                    onChange={handleAgeGroupChange}
                                    required
                                    disabled={!isEditMode}
                                />
                                <input
                                    type="date"
                                    id="ageEnd"
                                    name="ageEnd"
                                    placeholder='End Age'
                                    value={
                                        formData.ageGroup && formData.ageGroup[0]?.ageEnd
                                            ? new Date(formData.ageGroup[0].ageEnd).toISOString().split('T')[0]
                                            : ''
                                    }
                                    onChange={handleAgeGroupChange}
                                    required
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div className="form-group">
                                <div className='btn-grpp'>
                                    <label>Locations:</label>
                                    <button type="button" className="add-time-slot-btn" onClick={addLocation} disabled={!isEditMode}>
                                        Add Location
                                    </button>
                                </div>
                                {formData.location.map((loc, index) => (
                                    <div key={index} className="time-slot" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        {/* Address input */}
                                        <input
                                            type="text"
                                            name="address"
                                            value={loc.address}
                                            placeholder={index === 0 ? 'Address' : `Address ${index + 1}`}
                                            onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                                            style={{ width: '30%' }}
                                            required
                                            disabled={!isEditMode}
                                        />

                                        {/* City input using LocationInput component */}
                                        <LocationInput
                                            value={loc.city}
                                            onSelectAddress={(newCity) => handleLocationChange(index, 'city', newCity)}
                                            disabled={!isEditMode}
                                            placeholder={index === 0 ? 'city' : `city ${index + 1}`}
                                            style={{ width: '30%' }}
                                        />

                                        {/* Phone Number input */}
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={loc.phoneNumber}
                                            placeholder={index === 0 ? 'Phone Number' : `Phone Number ${index + 1}`}
                                            onChange={(e) => handleLocationChange(index, 'phoneNumber', e.target.value)}
                                            style={{ width: '30%' }}
                                            required
                                            disabled={!isEditMode}
                                        />

                                        {/* Remove Location Button */}
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                className="rem-button"
                                                onClick={() => removeLocation(index)}
                                                disabled={!isEditMode}
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {/* Course Images */}
                            <div className="form-group">
                                <div className='btn-grpp'>
                                    <label>Course Images<span style={{ fontSize: '.8rem', color: 'grey' }}> [ size: 1280 X 1028 ]</span>:</label>
                                    <button type="button" className="add-time-slot-btn" onClick={addImage} disabled={!isEditMode}>
                                        Add Images
                                    </button>
                                </div>

                                {formData.images.map((img, index) => (

                                    <div key={index} className="time-slot">
                                        {/* Display existing image in base64 format */}
                                        <input
                                            type="file"
                                            name={`academyImg-${index}`}
                                            onChange={(e) => handleImageChange(index, e)}
                                            accept=".png, .jpg, .jpeg"
                                            disabled={!isEditMode}
                                            required={index === 0} // Require at least one image
                                        />
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                className="rem-button"
                                                onClick={() => removeImage(index)}
                                                disabled={!isEditMode}
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}

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
