import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import './ImageDrawer.css';

const ImageDrawer = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://kidgage-adminbackend.onrender.com/api/course-category/categories');
        console.log('Fetched categories:', response.data); // Log the fetched data
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleItemClick = (categoryName) => {
    navigate('/academy-list', { state: { category: categoryName } });
  };

  return (
    <div className="drawer-slide-down">
      <h2 className="slider-title">Top Activities</h2>
      <p className="slider-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas massa lacus.</p>
      <div className="drawer-content">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <div key={index} className="drawer-item" onClick={() => handleItemClick(category.name)}>
              <img src={`data:image/jpeg;base64,${category.image}`} alt={category.name} className="drawer-image" />
              <div className="drawer-text">
                <div className='slide-overlay-text'>
                  <h2 className="product-name">{category.name}</h2>
                  <p className="product-price">Starting from <br />QAR 99/-</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
  );
};

export default ImageDrawer;
