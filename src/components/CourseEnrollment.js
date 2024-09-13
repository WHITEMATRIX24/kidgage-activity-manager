import React, { useState } from 'react';
import './CourseEnrollment.css'; // Create a CSS file for styling
import { FaChevronDown, FaSearch, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CourseEnrollment = () => {
    const [showForm, setShowForm] = useState(true);
    const [courseId, setCourseId] = useState('');
    const [students, setStudents] = useState([]); // Assume students will be fetched based on courseId

    const handleSearch = () => {
        // Logic to fetch students based on courseId will go here
        // This is just a placeholder
        setStudents([
            { id: 1, name: 'John Doe', email: 'john@example.com', enrollmentDate: '2024-01-15' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', enrollmentDate: '2024-02-20' }
        ]);
    };

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
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
        <div className="course-enrollment-container">
            <div className="course-enrollment-header" onClick={toggleFormVisibility}>
                <h2>Course Enrollment</h2>
                <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} />
            </div>
            {showForm && (
                <div className="course-enrollment-form">
                    <div className="form-group course-search">
                        <input
                            type="text"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            placeholder="Enter Course Name..."
                        />
                        <button type="button" className="search-provider-button" onClick={handleSearch}>
                            <FaSearch />
                        </button>
                    </div>
                    {students.length > 0 && (
                        <div className="students-list">
                            <h3>Enrolled Students</h3>
                            <button className="download-pdf-button" onClick={downloadPDF}>
                                <FaFilePdf /> Download PDF
                            </button>
                            <div id="students-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Enrollment Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(student => (
                                            <tr key={student.id}>
                                                <td>{student.id}</td>
                                                <td>{student.name}</td>
                                                <td>{student.email}</td>
                                                <td>{student.enrollmentDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CourseEnrollment;
