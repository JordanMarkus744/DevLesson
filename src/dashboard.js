import React, { useState, useEffect } from "react";
import CourseCard from "./courseCard";
import "./Dashboard.css";
import NavbarRenderer from "./navbar.js";

export default function Dashboard({ username, setSelectedCourse }) {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await fetch('http://localhost:3001/api/courses');
                const data = await response.json();
                if (!data.error) {
                    setCourses(Array.isArray(data) ? data : []);
                } else {
                    setError("Couldn't fetch courses");
                }
            } catch (error) {
                setError("An error occurred while fetching courses");
            }
        }

        fetchCourses();
    }, []);

    return (
        <div className="dashboard-container">
            <NavbarRenderer username={username}/>
            <h1 className="course-header">COURSES</h1>
            <div className="course-list">
                {courses.map(course => (
                    <CourseCard key={course.course_id} course={course} setSelectedCourse={setSelectedCourse}/>
                ))}
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}