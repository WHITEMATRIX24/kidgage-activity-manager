import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './CTypeSlider.css';
import axios from 'axios';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-arrow-next`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-arrow-prev`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  );
};

const CtypeSlider = () => {
  const [categories, setCategories] = useState([]);
  const [categoryFees, setCategoryFees] = useState({});
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/course-category/categories');
        const fetchedCategories = response.data;
        setCategories(fetchedCategories);

        // Fetch courses and calculate lowest fee for each category
        const fees = {};
        await Promise.all(fetchedCategories.map(async (category) => {
          try {
            const providerResponse = await axios.get(`http://localhost:5000/api/users/all/${category.name}`);
            const providerIds = providerResponse.data.map(provider => provider._id);
            const courseResponse = await axios.get('http://localhost:5000/api/courses/by-providers', {
              params: { providerIds }
            });
            const coursesData = courseResponse.data;
            if (coursesData.length > 0) {
              const categoryFees = coursesData.map(course => course.feeAmount);
              const minFee = Math.min(...categoryFees);
              fees[category.name] = minFee;
            } else {
              fees[category.name] = 'NA';
            }
          } catch (error) {
            console.error(`Error fetching courses for category ${category.name}:`, error);
            fees[category.name] = 'NA';
          }
        }));

        setCategoryFees(fees);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: true,
    cssEase: 'ease-in-out',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const handleSlideClick = (categoryName) => {
    navigate('/academy-list', { state: { category: categoryName } });
  };
  
  return (
    <div className="slider-container">
      <h2 className="slider-title">Top Activities</h2>
      <p className="slider-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas massa lacus.</p>
      <Slider {...settings}>
        {categories.map((category, index) => (
          <div key={index} className="slide" onClick={() => handleSlideClick(category.name)}>
            <img src={`data:image/jpeg;base64,${category.image}`} alt={category.name} className="slide-image"/>
            <div className="slide-overlays">
              <div className='slide-overlay-text'>
                <h2 className="product-name">{category.name}</h2>
                <p className="product-price">Starting from<br /><span className="start-price">QAR {categoryFees[category.name] !== undefined ? categoryFees[category.name] : 'NA'}/-</span></p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CtypeSlider;
