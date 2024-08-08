import React from 'react';
import './BlogSection.css';
import image1 from './assets/images/blog.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const BlogSection = () => {
  const navigate = useNavigate();

  const handleArrowClick = () => {
    navigate('/shops');
  };

  return (
    <div className="blog-section-container">
      <div className="blog-section">
        <div className="blog-image-container">
          <img src={image1} alt="Summer Holiday" className="blog-image" />
        </div>
        <div className="blog-text-container">
          <h2>Wait a Second! Check This First</h2>
          <p>As you can see, our list of subscription boxes for kids has quite a mix of genres and age ranges. It goes without saying, but a 1-year-old and a 17-year-old are almost always interested in completely different things. So, if you're looking for a more specific age range for subscription boxes, check out our award-winning subscription boxes for 2024:</p>
          <div className='explore-btn'>
            <a href="#" className="blog-explore-link">Explore</a>
            <button className="blog-arrow-button" onClick={handleArrowClick}>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <p>#subscriptionbox</p>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
