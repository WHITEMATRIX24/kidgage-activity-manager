import React, { useEffect, useState } from "react";
import './AddCourseForm.css';
import { FaChevronDown } from "react-icons/fa";
import axios from 'axios';

const AddAcademyForm = ({ handleNavigation }) => {
    const [showForm, setShowForm] = useState(false);
    const [academyTypes, setAcademyTypes] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchAcademyTypes = async () => {
          try {
            const response = await axios.get('https://kidgage-admin-rdld.onrender.com/api/course-category/categories');
            setAcademyTypes(response.data);
          } catch (error) {
            console.error('Error fetching academy types', error);
          }
        };
    
        fetchAcademyTypes();
      }, []);

    const initialFormState = {
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        logo: [],
        crFile: [],
        idCard: [],
        licenseNo: '',
        academyImg: [],
        description: '',
        academyType: '',
        location: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (files) {
            setFormData(prevState => ({
               ...prevState,
                [name]: Array.from(files)
            }));
        } else {
            setFormData(prevState => ({
               ...prevState,
                [name]: value
            }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('button clicked!')
    
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setSuccess('');
            return;
        }
    
        setError('');
    
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (Array.isArray(formData[key])) {
                formData[key].forEach(file => {
                    data.append(key, file);
                });
            } else {
                data.append(key, formData[key]);
            }
        });
    
        try {
            const response = await axios.post('https://kidgage-admin-rdld.onrender.com/api/users/signup', data);
            setSuccess('Academy added Successfully!');
            setFormData({ ...initialFormState }); // Reset form fields
        } catch (error) {
            setError(error.response ? error.response.data.message : 'An error occurred. Please try again later.');
            setSuccess('');
        }
    };
    

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

   
return (
    <div className="">
        {/* <div className="add-course-form-header" onClick={toggleFormVisibility}>
            <h2>Add Academy</h2>
            <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} />
        </div> */}
            <form className="add-course-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Academy Name"
                    required
                />
  
                <select
                    id="academyType"
                    name="academyType"
                    value={formData.academyType}
                    onChange={handleChange}
                    required
                >
                <option value="">Select Academy Type</option>
                    {academyTypes.map((type) => (
                <option key={type._id} value={type.name}>
                    {type.name}
                </option>
                ))}
                </select>
    
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E-mail ID"
                    required
                />
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                />
                <div className='side-by-side'>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        required
                    />
                </div>
                <div className='side-by-side'>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Default Password"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        required
                    />
                </div>
                <label className='sign-in-label' htmlFor="logo">Academy Logo <span style={{ fontSize: '.8rem', color: 'grey' }}>[ size: 80 X 80 ]</span></label>
                <div className='side-by-side'>
                    <input
                        type="file"
                        name="logo"
                        onChange={handleChange}
                        accept=".png, .jpg, .jpeg"
                    />
                    <input
                        type="text"
                        name="licenseNo"
                        value={formData.licenseNo}
                        onChange={handleChange}
                        placeholder="License number"
                        required
                    />
                </div>
                <div className='add-upload-label-group'>
                    <label className='sign-in-label' htmlFor="crFile">CR</label>
                    <label className='sign-in-label' htmlFor="idCard">ID Card</label>
                </div>
                <div className='side-by-side'>
                    <input
                        type="file"
                        name="crFile"
                        onChange={handleChange}
                        accept=".pdf"
                        className="hidden-input"

                    />
                    <input
                        type="file"
                        name="idCard"
                        onChange={handleChange}
                        accept=".pdf"
                    />
                </div>
  
                <label 
                    className='sign-in-label' 
                    htmlFor="academyImg">Academy Image
                </label>
                <input 
                    type="file" 
                    name="academyImg" 
                    onChange={handleChange} 
                    accept=".png, .jpg, .jpeg" />
  
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Enter description here..." rows="4" cols="50" />
  
                <div className='form-group'>
                    <label htmlFor="location">Add Location</label>
                    <input
                        type="url"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter map URL"
                    />
                </div>
                <button type="submit">Create Academy</button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
    </div>
  );
}

export default AddAcademyForm;
