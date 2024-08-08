import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import logo from './assets/images/logo.png';
import bell from './assets/images/bell.png';
import profile from './assets/images/profile.png';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(null);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleSubmenu = (index) => {
        setIsSubmenuOpen(isSubmenuOpen === index ? null : index);
    };

    const handleNavigation = (path, activeTab) => {
        console.log(`Navigating to: ${path}`); // Debug log
        navigate(path, { state: { activeTab } });
        setIsMenuOpen(false); // Close the menu after navigation
        setIsDropdownOpen(false); // Close the dropdown after navigation
    };

    return (
        <header className="home-header">
            <div className="notification-bar">
                <img className='bell-icon' src={bell} alt="Notification" />
                Are you an activity provider? <a href="/learn-more">Learn how to be listed</a>
            </div>
            <div className='header-content'>
                <div className="home-logo">
                    <img src={logo} alt="KIDGAGE" onClick={() => handleNavigation('/', '')} style={{ cursor: 'pointer' }} />
                </div>
                <button className="menu-toggle" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className={`header-right ${isMenuOpen ? 'active' : ''}`}>
                    <nav className="home-nav-links">
                        <button onClick={() => handleNavigation("/shops", 'shops')}>SHOPS</button>
                        <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                            <button>PARENTS</button>
                            <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                <div className="dropdown-item" onMouseEnter={() => toggleSubmenu(1)} onMouseLeave={() => toggleSubmenu(null)}>
                                    <span>Flexible childcare</span><span><FontAwesomeIcon icon={faAngleLeft} /></span>
                                    {isSubmenuOpen === 1 && <div className={`submenu left ${isSubmenuOpen === 1 ? 'show' : ''}`}>
                                        <button onClick={() => handleNavigation("/flexible-childcare", 'flexible-childcare')}>Instantly book childcare sessions with ease</button>
                                    </div>}
                                </div>
                                <div className="dropdown-item" onMouseEnter={() => toggleSubmenu(2)} onMouseLeave={() => toggleSubmenu(null)}>
                                    <span>Activities & classes </span><span><FontAwesomeIcon icon={faAngleLeft} /></span>
                                    {isSubmenuOpen === 2 && <div className={`submenu left ${isSubmenuOpen === 2 ? 'show' : ''}`}>
                                        <button onClick={() => handleNavigation("/activities-classes", 'activities-classes')}>Exciting entertainment from trusted providers</button>
                                    </div>}
                                </div>
                                <div className="dropdown-item" onMouseEnter={() => toggleSubmenu(3)} onMouseLeave={() => toggleSubmenu(null)}>
                                    <span>Categories</span><span><FontAwesomeIcon icon={faAngleRight} /></span>
                                    {isSubmenuOpen === 3 && <div className={`submenu right submenu-list ${isSubmenuOpen === 3 ? 'show' : ''}`}>
                                        <ul>
                                            <li>Parent & Baby</li>
                                            <li>Health & Wellbeing</li>
                                            <li>Art & Crafts</li>
                                            <li>Dance</li>
                                            <li>Drama</li>
                                        </ul>
                                    </div>}
                                </div>
                                <div className="dropdown-item" onMouseEnter={() => toggleSubmenu(4)} onMouseLeave={() => toggleSubmenu(null)}>
                                    <span>Neighbourhoods</span><span><FontAwesomeIcon icon={faAngleRight} /></span>
                                    {isSubmenuOpen === 4 && <div className={`submenu right submenu-list ${isSubmenuOpen === 4 ? 'show' : ''}`}>
                                        <ul>
                                            <li>Battersea</li>
                                            <li>Baxley</li>
                                            <li>Blackhealth</li>
                                            <li>Crouch End</li>
                                            <li>Epsom</li>
                                        </ul>
                                    </div>}
                                </div>
                                <div className="dropdown-item"> <span onClick={() => toggleSubmenu(5)}>Parent Account</span>
                                    {isSubmenuOpen === 5 && (<div className={`submenu ${isSubmenuOpen === 5 ? 'show' : ''}`}>
                                       <button onClick={() => handleNavigation("/parent-account", 'parent-account')}></button>
                                    </div>)}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleNavigation("/providers", 'providers')}>PROVIDERS</button>
                        <button onClick={() => handleNavigation("/about", 'about')}>ABOUT</button>
                    </nav>
                    <button onClick={() => handleNavigation("/profile", 'profile')}>
                        <div className="profile-icon">
                            <img className='profile-icon' src={profile} alt="Profile" />
                        </div>
                    </button>
                    <button onClick={() => handleNavigation("/dashboard", 'dashboard')}>
                        <div className="profile-icon">
                            <p>DASHBOARD</p>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
