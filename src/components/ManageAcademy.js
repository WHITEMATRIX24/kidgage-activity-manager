import React, { useEffect, useState } from 'react';
import './ManageAcademy.css';

const ManageAcademy = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    licenseNo: '',
    academyImgFile: null, // Store the file object
    logoFile: null,       // Store the file object
  });
  const cities = [
    "Doha", "Al Wakrah", "Al Khor", "Al Rayyan", 
    "Al Shamal", "Al Shahaniya", "Al Daayen", 
    "Umm Salal", "Dukhan", "Mesaieed"
  ];
  const [charCount, setCharCount] = useState(0);
const charLimit = 500;

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = sessionStorage.getItem('userid');
      if (!userId) {
        setError('No admin ID found in session storage.');
        return;
      }

      try {
        const response = await fetch(`https://kidgage-adminbackend.onrender.com/api/users/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details.');
        }
        const userData = await response.json();
        setUser(userData);

        // Show the form if the verification status is 'accepted'
        if (userData.verificationStatus === 'accepted') {
          setShowForm(true);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    // Handle file inputs separately
    if (files) {
      setFormData((prevState) => ({
        ...prevState,
        [`${name}File`]: files[0], // Save file object in state
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'description') {
      setCharCount(value.length);
    }
    // For file inputs, handle file selection
    if (files) {
      setUser((prevState) => ({
        ...prevState,
        [name]: files[0] // Store the selected file in state (for 'academyImg' and 'logo')
      }));
    } else {
      // For text inputs, handle value changes
      setUser((prevState) => ({
        ...prevState,
        [name]: value // Update the text input value in the state
      }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userid');

    // Create a new FormData object to send both text fields and file uploads
    const formDataToSend = new FormData();
    formDataToSend.append('licenseNo', user.licenseNo);
    formDataToSend.append('fullName', user.fullName);
    formDataToSend.append('designation', user.designation);
    formDataToSend.append('description', user.description);
    formDataToSend.append('website', user.website ? user.website : null);
    formDataToSend.append('instaId', user.instaId ? user.instaId : null);
    formDataToSend.append('email', user.email);
    formDataToSend.append('phoneNo', user.phoneNo);
    formDataToSend.append('location', user.location);



    if (formData.academyImgFile) {
      formDataToSend.append('academyImg', user.academyImgFile); // Append Academy Image file
    }

    if (formData.logoFile) {
      formDataToSend.append('logo', user.logoFile); // Append Logo file
    }

    try {
      const response = await fetch(`https://kidgage-adminbackend.onrender.com/api/users/edit/${userId}`, {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userid');

    // Create a new FormData object to send both text fields and file uploads
    const formDataToSend = new FormData();
    formDataToSend.append('licenseNo', formData.licenseNo);

    if (formData.academyImgFile) {
      formDataToSend.append('academyImg', formData.academyImgFile); // Append Academy Image file
    }

    if (formData.logoFile) {
      formDataToSend.append('logo', formData.logoFile); // Append Logo file
    }

    try {
      const response = await fetch(`https://kidgage-adminbackend.onrender.com/api/users/complete/${userId}`, {
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

  if (!user) {
    return <div>Loading...</div>;
  }
  const downloadFile = () => {
    const base64String = user.crFile; // Assuming this is the Base64 string
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64String}`; // Change mime type if needed
    link.download = 'CRFile.pdf'; // Provide a default name
    link.click();
  };
const handlebuttonclick=()=>{
  setShowEditForm(true);
}
  return (
    <div className='add-course-form-container'>
      <div className='add-course-form'>
      <h1>User Profile</h1>
      <div style={{width:'100%', display:'flex',justifyContent:'space-between', marginBottom:'10px'}}>
      <h3 style={{marginBottom:'0',color:'#387CB8'}}>{user.username}</h3>
      {user.crFile && (
        <button type="button" onClick={downloadFile} style={{borderRadius:'20px',width:'150px'}}>
          Download CR File
        </button>
      )}
      </div>
      <p> {user.description}</p>
      <button onClick={handlebuttonclick}>edit</button>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
      <p><strong>Full Name:</strong> {user.fullName}</p>
      <p><strong>Designation:</strong> {user.designation}</p>
      <p><strong>Location:</strong> {user.location}</p>
      <p><strong>Website:</strong> {user.website || 'N/A'}</p>
      <p><strong>Instagram ID:</strong> {user.instaId || 'N/A'}</p>
      </div>
      {showEditForm && (
        <div className="">
          <div className='add-corse-form-container'>
            <h2>Update Academy Details</h2>
            <form className="add-course-form" onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="username"
                value={user.username}
                placeholder="Academy Name"
                disabled
              />
            <label className='sign-in-label'>Academy Bio</label>
                <textarea
                    name="description"
                    value={user.description}
                    onChange={handleChange}
                    placeholder="Ex. You may include a brief introduction containing activities, classes you provide, age category etc.."
                    rows="4"
                    cols="50"
                    style={{marginBottom:'0px'}}
                    maxLength={charLimit}
                    required
                     
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
                value={user.email}
                onChange={handleChange}
                placeholder="E-mail ID"
                required
                 
              />
                  <div className="phone-number-container" style={{ position: 'relative', width: '100%' }}>
            <span className="country-code" style={{ position: 'absolute', left: '10px', top: '21px', transform: 'translateY(-50%)', fontSize: 'small', color: '#555' }}>
              +974
            </span>
            <input
              type="tel"
              name="phoneNumber"
              value={user.phoneNumber}
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
                  value={user.fullName}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                   
                />
                <input
                  type="text"
                  name="designation"
                  value={user.designation}
                  onChange={handleChange}
                  placeholder="Designation"
                  required
                   
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
                         
                    />
                    <input
                        type="text"
                        name="licenseNo"
                        value={user.licenseNo}
                        onChange={handleChange}
                        placeholder="License number"
                        required
                         
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
                         
                    />
                </div>
                <div className='add-upload-label-group'>
                    <label className='sign-in-label' htmlFor="crFile">Website</label>
                    <label className='sign-in-label' htmlFor="academyImg">Instagram ID</label>
                </div>
                <div className='side-by-side' style={{display:'flex', flexDirection:'row'}}>
                <input type="url" name="website" value={user.website}   onChange={handleChange} placeholder="Enter website link" />
                <input type="text" name="instaId" value={user.instaId}   onChange={handleChange} placeholder="Enter Instagram ID" />
                </div>
                <div className='form-group'>
                    <label htmlFor="location">Add Location</label>
                    <select name="location" value={user.location}   onChange={handleChange} required>
                    <option value="" disabled>Select your city</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                    </select>
                </div>

              <div style={{display:'flex' ,justifyContent: 'flex-start'}} className="button-group">
            
                  <button style={{alignSelf:'flex-end'}} type="submit" className="submit-btn">Save</button>

              </div>
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        </div>
      )}
      {showForm && (
        <div className="editmodal">
          <div className='editmodal-container'>
            <h2>Update Academy Details</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>License No:</label>
                <input
                  type="text"
                  name="licenseNo"
                  value={formData.licenseNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Academy Image:</label>
                <input
                  type="file"
                  name="academyImg"
                  onChange={handleInputChange} // Handle file input change
                  required
                />
              </div>
              <div>
                <label>Logo:</label>
                <input
                  type="file"
                  name="logo"
                  onChange={handleInputChange} // Handle file input change
                  required
                />
              </div>
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAcademy;
