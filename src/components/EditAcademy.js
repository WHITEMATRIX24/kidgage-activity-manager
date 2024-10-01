import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCourseForm.css'; 
import { FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa';

const EditAcademyForm = ({ email }) => {
  const [showForm, setShowForm] = useState(true);
  const [academyData, setAcademyData] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    logo: null,
    crFile: null,
    idCard: null,
    licenseNo: '',
    academyImg: null,
    description: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchError, setSearchError] = useState('');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Edit mode state

  // Automatically trigger the handleSearch when the component mounts
  useEffect(() => {
    if (email) {
        console.log(email);
      handleSearch(email);
    }
  }, [email]);

  const handleSearch = async (query) => {
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
          password:response.data.password,
          logo: response.data.logo,
          crFile: response.data.crFile,
          idCard: response.data.idCard,
          licenseNo: response.data.licenseNo,
          academyImg: response.data.academyImg,
          description: response.data.description,
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

  // Assuming formData already contains all the fields and files
  try {
    const response = await axios.put(`https://kidgage-admin-eyau.onrender.com/api/users/update/${academyData._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setSuccess('Academy updated successfully!');
          setError('');
          setIsEditMode(false);
    console.log('Response from server:', response.data);
  } catch (error) {
    console.error('Error updating academy:', error);
      setError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
      setSuccess('');
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
        firstName: '',
        lastName: '',
        logo: [],
        crFile: [],
        idCard: [],
        licenseNo: '',
        academyImg: [],
        description: '',
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
    <div className="">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Edit/Remove a Academy</h2>
        {/* <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} /> */}
      </div>
      {/* {showForm && ( */}
        <div className='add-course-form'>
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
              <label className='sign-in-label' htmlFor="academyImg">Academy Banner</label>
              <input
                type="file"
                name="academyImg"
                onChange={handleChange}
                accept=".png, .jpg, .jpeg"
                disabled={!isEditMode}
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Academy description"
                rows="4"
                required
                disabled={!isEditMode}
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Academy Location"
                required
                disabled={!isEditMode}
              />
              <div style={{display:'flex' ,justifyContent: 'flex-start'}} className="button-group">
                {isEditMode &&(
                  <>
                  <button style={{alignSelf:'flex-end'}} type="submit" className="submit-btn">Save</button>

                  </>
                )
                }
                {!isEditMode&&(
                  <>
                  
                  <button style={{marginRight:'10px'}} type="button" className="edit-btn"  onClick={handleEdit}>
                  <FaEdit /> Edit
                </button>
              
                <button type="button" className="delete-btn" onClick={handleDelete}>
                  <FaTrash /> Delete
                </button></>
                  )}
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
            </form>
          )}
          {showConfirmPopup && (
            <div className="confirm-popup">
              <p>Are you sure you want to delete this academy?</p>
              <button onClick={handleConfirmDelete}>Yes</button>
              <button onClick={handleCancelDelete}>No</button>
            </div>
          )}
        </div>
      {/* )} */}
    </div>
  );
};

export default EditAcademyForm;
