import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageCourse = () => {
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const email = sessionStorage.getItem('email'); // Fetch the email from localStorage
                if (!email) {
                    throw new Error('No email found in localStorage.');
                }

                console.log('Email:', email);
                const providerResponse = await axios.get(`http://localhost:5001/api/users/email/${email}`);
                console.log('Provider Response:', providerResponse.data); // Log response data for debugging

                setProvider(providerResponse.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.error('Provider not found.');
                } else {
                    console.error('Error fetching provider data:', error.message || error);
                }
            }
        };

        fetchCourseData();
    }, []);

    if (!provider) {
        return <div>Loading...</div>;
    }

    return (
        <div className="activity-info-container">
            <div className="activity-info-provider">
                <h2>Activity provided by</h2>
                <p>{provider.username || 'N/A'}</p>
                <p>{provider.email || 'N/A'}</p>
                <p>{provider.phoneNumber || 'N/A'}</p>
                {/* Add other fields as needed */}
            </div>
        </div>
    );
};

export default ManageCourse;
