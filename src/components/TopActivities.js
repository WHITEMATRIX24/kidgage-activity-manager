import React, { useState } from 'react';
import CTypeSlider from './CTypeSlider';
import ImageDrawer from './ImageDrawer';
import './TopActivities.css';

import gymnasticsImage from './assets/images/gymnastics.jpg';
import swimmingImage from './assets/images/swimming.jpg';
import martialArtsImage from './assets/images/martial-arts.jpg';
import paintingImage from './assets/images/painting.jpg';
import footballImage from './assets/images/football.jpg';
import sensoryImage from './assets/images/sensory.jpg';
import bakingImage from './assets/images/baking.jpg';
import skatingImage from './assets/images/skating.jpg';
import gymImage from './assets/images/gym.jpg';

const TopActivities = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const products = [
    { name: 'Gymnastics', price: 99, image: gymnasticsImage },
    { name: 'Swimming', price: 99, image: swimmingImage },
    { name: 'Martial Arts', price: 99, image: martialArtsImage },
    { name: 'Painting', price: 99, image: paintingImage },
    { name: 'Football', price: 99, image: footballImage },
    { name: 'Sensory', price: 99, image: sensoryImage },
    { name: 'Baking', price: 99, image: bakingImage },
    { name: 'Skating', price: 99, image: skatingImage },
    { name: 'Gym', price: 99, image: gymImage },
  ];

  const handleViewAll = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="top-activities">
      {!drawerOpen && <CTypeSlider products={products} />}
      {drawerOpen && <ImageDrawer products={products} />}
      <button className='top-act-view' onClick={handleViewAll}>
        {drawerOpen ? 'Hide' : 'View All'}
      </button>
    </div>
  );
};

export default TopActivities;
