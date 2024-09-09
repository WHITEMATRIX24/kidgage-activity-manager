import React, { useState } from 'react';
import axios from 'axios';

const ChangePasswordForm = ({ adminId }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://kidgage-adminbackend.onrender.com/api/admin/change-password/${adminId}`,
        {
          currentPassword,
          newPassword,
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Error changing password'
      );
      setSuccessMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit">Change Password</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </form>
  );
};

export default ChangePasswordForm;
