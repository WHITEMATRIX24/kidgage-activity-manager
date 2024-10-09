import React, { useEffect, useState } from 'react';
import './ManageAcademy.css';

const ManageAcademy = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    licenseNo: '',
    academyImgFile: null, // Store the file object
    logoFile: null,       // Store the file object
  });

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

  if (error) {
    return <div>Error: {error}</div>;
  }

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
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
      <p><strong>Full Name:</strong> {user.fullName}</p>
      <p><strong>Designation:</strong> {user.designation}</p>
      <p><strong>Location:</strong> {user.location}</p>
      <p><strong>Website:</strong> {user.website || 'N/A'}</p>
      <p><strong>Instagram ID:</strong> {user.instaId || 'N/A'}</p>
      </div>

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
