import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageCourse = () => {
    const [provider, setProvider] = useState(null);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProviderAndCourses = async () => {
            const userId = sessionStorage.getItem('userid'); // Fetch the user ID from session storage
            if (!userId) {
                setError('No user ID found in session storage.');
                return;
            }

            try {
                // Fetch provider data
                const providerResponse = await axios.get(`http://localhost:5001/api/users/user/${userId}`);
                console.log('Provider Response:', providerResponse.data);
                setProvider(providerResponse.data);

                // Fetch courses for the specific provider using the provider's ID
                const providerId = providerResponse.data.id; // Use the correct property for the provider ID
                const coursesResponse = await axios.get(`http://localhost:5001/api/courses/by-providers`, {
                    params: {
                        providerIds: [providerId], // Pass the provider ID as an array
                    },
                });
                console.log('Courses Response:', coursesResponse.data);
                
                // Set courses for the specific provider
                setCourses(coursesResponse.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError('Provider or courses not found.');
                } else {
                    setError(`Error fetching data: ${error.message || error}`);
                }
            }
        };

        fetchProviderAndCourses();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

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
            </div>
            <div className="course-list">
                <h2>Courses Offered by Provider</h2>
                {courses.length > 0 ? (
                    <ul>
                        {courses.map((course) => (
                            <li key={course.id}>
                                <h3>{course.name}</h3>
                                <p>{course.description}</p>
                                {/* Add other fields as needed */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No courses available for this provider.</p>
                )}
            </div>
        </div>
    );
};
export default ManageCourse;
