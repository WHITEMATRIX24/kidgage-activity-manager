import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTOp';
import Dashboard from './components/dashboard';
import AdminSignIn from './components/AdminSignIn';


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
        {/* <Route path="/" element={<AdminSignIn />} /> */}
        <Route path="/" element={<Dashboard />} />  
        {/* <Route path="/dashboard" element={<Dashboard />} />   */}

      </Routes>
    </ScrollToTop>
  );
}

export default App;