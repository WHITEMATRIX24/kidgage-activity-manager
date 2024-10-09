import React, { useEffect, useState } from 'react';
import './ManageAcademy.css';
const ManageAcademy = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    licenseNo: '',
    academyImg: '',
    logo: ''
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

        // If verificationStatus is accepted, show the form to update license, academy image, and logo
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
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userid');

    // Create a new FormData object to send both text fields and file uploads
    const formData = new FormData();
    formData.append('licenseNo', formData.licenseNo);
    
    if (formData.academyImgFile) {
        formData.append('academyImg', formData.academyImgFile);  // Append the Academy Image file
    }
    
    if (formData.logoFile) {
        formData.append('logo', formData.logoFile);  // Append the Logo file
    }

    try {
        const response = await fetch(`https://kidgage-adminbackend.onrender.com/api/users/complete/${userId}`, {
            method: 'POST',
            body: formData,  // Use FormData instead of JSON.stringify for file uploads
        });

        if (!response.ok) {
            throw new Error('Failed to update user details.');
        }

        alert('Profile updated successfully!');
        setShowForm(false);  // Hide the form after successful update
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

  return (
    <div>
      <h1>User Details</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Description:</strong> {user.description}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
      <p><strong>Full Name:</strong> {user.fullName}</p>
      <p><strong>Designation:</strong> {user.designation}</p>
      <p><strong>Location:</strong> {user.location}</p>
      <p><strong>Website:</strong> {user.website || 'N/A'}</p>
      <p><strong>Instagram ID:</strong> {user.instaId || 'N/A'}</p>
      <p><strong>CR File:</strong> {user.crFile || 'N/A'}</p>

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
              <label>Academy Image URL:</label>
              <input
                type="file"
                name="academyImg"
                value={formData.academyImg}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Logo URL:</label>
              <input
                type="file"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
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
