import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import './Header.css';
import logo from './assets/images/logo.png';
import bell from './assets/images/bell.png';
import profile from './assets/images/profile.png';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavigation = (path, activeTab) => {
        console.log(`Navigating to: ${path}`); // Debug log
        navigate(path, { state: { activeTab } });
        setIsMenuOpen(false); // Close the menu after navigation
    };

    return (
        <header className="home-header">

            <div className='header-content'>
                <div className="home-logo">
                    <img src={logo} alt="KIDGAGE" onClick={() => handleNavigation('/', '')} style={{cursor: 'pointer'}} />
                </div>
                <div className={`header-right ${isMenuOpen ? 'active' : ''}`}>
                
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