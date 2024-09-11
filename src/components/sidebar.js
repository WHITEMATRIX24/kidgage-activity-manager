import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSchool, faTags, faUsers, faUserGraduate, faBullhorn, faImages, faAd, faCog } from '@fortawesome/free-solid-svg-icons';
import profileImage from './assets/images/profile.png';
import './dashboard.css';

const Sidebar = ({ sidebarOpen, toggleSidebar, onSignOut, onChangePassword }) => {
    const [activeItem, setActiveItem] = useState('courses');
    const sectionRefs = useRef({});

    useEffect(() => {
        const sections = ['courses', 'academies', 'parents', 'students', 'add-banners', 'event-posters', 'advertisements', 'course-categories', 'settings'];

        sections.forEach(section => {
            sectionRefs.current[section] = document.getElementById(section);
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveItem(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => {
            const ref = sectionRefs.current[section];
            if (ref) observer.observe(ref);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const icons = {
        courses: faBook,
        academies: faSchool,
        'course-categories': faTags,
        parents: faUsers,
        students: faUserGraduate,
        'add-banners': faBullhorn,
        'event-posters': faImages,
        settings: faCog,
        advertisements: faAd, // or faBullseye or faMegaphone

    };

    const handleItemClick = (item) => {
        setActiveItem(item);
        const section = document.getElementById(item);
        
        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth',
            });
        }
    
        if (window.innerWidth <= 768) {
            toggleSidebar(); // Close sidebar on smaller screens
        }
    };
    

    return (
        <div className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
            <div className="profile-section">
                <img src={profileImage} alt="Profile" />
                <div className="profile-info">
                    <h3>ADMIN_777</h3>
                    <p>Admin</p>
                </div>
            </div>
            {/* <h1 className="sidebar-heading">Dashboard</h1> */}
            <nav>
                <ul>
                    {['courses', 'academies', 'parents', 'students', 'add-banners', 'event-posters', 'advertisements', 'course-categories', 'settings'].map(section => (
                        <li key={section} className={activeItem === section ? 'active' : ''} onClick={() => handleItemClick(section)}>
                            <a href={`#${section}`}>
                                <FontAwesomeIcon icon={icons[section]} className="icon" />
                                {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
                            </a>
                        </li>
                    ))}

                </ul>
            </nav>
            {/* <div className="sidebar-footer">
                <a href="#privacy">Privacy Policy | </a>
                <a href="#terms">Terms of Service | </a>
                <a href="#support">Support</a>
            </div> */}
        </div>
    );
};

export default Sidebar;
