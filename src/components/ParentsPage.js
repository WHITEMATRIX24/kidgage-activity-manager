import React from 'react';
import SecondaryNavbar from './SecondaryNavbar';
import './ParentsPage.css';

const ParentsPage = () => {
  return (
    <div className="parents-page">
      <SecondaryNavbar activeTab="parents"/>
      <div className="parents-page__content">
        <div className="parents-page__left-column">
          <div className="parents-page__gradient-blue">
            <h2 className="parents-page-feature-title">Flexible childcare</h2>
            <p className="parents-page-feature-description">Instantly book childcare sessions with ease</p>
          </div>
          <div className="parents-page__gradient-pearlwhite">
            <h2>Activities & Classes</h2>
            <p>Exciting entertainment from trusted providers</p>
          </div>
        </div>
        <div className="parents-page__right-column">
          <div className="parents-page__right-box">
              <h2 className="parents-page-heading">Categories</h2>
                <ul className="parents-page-category-list">
                  <li className="parents-page-category-item">Parent & Baby</li>
                  <li className="parents-page-category-item">Health & Wellbeing</li>
                  <li className="parents-page-category-item">Art & Crafts</li>
                  <li className="parents-page-category-item">Dance</li>
                  <li className="parents-page-category-item">Drama</li>
                  <li className="parents-page-category-item">View all...</li>
                </ul>
          </div>
          <div className="parents-page__right-box">
              <h2 className="parents-page-heading">Neighbourhoods</h2>
                <ul className="parents-page-neighborhood-list">
                  <li className="parents-page-neighborhood-item">Battersea</li>
                  <li className="parents-page-neighborhood-item">Bexley</li>
                  <li className="parents-page-neighborhood-item">Blackheath</li>
                  <li className="parents-page-neighborhood-item">Crouch End</li>
                  <li className="parents-page-neighborhood-item">Epsom</li>
                  <li className="parents-page-neighborhood-item">View all...</li>
                </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentsPage;