import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './SecondaryNavbar.css';

const SecondaryNavbar = ({ activeTab: propActiveTab }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(propActiveTab || '');

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path, tab) => {
    navigate(path, { state: { activeTab: tab } });
  };

  return (
    <nav className="secondary-navbar">
      <div className="secondary-navbar-container">
        
        <button className="secondary-navbar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <ul className={`secondary-navbar-list ${isMenuOpen ? 'active' : ''}`}>
          <li className={`secondary-navbar-item ${activeTab === 'home' ? 'active' : ''}`}>
            <div onClick={() => handleNavigation('/', '')} className="home-icon-link">
            <FontAwesomeIcon icon={faHome} className="home-icon" />
            </div>
          </li>
          <li className={`secondary-navbar-item ${activeTab === 'shops' ? 'active' : ''}`}>
            <div onClick={() => handleNavigation('/shops', 'shops')} className="secondary-navbar-link">Shops</div>
          </li>
          <li className={`secondary-navbar-item ${activeTab === 'parents' ? 'active' : ''}`}>
            <div onClick={() => handleNavigation('/parents', 'parents')} className="secondary-navbar-link">Parents</div>
          </li>
          <li className={`secondary-navbar-item ${activeTab === 'providers' ? 'active' : ''}`}>
            <div onClick={() => handleNavigation('/providers', 'providers')} className="secondary-navbar-link">Businesses</div>
          </li>
          <li className={`secondary-navbar-item ${activeTab === 'about' ? 'active' : ''}`}>
            <div onClick={() => handleNavigation('/about', 'about')} className="secondary-navbar-link">About</div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SecondaryNavbar;