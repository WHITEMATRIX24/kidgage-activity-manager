import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './requestsPopup.css'; // Create a new CSS file for popup-specific styles

const RequestsPopup = ({ show, closeRequests }) => {
    const popupRef = useRef(null);
    const [pendingUsers, setPendingUsers] = useState([]); // State to store fetched users
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedUser, setSelectedUser] = useState(null); // State to store selected user

    // Fetch pending users from the backend when the popup opens
    useEffect(() => {
        if (show) {
            const fetchPendingUsers = async () => {
                try {
                    const response = await axios.get('https://kidgage-adminbackend.onrender.com/api/users/pending');
                    setPendingUsers(response.data); // Set the users data
                } catch (error) {
                    console.error('Error fetching pending users:', error);
                } finally {
                    setLoading(false); // Stop loading after fetch
                }
            };

            fetchPendingUsers();
        }
    }, [show]);

    // Handle click outside the popup to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closeRequests();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupRef, closeRequests]);

    // Function to handle verification
    const handleVerify = async (userId) => {
        try {
            await axios.post(`https://kidgage-adminbackend.onrender.com/api/users/verify/${userId}`);
            setPendingUsers(pendingUsers.filter(user => user._id !== userId)); // Remove user from list after verifying
            setSelectedUser(null); // Reset selected user
        } catch (error) {
            console.error('Error verifying user:', error);
        }
    };

    // Function to handle rejection
    const handleReject = async (userId) => {
        try {
            await axios.post(`https://kidgage-adminbackend.onrender.com/api/users/reject/${userId}`);
            setPendingUsers(pendingUsers.filter(user => user._id !== userId)); // Remove user from list after rejecting
            setSelectedUser(null); // Reset selected user
        } catch (error) {
            console.error('Error rejecting user:', error);
        }
    };

    if (!show) return null; // If not visible, don't render

    return (
        <>
            <div className="popup-overlay"></div>
            <div className="popup-window" ref={popupRef}>
                {/* Close Button */}
                <button className="close-button" onClick={closeRequests}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h3>Pending Requests</h3>

                {loading ? (
                    <p>Loading...</p>
                ) : selectedUser ? (
                    // Display selected user's details
                    <div>
                        <h4>{selectedUser.username}</h4>
                        <p>Email: {selectedUser.email}</p>
                        <p>Status: {selectedUser.verificationStatus}</p>
                        <p>Location: {selectedUser.location}</p>
                        <p>Description: {selectedUser.description}</p>
                        <p>Full Name: {selectedUser.fullName}</p>
                        <p>Designation: {selectedUser.designation}</p>

                        {/* Buttons for verify and reject */}
                        <button onClick={() => handleVerify(selectedUser._id)}>Verify</button>
                        <button onClick={() => handleReject(selectedUser._id)}>Reject</button>
                        {/* Back button to return to list */}
                        <button onClick={() => setSelectedUser(null)}>Back to list</button>
                    </div>
                ) : (
                    <ul>
                        {pendingUsers.length > 0 ? (
                            pendingUsers.map((user) => (
                                <li key={user._id} onClick={() => setSelectedUser(user)}>
                                    <strong>{user.username}</strong>  
                                    {user.email}
                                </li>
                            ))
                        ) : (
                            <li>No pending requests.</li>
                        )}
                    </ul>
                )}
            </div>
        </>
    );
};

export default RequestsPopup;
