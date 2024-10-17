import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';

const EditImages = ({ courseId }) => {
    const [images, setImages] = useState([]);
    const [fileInputs, setFileInputs] = useState([null]); // Initialize with one file input

    // Function to handle image file change
    const handleImageChange = async (index, event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            const base64 = await convertToBase64(file);
            const newImages = [...images];
            newImages[index] = base64;
            setImages(newImages);
        }
    };

    // Function to convert file to base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    // Function to remove an image
    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    // Function to add a new file input
    const addImage = () => {
        setFileInputs([...fileInputs, null]);
    };

    // Function to handle form submission
    const handleImageSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://kidgage-adminbackend.onrender.com/api/courses/images/${courseId}`, {
                images // Send the new array of images to the backend
            });
            alert('Images updated successfully!');
        } catch (error) {
            console.error('Error updating images:', error);
            alert('Failed to update images');
        }
    };

    useEffect(() => {
        // Optionally fetch the existing images when the component mounts
        const fetchCourseImages = async () => {
            try {
                const response = await axios.get(`https://kidgage-adminbackend.onrender.com/api/courses/course/${courseId}`);
                setImages(response.data.images || []);
            } catch (error) {
                console.error('Error fetching course images:', error);
            }
        };
        fetchCourseImages();
    }, [courseId]);

    return (
        <form >
            <div className="form-group">
                <div className='btn-grpp'>
                    <label>
                        Course Images
                        <span style={{ fontSize: '.8rem', color: 'grey' }}>[ size: 1280 X 1028 ]</span>:
                    </label>
                    <button type="button" className="add-time-slot-btn" onClick={addImage}>
                        Add Images
                    </button>
                </div>
                {fileInputs.map((_, index) => (
                    <div key={index} className="time-slot">
                        <input
                            type="file"
                            onChange={(e) => handleImageChange(index, e)}
                            accept=".png, .jpg, .jpeg"
                        />
                        {index > 0 && (
                            <button
                                type="button"
                                className="rem-button"
                                onClick={() => removeImage(index)}
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={handleImageSubmit} className="submit-button">Update Images</button>
        </form>
    );
};

export default EditImages;
