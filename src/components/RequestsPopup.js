import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './requestsPopup.css'; // Create a new CSS file for popup-specific styles

const RequestsPopup = ({ show, closeRequests }) => {
    const popupRef = useRef(null);
    const [pendingUsers, setPendingUsers] = useState([]); // State to store pending users
    const [acceptedUsers, setAcceptedUsers] = useState([]); // State to store accepted users
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedUser, setSelectedUser] = useState(null); // State to store selected user
    const [activeTab, setActiveTab] = useState('pending'); // State for tab management ('pending' or 'accepted')

    // Fetch users from the backend when the popup opens or tab changes
    useEffect(() => {
        if (show) {
            const fetchUsers = async () => {
                try {
                    setLoading(true);
                    if (activeTab === 'pending') {
                        const response = await axios.get('https://kidgage-adminbackend.onrender.com/api/users/pending');
                        setPendingUsers(response.data); // Set the pending users data
                    } else if (activeTab === 'accepted') {
                        const response = await axios.get('https://kidgage-adminbackend.onrender.com/api/users/accepted'); // Adjust the endpoint for accepted users
                        setAcceptedUsers(response.data); // Set the accepted users data
                    }
                } catch (error) {
                    console.error(`Error fetching ${activeTab} users:`, error);
                } finally {
                    setLoading(false); // Stop loading after fetch
                }
            };
            fetchUsers();
        }
    }, [show, activeTab]);

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

    // Function to download a file
    const downloadFile = () => {
        const base64String = selectedUser.crFile; // Assuming this is the Base64 string
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${base64String}`; // Change mime type if needed
        link.download = 'CRFile.pdf'; // Provide a default name
        link.click();
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

                <h3>Requests</h3>

                {/* Tabs for switching between "Pending" and "Accepted" */}
                <div className="tab-buttons">
                    <button
                        className={activeTab === 'pending' ? 'active' : ''}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Requests
                    </button>
                    <button
                        className={activeTab === 'accepted' ? 'active' : ''}
                        onClick={() => setActiveTab('accepted')}
                    >
                        Verified Requests
                    </button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : selectedUser ? (
                    // Display selected user's details
                    <div className='pending-form'>
                        <div style={{ display: 'flex', marginBottom: '10px', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                            <button style={{ backgroundColor: 'transparent', color: '#387CB8', padding: '0' }} onClick={() => setSelectedUser(null)}>
                                <FontAwesomeIcon style={{ fontSize: 'x-large' }} icon={faArrowLeft} />
                            </button>
                            {selectedUser.crFile && (
                                <button type="button" onClick={downloadFile} style={{ padding: '10px 20px', borderRadius: '20px' }}>
                                    Download CR File
                                </button>
                            )}
                        </div>
                        <h4>{selectedUser.username}</h4>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Status:</strong> {selectedUser.verificationStatus}</p>
                        <p><strong>Location:</strong> {selectedUser.location}</p>
                        <p><strong>Description: </strong>{selectedUser.description}</p>
                        <h5 style={{ color: 'black' }}>Authority filling the form:</h5>
                        <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
                        <p><strong>Designation:</strong> {selectedUser.designation}</p>
                        {activeTab === 'pending' && (
                            <>
                                <button style={{ marginRight: '10px' }} onClick={() => handleVerify(selectedUser._id)}>Verify</button>
                                <button onClick={() => handleReject(selectedUser._id)}>Reject</button>
                            </>
                        )}
                    </div>
                ) : (
                    <ul>
                        {(activeTab === 'pending' ? pendingUsers : acceptedUsers).length > 0 ? (
                            (activeTab === 'pending' ? pendingUsers : acceptedUsers).map((user) => (
                                <li key={user._id} onClick={() => setSelectedUser(user)}>
                                    <strong>{user.username}</strong> {user.email}
                                </li>
                            ))
                        ) : (
                            <li>No {activeTab} requests.</li>
                        )}
                    </ul>
                )}
            </div>
        </>
    );
};

export default RequestsPopup;
