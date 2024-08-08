import React from 'react';
import SecondaryNavbar from './SecondaryNavbar';
import './BusinessesPage.css';

const BusinessesPage = () => {
  return (
    <div className="businesses-page">
      <SecondaryNavbar activeTab="providers" />
      <div className="businesses-page__wrapper">
        <div className="businesses-page__content">
          <div className="businesses-page__main-section">
            <div className="businesses-page__card">
              <div className="businesses-page__pink-box">
                <h1 className="businesses-page-title">Supercharge your business with Kidgage</h1>
                <p className="businesses-page-description">Increase bookings, reduce admin, and reach thousands of parents a day</p>
              </div>
              <div className="businesses-page__pink-box">
                  <h2 className="businesses-page-heading">Solutions for...</h2>
                  <ul className="businesses-page-solution-list">
                    <li className="businesses-page-solution-item">Activity Providers</li>
                    <li className="businesses-page-solution-item">Nurseries</li>
                    <li className="businesses-page-solution-item">Nannies</li>
                    <li className="businesses-page-solution-item">Childminders</li>
                  </ul>
              </div>
            </div>
          </div>
          <div className="businesses-page__sidebar">
            <div className="businesses-page__sidebar-item">
                <h2 className="businesses-page-join-title">Join Kidgage</h2>
                <p className="businesses-page-join-description">Join our community of activity providers</p>
               
            </div>
            <div className="businesses-page__sidebar-item">
              <ul className="businesses-page-join-list">
                <li className="businesses-page-join-item">
                  <a href="/activity-provider-resources">Activity Provider Resources</a>
                </li>
                <li className="businesses-page-join-item">
                  <a href="/case-studies">Case Studies</a>
                </li>
                <li className="businesses-page-join-item">
                  <a href="/business-support">Business Support</a>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessesPage;