import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import Home from './components/Home';
import AcademyList from './components/AcademyList';
import SlotSelection from './components/SlotSelection';
import BookingForm from './components/BookingForm';
import CheckoutPage from './components/CheckoutPage';
import CheckOutGuest from './components/CheckOutGuest';
import Login from './components/Login';
import PersonalSignUp from './components/PersonalSignUp';
import BusinessSignUp from './components/BusinessSignUp';
import PersonalSignIn from './components/PersonalSignIn';
import BusinessSignIn from './components/BusinessSignIn';
import ParentsPage from './components/ParentsPage';
import BusinessPage from './components/BusinessesPage';
import ScrollToTop from './components/ScrollToTOp';
import AttendeeCard from './components/AttendeeCard';
import ChatbotPage from './components/ChatbotPage';
import AdminSignIn from './components/AdminSignIn';
import Dashboard from './components/dashboard';
import EventDetails from './components/EventDetails';
import AttendeeInfo from './components/AttendeeInfoPage';
import WishlistPage from './components/WishListPage'; 
import Shops from "./components/Shops";
import Details from "./components/Details"; // Import the new Details component

// Add any other paths from your secondary navbar here
const secondaryNavPaths = ['/shops', '/parents', '/providers', '/about'];

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP' && secondaryNavPaths.includes(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [navigate, location, navigationType]);

  return (
    <ScrollToTop>
      <Routes>
        <Route path="/" element={<AdminSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />  
      </Routes>
    </ScrollToTop>
  );
}

export default App;