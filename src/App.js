import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTOp';
import Dashboard from './components/dashboard';
import AdminSignIn from './components/AdminSignIn';

// Function to check if user is authenticated (e.g., using a token in localStorage)
const isAuthenticated = () => {
  return localStorage.getItem('adminToken'); // Example: Replace 'adminToken' with your actual token key
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  return (
    <ScrollToTop>
      <Routes>
        <Route path="/" element={<AdminSignIn />} />
        {/* Protected route for dashboard */}
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </ScrollToTop>
  );
}

export default App;
