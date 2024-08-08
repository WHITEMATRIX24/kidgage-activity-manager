import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaChevronDown, FaChevronUp, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './AddCourseForm.css'; // Create a separate CSS file or reuse an existing one

const EventEnrollment = () => {
    const [posters, setPosters] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [students, setStudents] = useState([]);
    const [selectedPoster, setSelectedPoster] = useState(null);

    useEffect(() => {
        fetchPosters();
    }, []);

    const fetchPosters = async () => {
        try {
            const response = await axios.get('https://kidgage-adminbackend.onrender.com/api/posters');
            setPosters(response.data);
        } catch (error) {
            console.error('Error fetching posters:', error);
        }
    };

    const getImageSource = (imageBase64) => {
        if (imageBase64) {
            return `data:image/jpeg;base64,${imageBase64}`; // Adjust MIME type as needed
        }
        return null;
    };

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    const handleViewEnrollment = async (poster) => {
        try {
            const response = await axios.get(`https://kidgage-adminbackend.onrender.com/api/bookings/event/${poster._id}`);
            setStudents(response.data);
            setSelectedPoster(poster);
            setViewMode(true);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        }
    };

    const downloadPDF = () => {
        const input = document.getElementById('students-table');
        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('students_list.pdf');
        });
    };

    return (
        <div className="add-course-form-container">
            {!viewMode ? (
                <>
                    <div className='add-course-form-header' onClick={toggleFormVisibility}>
                        <h2>Event Enrollment</h2>
                        <span className="toggle-icon">
                            {isFormVisible ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                    </div>
                    {isFormVisible && (
                        <div className="banner-list">
                            {posters.map((poster) => (
                                <div className="banner-box" key={poster._id}>
                                    <img src={getImageSource(poster.image)} alt={poster.name} />
                                    <div className="banner-info">
                                        <h3>{poster.name}</h3>
                                        <p>{poster.description}</p>
                                        <div className='button-container'>
                                            <button className="view-banner-button" onClick={() => handleViewEnrollment(poster)}>
                                                <FaEye /> View Enrollment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="students-list">
                    <h3>Enrolled Students for {selectedPoster.name}</h3>
                    <button className="download-pdf-button" onClick={downloadPDF}>
                        <FaFilePdf /> Download PDF
                    </button>
                    <div id="students-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Student Name</th>
                                    <th>Parent Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student._id}>
                                        <td>{student._id}</td>
                                        <td>{student.studentName}</td>
                                        <td>{student.parentName}</td>
                                        <td>{student.parentEmail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button className="back-to-events-button" onClick={() => setViewMode(false)}>
                        Back to Events
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventEnrollment;
