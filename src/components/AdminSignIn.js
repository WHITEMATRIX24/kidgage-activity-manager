import React, { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import './Header.css';
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
      setSuccess('Sign-in successful');
      setFormData({
        name: '',
        password: ''
      });
      // Navigate to another page or perform additional actions
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign-in error:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
    }
  };

  return (
    <div className='sign-form-body'>
      <div className='signup-form'>
        <div className='logo-container'>
          <img src={logo} alt="KIDGAGE" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        </div>
        <form className='form-sign-in' onSubmit={handleSubmit}>
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
          <Button primary type="submit">Sign In</Button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminSignIn;
