import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCourseForm.css'; 
import { FaEdit, FaTrash } from 'react-icons/fa';

const EditAcademyForm = ({ email }) => {
  const [showForm, setShowForm] = useState(true);
  const [academyData, setAcademyData] = useState(null);
  const cities = [
    "Doha", "Al Wakrah", "Al Khor", "Al Rayyan", 
    "Al Shamal", "Al Shahaniya", "Al Daayen", 
    "Umm Salal", "Dukhan", "Mesaieed"
  ];
  const [charCount, setCharCount] = useState(0);
const charLimit = 500;
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    fullName: '',
    designation: '',
    website: '',
    instaId: '',
    logo: [],
    crFile: [],
    licenseNo: '',
    academyImg: [],
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
      const response = await axios.get('https://kidgage-adminbackend.onrender.com/api/users/search', {
        params: { query }
      });
      if (response.data) {
        setAcademyData(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          fullName: response.data.fullName,
          designation: response.data.designation,
          website: response.data.website,
          instaId: response.data.instaId,
          logo: response.data.logo,
          crFile: response.data.crFile,
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
  const downloadFile = () => {
    const base64String = academyData.crFile; // Assuming this is the Base64 string
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64String}`; // Change mime type if needed
    link.download = 'CRFile.pdf'; // Provide a default name
    link.click();
  };
const handleChange = (e) => {
  const { name, value, type, files } = e.target;
  let formData = new FormData();
  if (name === 'description') {
    setCharCount(value.length);
  }
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
const [fileError, setFileError] = useState('');

const handleFileChange = (e) => {
  const { name, files } = e.target;

  if (files && files[0]) {
    const file = files[0];
    if (file.size > 1024 * 1024) { // 1MB in bytes
      setFileError(`The file size of ${file.name} exceeds 1MB.`);
      setFormData(prevState => ({
        ...prevState,
        [name]: [] // Clear the file if the size is too large
      }));
    } else {
      setFileError(''); // Clear error if file size is valid

      // Convert the file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevState => ({
          ...prevState,
          [name]: reader.result.split(',')[1] // Extract only the base64 data
        }));
      };
      reader.readAsDataURL(file);
    }
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (isEditMode) {
    try {
      const updatedFormData = {
        ...formData,
        logo: formData.logo, // base64 encoded logo
        crFile: formData.crFile, // base64 encoded crFile
        academyImg: formData.academyImg // base64 encoded academyImg
      };

      await axios.put(`https://kidgage-adminbackend.onrender.com/api/users/update/${academyData._id}`, updatedFormData, {
        headers: { 'Content-Type': 'application/json' }
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
const handleEditSubmit = async (e) => {
  e.preventDefault();
  const userId = sessionStorage.getItem('userid');

  // Create a new FormData object to send both text fields and file uploads
  const formDataToSend = new FormData();
  formDataToSend.append('licenseNo', formData.licenseNo);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('phoneNumber', formData.phoneNumber);
  formDataToSend.append('fullName', formData.fullName);
  formDataToSend.append('designation', formData.designation);
  formDataToSend.append('website', formData.website);
  formDataToSend.append('instaId', formData.instaId);
  formDataToSend.append('location', formData.location);
  formDataToSend.append('description', formData.description);

  if (formData.academyImg) {
    formDataToSend.append('academyImg', formData.academyImg); // Append Academy Image file
  }
  if (formData.crFile) {
    formDataToSend.append('crFile', formData.crFile); // Append Academy Image file
  }

  if (formData.logo) {
    formDataToSend.append('logo', formData.logo); // Append Logo file
  }

  try {
    const response = await fetch(`https://kidgage-adminbackend.onrender.com/api/users/update/${academyData._id}`, {
      method: 'POST',
      body: formDataToSend, // Use FormData for file uploads
    });

    if (!response.ok) {
      throw new Error('Failed to update user details.');
    }

    alert('Profile updated successfully!');
    setShowForm(false); // Hide form after successful update
  } catch (error) {
    setError(error.message);
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

      await axios.delete(`https://kidgage-adminbackend.onrender.com/api/users/academy/${academyData._id}`);
      setAcademyData(null);
      setFormData({
        username: '',
        email: '',
        phoneNumber: '',
        fullName: '',
        designation: '',
        website: '',
        instaId: '',
        logo: [],
        crFile: [],
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
        <div className='add-course-form'>
          {searchError && <p className="error-message">{searchError}</p>}
          {academyData && (
            <form className="add-course-form" onSubmit={handleSubmit}>
              <div style={{width:'100%', display:'flex',justifyContent:'flex-end', marginBottom:'10px'}}>
              {academyData.crFile && (
              <button type="button" onClick={downloadFile} style={{borderRadius:'20px'}}>
                Download CR File
              </button>
            )}
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Academy Name"
                required
                disabled={!isEditMode}
              />
            <label className='sign-in-label'>Academy Bio</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Ex. You may include a brief introduction containing activities, classes you provide, age category etc.."
                    rows="4"
                    cols="50"
                    style={{marginBottom:'0px'}}
                    maxLength={charLimit}
                    required
                    disabled={!isEditMode}
                />
                <p style={{fontSize:'smaller', marginBottom:'20px',marginLeft:'10px' , color:'darkblue'}}>{charCount}/{charLimit} characters</p>
                <div className='add-upload-label-group'>
                    <label className='sign-in-label' htmlFor="crFile">Email ID</label>
                    <label className='sign-in-label' htmlFor="academyImg">Phone</label>
                </div>
                <div className='side-by-side' style={{display:'flex', flexDirection:'row'}}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-mail ID"
                required
                disabled={!isEditMode}
              />
                  <div className="phone-number-container" style={{ position: 'relative', width: '100%' }}>
            <span className="country-code" style={{ position: 'absolute', left: '10px', top: '21px', transform: 'translateY(-50%)', fontSize: 'small', color: '#555' }}>
              +974
            </span>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone number"
              required
              style={{ paddingLeft: '50px' }}
            />
          </div>
                </div>
                <div className='side-by-side' style={{display:'flex', flexDirection:'row'}}>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                  disabled={!isEditMode}
                />
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Designation"
                  required
                  disabled={!isEditMode}
                />
              </div>
              <div className='add-upload-label-group' style={{gap:'25%'}}>
                <label className='sign-in-label' htmlFor="logo">Academy Logo <span style={{ fontSize: '.8rem', color: 'grey' }}>[ size: 80 X 80 ]</span></label>
                <label className='sign-in-label' htmlFor="crFile">License No.</label>
                </div>
                <div className='side-by-side' style={{display:'flex', flexDirection:'row'}}>
                    <input
                        type="file"
                        name="logo"
                        onChange={handleChange}
                        accept=".png, .jpg, .jpeg"
                        disabled={!isEditMode}
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
                    <label className='sign-in-label' htmlFor="academyImg">Academy Image</label>
                </div>
                {fileError && <p className="error-message">{fileError}</p>}
                <div className='side-by-side' style={{display:'flex', flexDirection:'row'}}>
                    <input
                        type="file"
                        name="crFile"
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="hidden-input"
                        disabled={!isEditMode}
                    />
                    <input 
                        type="file" 
                        name="academyImg" 
                        onChange={handleChange} 
                        accept=".png, .jpg, .jpeg" 
                        disabled={!isEditMode}
                    />
                </div>
                <div className='add-upload-label-group'>
                    <label className='sign-in-label' htmlFor="crFile">Website</label>
                    <label className='sign-in-label' htmlFor="academyImg">Instagram ID</label>
                </div>
                <div className='side-by-side' style={{display:'flex', flexDirection:'row'}}>
                <input type="url" name="website" value={formData.website} disabled={!isEditMode} onChange={handleChange} placeholder="Enter website link" />
                <input type="text" name="instaId" value={formData.instaId} disabled={!isEditMode} onChange={handleChange} placeholder="Enter Instagram ID" />
                </div>
                <div className='form-group'>
                    <label htmlFor="location">Add Location</label>
                    <select name="location" value={formData.location} disabled={!isEditMode} onChange={handleChange} required>
                    <option value="" disabled>Select your city</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                    </select>
                </div>

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
