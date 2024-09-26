import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import './AddCourseForm.css'; // Reuse the same CSS file for styling
import { FaChevronDown, FaEdit, FaTrash, FaSearch,FaTrashAlt,FaPlus } from 'react-icons/fa';

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
                    images: response.data.images || [], // Fetch images from the response
                    promoted: response.data.promoted,
                    ageGroup: response.data.ageGroup,
                    preferredGender: response.data.preferredGender
                });
                setSearchError('');
                setError('');
                setIsEditMode(false);
                console.log(response.data.images);
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
        console.log(courseData); // Original course data
        console.log(formData); // New form data
    
        if (isEditMode) {
            // Create an object to hold the modified fields
            const modifiedData = {};
    
            // Check for each field to see if it's different from the original course data
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== courseData[key]) {
                    modifiedData[key] = formData[key];
                }
            });
    
            // Check if there's any modified data before sending the request
            if (Object.keys(modifiedData).length === 0) {
                setError('No changes made to the course data.');
                return;
            }
    
            try {
                const response = await axios.put(
                    `https://kidgage-admin-rdld.onrender.com/api/courses/update/${courseData._id}`,
                    modifiedData // Send only modified data
                );
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
    // // Add a new image input
    // const addImage = () => {
    //     setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    // };

    // // Remove an image input
    // const removeImage = (index) => {
    //     setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    // };

    // // Handle image uploads
    // const handleImageChange = (index, e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setFormData(prev => {
    //             const newImages = [...prev.images];
    //             newImages[index] = file;
    //             return { ...prev, images: newImages };
    //         });
    //     }
    // };
    const fileInputRef = useRef(null); // Reference for the file input
// Helper function to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary); // Encode binary string to Base64
};
    const handleImageChange = (event) => {
        const files = event.target.files;
        const newImagesPromises = Array.from(files).map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
    
                // Read the file as an ArrayBuffer
                reader.readAsArrayBuffer(file);
    
                reader.onload = () => {
                    // Convert the ArrayBuffer to Base64
                    const base64String = arrayBufferToBase64(reader.result);
                    resolve(base64String); // Resolve promise with the Base64 string
                };
    
                reader.onerror = (error) => {
                    reject(error); // Reject promise on error
                };
            });
        });
        // Wait for all images to be read and then update the state
        Promise.all(newImagesPromises).then((loadedImages) => {
            setFormData(prevState => ({
                ...prevState,
                images: [...prevState.images, ...loadedImages] // Add new images to the existing array
            }));
        });

        event.target.value = null; // Reset file input
    };

    // Function to trigger file input
    const addImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Simulate click on file input
        }
    };

    // Function to remove an image
    const removeImage = (index) => {
        const updatedImages = formData.images.filter((_, imgIndex) => imgIndex !== index);
        setFormData(prevState => ({
            ...prevState,
            images: updatedImages // Update images in state
        }));
    };
    const getBase64ImageSrc = (base64String) => `data:image/jpeg;base64,${base64String}`;

    
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
                                        <select
                                            name="city"
                                            value={loc.city}
                                            onChange={(e) => handleLocationChange(index, 'city', e.target.value)}
                                            style={{ width: '33%' }}
                                        >
                                            <option value="Doha">Doha</option>
                                            <option value="Al Rayyan">Al Rayyan</option>
                                            <option value="Al Wakrah">Al Wakrah</option>
                                            <option value="Al Shamal">Al Shamal</option>
                                            <option value="Al Khor">Al Khor</option>
                                            <option value="Umm Salal">Umm Salal</option>
                                            <option value="Al Daayen">Al Daayen</option>
                                            <option value="Al Shahaniya">Al Shahaniya</option>
                                            <option value="Dukhan">Dukhan</option>
                                            <option value="Mesaieed">Mesaieed</option>

                                        </select>


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
                            {/* <div className="form-group">
                                <div className='btn-grpp'>
                                    <label>Course Images<span style={{ fontSize: '.8rem', color: 'grey' }}> [ size: 1280 X 1028 ]</span>:</label>
                                    <button type="button" className="add-time-slot-btn" onClick={addImage} disabled={!isEditMode}>
                                        Add Images
                                    </button>
                                </div>

                                {formData.images.map((img, index) => (

                                    <div key={index} className="time-slot">
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
                            </div> */}
                            {/* Display Saved Images or Text if None */}
                            <div className="saved-images-display">
                <label>Saved Course Images:</label>
                <div className="image-grid">
                    {formData.images && formData.images.length > 0 ? (
                        formData.images.map((img, index) => (
                            <div key={index} className="image-container">
                                <img
                                    src={getBase64ImageSrc(img)} // Use the same method for displaying images
                                    alt={`Course-${index + 1}`} 
                                    className="saved-image"
                                    style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                />
                                {isEditMode && (
                                    <div className="image-actions">
                                        <button 
                                            type="button" 
                                            onClick={() => removeImage(index)} 
                                            className="remove-image-button"
                                            title="Remove Image"
                                            style={{ width: '100%' }}
                                        >
                                            <FaTrashAlt /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No images available</p>
                    )}
                    {isEditMode && (
                    <div className="add-image-container">
                        <button 
                            type="button" 
                            className="add-image-button" 
                            onClick={addImage}
                            title="Add Image"
                            style={{ background: 'transparent', border: '1px solid #ccc' }}
                        >
                            <FaPlus style={{ height: '200px', width: '50px', fontSize: '64px', color: '#387CB8' }} />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            style={{ display: 'none' }} // Hide the file input
                            accept="image/*" // Accept only image files
                            multiple // Allow multiple file selection
                        />
                    </div>
                )}
                </div>
                
                
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
