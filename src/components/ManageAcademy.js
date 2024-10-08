import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import './AddCourseForm.css'; 
import { FaChevronDown, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const EditAcademyForm = () => {
  const [showForm, setShowForm] = useState(true);
  const [query, setQuery] = useState('');
  const [academyData, setAcademyData] = useState(null);
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
  const [email, setEmail] = useState('');
  const cities = [
    "Doha", "Al Wakrah", "Al Khor", "Al Rayyan", 
    "Al Shamal", "Al Shahaniya", "Al Daayen", 
    "Umm Salal", "Dukhan", "Mesaieed"
  ];
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    setEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (email) {
      console.log(email);
      handleSearch(email); // Pass the email to handleSearch
    }
  }, [email]);
  const [adminId, setAdminId] = useState('');

  useEffect(() => {
    // Retrieve the adminId from sessionStorage
    const storedAdminId = sessionStorage.getItem('adminId');
    if (storedAdminId) {
      setAdminId(storedAdminId);
      handleSearch(storedAdminId); // Trigger search with the retrieved adminId
    }
  }, []);

  const handleSearch = async (searchQuery) => { // Accept searchQuery parameter
    try {
      const response = await axios.get(`https://kidgage-adminbackend.onrender.com/api/users/provider/${searchQuery}`); // Use ID to fetch data
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

      const response = await axios.put(`https://kidgage-adminbackend.onrender.com/api/users/academy/${academyData._id}`, formData, {
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
      await axios.delete(`https://kidgage-adminbackend.onrender.com/api/users/academy/${academyData._id}`);
      setAcademyData(null);
      setFormData({
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        designation: '',
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
  const downloadFile = () => {
    const base64String = academyData.crFile; // Assuming this is the Base64 string
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64String}`; // Change mime type if needed
    link.download = 'CRFile.pdf'; // Provide a default name
    link.click();
  };
  const [charCount, setCharCount] = useState(0);
  const charLimit = 500;
  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header">
        <h2>Manage academy Info</h2>
      </div>
      {showForm && (
        <div className='add-course-form'>
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
                    <label className='sign-in-label' htmlFor="academyImg">Academy Image</label>
                </div>
                <div className='side-by-side' style={{display:'flex', flexDirection:'row'}}>
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
