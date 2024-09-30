import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import './AddCourseForm.css'; 
import { FaChevronDown, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const EditAcademyForm = () => {
  const [showForm, setShowForm] = useState(true);
  const [query, setQuery] = useState('');
  const [academyData, setAcademyData] = useState(null);
  const [academyTypes, setAcademyTypes] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    logo: [],
    crFile: [],
    idCard: [],
    licenseNo: '',
    academyImg: [],
    description: '',
    academyType: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchError, setSearchError] = useState('');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Edit mode state

  useEffect(() => {
    const fetchAcademyTypes = async () => {
      try {
        const response = await axios.get('https://kidgage-admin-eyau.onrender.com/api/course-category/categories');
        setAcademyTypes(response.data);
      } catch (error) {
        console.error('Error fetching academy types', error);
      }
    };

    fetchAcademyTypes();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get('https://kidgage-admin-eyau.onrender.com/api/users/search', {
        params: { query }
      });
      if (response.data) {
        setAcademyData(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          logo: response.data.logo,
          crFile: response.data.crFile,
          idCard: response.data.idCard,
          licenseNo: response.data.licenseNo,
          academyImg: response.data.academyImg,
          description: response.data.description,
          academyType: response.data.academyType,
          location: response.data.location,
        });
        setError('');
        setSearchError('');
        setIsEditMode(false); // Reset edit mode
      } else {
        setSearchError('Academy not found.');
        setAcademyData(null);
      }
    } catch (error) {
      console.error('Error searching academy:', error);
      setAcademyData(null);
      setSearchError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
    }
  };
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000); // Hide success message after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [success]);

  
const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let formData = new FormData();
  
    if (files) {
      // Handle file inputs
      Object.keys(files).forEach(key => {
        const file = files[key];
        const reader = new FileReader();
        reader.onloadend = () => {
          formData.append(name, reader.result);
        };
        reader.readAsDataURL(file);
      });
    } else {
      // Handle text inputs
      formData.append(name, value);
    }
  
    // Update the state with the FormData object
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (isEditMode) {
    try {

      const response = await axios.put(`https://kidgage-admin-eyau.onrender.com/api/users/academy/${academyData._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Academy updated successfully!');
      setError('');
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating academy:', error);
      setError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
      setSuccess('');
    }
  }
};


  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDelete = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`https://kidgage-admin-eyau.onrender.com/api/users/academy/${academyData._id}`);
      setAcademyData(null);
      setFormData({
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        logo: [],
        crFile: [],
        idCard: [],
        licenseNo: '',
        academyImg: [],
        description: '',
        academyType: '',
        location: '',
      });
      setShowConfirmPopup(false);
      setError('');
      setSuccess('Academy deleted successfully!');
    } catch (error) {
      console.error('Error deleting academy:', error);
      setError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
      setSuccess('');
      setShowConfirmPopup(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmPopup(false);
  };

  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Edit/Remove a Academy</h2>
        <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} />
      </div>
      {showForm && (
        <div className='add-course-form'>
          {!isEditMode && (
            <div className="form-group search-provider-group">
              <label htmlFor="query">Search Academy</label>
              <input
                type="text"
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by email or phone..."
              />
              <button type="button" className="search-provider-button" onClick={handleSearch}>
                <FaSearch />
              </button>
            </div>
          )}
          {searchError && <p className="error-message">{searchError}</p>}
          {academyData && (
            <form className="add-course-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Academy Name"
                required
                disabled={!isEditMode}
            />

            <select
                id="academyType"
                name="academyType"
                value={formData.academyType}
                onChange={handleChange}
                required
                disabled={!isEditMode}
            >
            <option value="">Select Academy Type</option>
                {academyTypes.map((type) => (
            <option key={type._id} value={type.name}>
                {type.name}
            </option>
            ))}
            </select>

            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-mail ID"
                required
                disabled={!isEditMode}
            />
            <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone number"
                required
                disabled={!isEditMode}
            />
            <div className='side-by-side'>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                    disabled={!isEditMode}
                />
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    required
                    disabled={!isEditMode}
                />
            </div>
            <label className='sign-in-label' htmlFor="logo">Academy Logo</label>
            <div className='side-by-side'>
            <input
                        type="file"
                        name="logo"
                        onChange={handleChange}
                        disabled={!isEditMode}
                        accept=".png, .jpg, .jpeg"
                    />
                <input
                    type="text"
                    name="licenseNo"
                    value={formData.licenseNo}
                    onChange={handleChange}
                    placeholder="License number"
                    required
                    disabled={!isEditMode}
                />
            </div>
            <div className='add-upload-label-group'>
                <label className='sign-in-label' htmlFor="crFile">CR</label>
                <label className='sign-in-label' htmlFor="idCard">ID Card</label>
            </div>
            <div className='side-by-side'>
                    <input
                        type="file"
                        name="crFile"
                        onChange={handleChange}
                        accept=".pdf"
                        disabled={!isEditMode}
                    />
                <input
                    type="file"
                    name="idCard"
                    onChange={handleChange}
                    accept=".pdf"
                    disabled={!isEditMode}
                />
            </div>

            <label 
                className='sign-in-label' 
                htmlFor="academyImg">Academy Image
            </label>
            <input 
                type="file" 
                name="academyImg" 
                onChange={handleChange} 
                disabled={!isEditMode}

                accept=".png, .jpg, .jpeg" />

            <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                disabled={!isEditMode}
                placeholder="Enter description here..." rows="4" cols="50" />

            <div className='form-group'>
                <label htmlFor="location">Add Location</label>
                <input
                    type="url"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter map URL"
                    disabled={!isEditMode}
                />
            </div>
            <div className="button-container">
                {!isEditMode ? (
                  <>
                  <></>
                    <button type="button" onClick={handleEdit}><FaEdit /> Edit</button>
                    <button type="button" className='delete-course-button' onClick={handleDelete}>
                      <FaTrash /> Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button type="submit" className='save-btn'>Save</button>
                  </>
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
            <p>Are you sure you want to delete this academy?</p>
            <button onClick={handleConfirmDelete}>Yes</button>
            <button onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAcademyForm;
