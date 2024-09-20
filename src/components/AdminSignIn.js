import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminSignin.css';
import logo from './assets/images/logo.png';

const AdminSignIn = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('https://kidgage-adminbackend.onrender.com/api/admin/signin', formData);
      console.log('Sign-in successful:', response.data);

      // Store token or flag in localStorage to indicate successful login
      localStorage.setItem('adminToken', response.data.token); // Replace 'token' with the actual token key from response

      setSuccess('Sign-in successful');
      setFormData({
        name: '',
        password: ''
      });

      // Navigate to dashboard upon successful sign-in
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign-in error:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
    }
  };

  return (
    <div className='asign-form-body'>
      <div className='asignup-form'>
        <div className='alogo-container'>
          <img src={logo} alt="KIDGAGE" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        </div>
        <form className='aform-sign-in' onSubmit={handleSubmit}>
          <h2>Admin's Sign-In</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button type="submit">Sign In</button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminSignIn;
