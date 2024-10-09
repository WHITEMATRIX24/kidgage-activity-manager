// UserDetails.js
import React, { useEffect, useState } from 'react';

const ManageAcademy = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const adminId = sessionStorage.getItem('adminId');
      if (!adminId) {
        setError('No admin ID found in session storage.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/users/user/${adminId}`); // Adjust the API endpoint as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch user details.');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetails();
  }, []);

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
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
      <p><strong>Full Name:</strong> {user.fullName}</p>
      <p><strong>Designation:</strong> {user.designation}</p>
      <p><strong>Description:</strong> {user.description}</p>
      <p><strong>Location:</strong> {user.location}</p>
      <p><strong>Website:</strong> {user.website || 'N/A'}</p>
      <p><strong>Instagram ID:</strong> {user.instaId || 'N/A'}</p>
      <p><strong>CR File:</strong> {user.crFile || 'N/A'}</p>
      <p><strong>License No:</strong> {user.licenseNo || 'N/A'}</p>
    </div>
  );
};

export default ManageAcademy;
