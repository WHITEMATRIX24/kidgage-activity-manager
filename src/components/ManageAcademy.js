// ManageAcademy.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageAcademy = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const adminId = sessionStorage.getItem('adminId'); // Ensure this returns a valid ID
      if (!adminId) {
        setError('No admin ID found in session storage.');
        return;
      }

      try {
        const response = await axios.get(`/api/users/user/${adminId}`); // Use the correct API endpoint
        setUser(response.data);
      } catch (err) {
        console.error('There was an error fetching the users!', err);
        setError('Error fetching user details.'); // Update error state
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
      {/* Render user details */}
    </div>
  );
};

export default ManageAcademy;
