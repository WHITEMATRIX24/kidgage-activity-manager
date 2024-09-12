import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaSearch, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './AddCourseForm.css';

function AddCourseForm() {
    const initialCourseState = {
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
        location: [''],
        courseType: '',
        images: [],
        promoted: false,
        // hashtags: [],
        // newHashtag: '#' // Initialize with '#'
    };

    const [course, setCourse] = useState(initialCourseState);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchError, setSearchError] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [courseTypes, setCourseTypes] = useState([]);

    useEffect(() => {
        const fetchCourseTypes = async () => {
            try {
                const response = await axios.get('https://kidgage-adminbackend.onrender.com/api/course-category/categories');
                setCourseTypes(response.data);
            } catch (error) {
                console.error('Error fetching course types', error);
            }
        };

        fetchCourseTypes();
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prev) => ({ ...prev, [name]: value }));
    };

    const handleDayChange = (e) => {
        const { value, checked } = e.target;
        setCourse((prev) => ({
            ...prev,
            days: checked
                ? [...prev.days, value]
                : prev.days.filter((day) => day !== value)
        }));
    };
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess('');
            }, 5000); // Hide success message after 5 seconds

            return () => clearTimeout(timer); // Cleanup the timer on component unmount
        }
    }, [success]);

    const handleHashtagChange = (e) => {
        // Ensure that '#' is always the prefix for hashtags
        const value = e.target.value;
        setCourse((prev) => ({ ...prev, newHashtag: value }));
    };

    const addHashtag = () => {
        const hashtag = course.newHashtag.trim();
        if (hashtag && !course.hashtags.includes(hashtag)) {
            setCourse((prev) => ({
                ...prev,
                hashtags: [...prev.hashtags, hashtag],
                newHashtag: '#' // Reset to default '#'
            }));
        }
    };

    const removeHashtag = (hashtag) => {
        setCourse((prev) => ({
            ...prev,
            hashtags: prev.hashtags.filter(h => h !== hashtag)
        }));
    };

    const handleTimeSlotChange = (index, e) => {
        const { name, value } = e.target;
        const timeSlots = [...course.timeSlots];
        timeSlots[index] = { ...timeSlots[index], [name]: value };
        setCourse((prev) => ({ ...prev, timeSlots }));
    };

    const addTimeSlot = () => {
        setCourse((prev) => ({ ...prev, timeSlots: [...prev.timeSlots, { from: '', to: '' }] }));
    };

    const removeTimeSlot = (index) => {
        setCourse((prev) => ({ ...prev, timeSlots: prev.timeSlots.filter((_, i) => i !== index) }));
    };

    const handleLocationChange = (index, e) => {
        const { value } = e.target;
        const location = [...course.location];
        location[index] = value;
        setCourse((prev) => ({ ...prev, location }));
    };

    const addLocation = () => {
        setCourse((prev) => ({ ...prev, location: [...prev.location, ''] }));
    };

    const removeLocation = (index) => {
        setCourse((prev) => ({ ...prev, location: prev.location.filter((_, i) => i !== index) }));
    };

    const addImage = () => {
        setCourse((prevCourse) => ({ ...prevCourse, images: [...prevCourse.images, ''] }));
    };

    const handleImageChange = (index, e) => {
        const file = e.target.files[0]; // Get the selected file
        if (file) {
            setCourse((prevCourse) => {
                const newImages = [...prevCourse.images];
                newImages[index] = file; // Store the file directly
                return { ...prevCourse, images: newImages };
            });
        }
    };

    const removeImage = (index) => {
        setCourse({ ...course, images: course.images.filter((_, i) => i !== index) });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         console.log('Course data:', course); // Add this to inspect the course data

    //         // Validate timeSlots field before sending the request
    //         if (!Array.isArray(course.timeSlots) || course.timeSlots.some((timeSlot) => !timeSlot.from || !timeSlot.to)) {
    //             return setError('Invalid timeSlots field');
    //         }

    //         // Convert timeSlots array to a JSON string
    //         const timeSlotsJson = JSON.stringify(course.timeSlots);

    //         // Create a new course object with the timeSlotsJson string
    //         const courseData = { ...course, timeSlots: timeSlotsJson };

    //         const response = await axios.post('http://localhost:5001/api/courses/addcourse', courseData, {
    //             headers: { 'Content-Type': 'application/json' } // Add this to specify the content type
    //         });
    //         console.log('Course added successfully', response.data);
    //         setCourse(initialCourseState);
    //         setSuccess('Course added successfully!');
    //         setError('');
    //     } catch (error) {
    //         console.error('Error adding course', error);
    //         if (error.response) {
    //             console.error('Error response:', error.response.data);
    //             setError(error.response.data.message);
    //         } else {
    //             setError('An error occurred. Please try again later.');
    //         }
    //         setSuccess('');
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Append all course data to the formData object
            formData.append('providerId', course.providerId);
            formData.append('name', course.name);
            formData.append('duration', course.duration);
            formData.append('durationUnit', course.durationUnit);
            formData.append('startDate', course.startDate);
            formData.append('endDate', course.endDate);
            formData.append('description', course.description);
            formData.append('feeAmount', course.feeAmount);
            formData.append('feeType', course.feeType);
            formData.append('promoted', course.promoted);
            formData.append('courseType', course.courseType);

            // Append each timeSlot as a JSON string
            formData.append('timeSlots', JSON.stringify(course.timeSlots));

            // Append days and locations as arrays
            course.days.forEach(day => formData.append('days[]', day));
            course.location.forEach(location => formData.append('location[]', location));

            // Append each image file (File object)
            course.images.forEach((image) => {
                if (image) {
                    formData.append('academyImg', image); // Send file object directly
                }
            });

            const response = await axios.post('http://localhost:5001/api/courses/addcourse', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Course added successfully', response.data);
            setCourse(initialCourseState);
            setSuccess('Course added successfully!');
            setError('');

        } catch (error) {
            console.error('Error adding course', error);
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred. Please try again later.');
            }
            setSuccess('');
        }
    };




    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://kidgage-adminbackend.onrender.com/api/users/search?query=${searchQuery}`);
            setSearchResult(response.data);
            setSearchError('');
            setCourse((prev) => ({ ...prev, providerId: response.data._id }));
        } catch (error) {
            setSearchResult(null);
            setSearchError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
        }
    };

    return (
        <div className="add-course-form-container">
            <div className="add-course-form-header" onClick={toggleFormVisibility}>
                <h2>Add Course</h2>
                <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} />
            </div>
            {showForm && (
                <form className="add-course-form" onSubmit={handleSubmit}>
                    <div className="form-group search-provider-group">
                        <label htmlFor="provider">Provider</label>
                        <input
                            type="text"
                            id="provider"
                            name="provider"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search provider by email or phone number..."
                            required
                        />
                        <button type="button" className="search-provider-button" onClick={handleSearch}>
                            <FaSearch />
                        </button>
                    </div>
                    {searchError && <p className="error-message">{searchError}</p>}
                    {searchResult && (
                        <div className="search-result">
                            <p>Provider: {searchResult.username}</p>
                            <p>Email: {searchResult.email}</p>
                            <p>ID: {searchResult._id}</p>
                        </div>
                    )}
                    <div className="form-group add-course-label-group">
                        <label htmlFor="name">Course Name</label>
                    </div>
                    <div className='form-group add-duration-group'>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder='Course Name'
                            value={course.name}
                            onChange={handleChange}
                        />

                        <select
                            id="courseType"
                            name="courseType"
                            value={course.courseType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Course Type</option>
                            {courseTypes.map((type) => (
                                <option key={type._id} value={type.name}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group add-duration-group">
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            placeholder='Course Duration'
                            value={course.duration}
                            onChange={handleChange}
                        />
                        <select
                            id="durationUnit"
                            name="durationUnit"
                            value={course.durationUnit}
                            onChange={handleChange}
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
                            value={course.startDate}
                            onChange={handleChange}
                        />
                        <input
                            className='start-date-ip'
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={course.endDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Course Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={course.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Fee Structure</label>
                        <div className="fee-structure">
                            <input
                                type="number"
                                id="feeAmount"
                                name="feeAmount"
                                value={course.feeAmount}
                                onChange={handleChange}
                                placeholder="Amount"
                            />
                            <span className="currency-symbol">QAR</span>
                            <select
                                id="feeType"
                                name="feeType"
                                value={course.feeType}
                                onChange={handleChange}
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
                                        checked={course.days.includes(day)}
                                        onChange={handleDayChange}
                                        className='days-checkbox'
                                    />
                                    {day}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <div className='btn-grpp'>
                            <label>Time Slots:</label>
                            <button type="button" className="add-time-slot-btn" onClick={addTimeSlot}>
                                Add Time Slot
                            </button>
                        </div>
                        {course.timeSlots.map((slot, index) => (
                            <div key={index} className="time-slot">
                                <input
                                    type="time"
                                    name="from"
                                    value={slot.from}
                                    onChange={(e) => handleTimeSlotChange(index, e)}
                                />
                                <span>to</span>
                                <input
                                    type="time"
                                    name="to"
                                    value={slot.to}
                                    onChange={(e) => handleTimeSlotChange(index, e)}
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        className="rem-button"
                                        onClick={() => removeTimeSlot(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="form-group">
                        <div className='btn-grpp'>
                            <label>Locations:</label>
                            <button type="button" className="add-time-slot-btn" onClick={addLocation}>
                                Add Location
                            </button>
                        </div>
                        {course.location.map((loc, index) => (
                            <div key={index} className="time-slot">
                                <input
                                    type="text"
                                    name="location"
                                    value={loc}
                                    placeholder={index === 0 ? 'Location' : `Location ${index}`}
                                    onChange={(e) => handleLocationChange(index, e)}
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        className="rem-button"
                                        onClick={() => removeLocation(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="form-group">
                        <div className='btn-grpp'>
                            <label>Course Images:</label>
                            <button type="button" className="add-time-slot-btn" onClick={addImage}>
                                Add Images
                            </button>
                        </div>
                        {course.images.map((img, index) => (
                            <div key={index} className="time-slot">
                                <input
                                    type="file"
                                    name={index === 0 ? "academyImg" : `academyImg-${index}`}
                                    onChange={(e) => handleImageChange(index, e)}
                                    accept=".png, .jpg, .jpeg"
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        className="rem-button"
                                        onClick={() => removeImage(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>


                    <button type="submit" className="submit-button">Submit</button>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </form>
            )}
        </div>
    );
}

export default AddCourseForm;
