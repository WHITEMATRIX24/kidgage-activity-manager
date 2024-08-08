import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import Button from './Button'; // Assuming you have Button component
import './SignUpForm.css';

const PersonalSignUp = ({ handleNavigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [error, setError] = useState(''); // State to hold error messages
  const [success, setSuccess] = useState(''); // State to hold success message

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setSuccess('');
      return; // Stop the form submission
    }

    setError(''); // Clear any previous error

    try {
      const response = await axios.post('https://kidgage-adminbackend.onrender.com/api/personal/signup', formData);
      console.log('Form submitted:', response.data);
      setSuccess('Signed Up Successfully!');
      setFormData({
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: '',
        agreeTerms: false
      }); // Clear the form
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'An error occurred. Please try again later.'); // Display specific error message
      setSuccess(''); // Clear any previous success message
    }
  };

  return (
    <div className='su-form-body'>
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Personal Sign-up</h2>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail ID" required />
        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone number" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" required />
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" required />
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" required />
        
        <div className="terms-container">
          <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} required />
          <label htmlFor="agreeTerms">I agree to the <a href="#">terms and conditions</a></label> {/* Replace '#' with actual terms link */}
        </div>
        
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        {success && <p className="success-message">{success}</p>} {/* Display success message */}
        
        <Button primary>Create Account</Button>
      </form>
    </div>
  );
};

export default PersonalSignUp;
