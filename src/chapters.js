import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarRenderer from "./navbar";
import "./chapters.css";

function Chapters({ username, course }) {
    const [chapters, setChapters] = useState([]);
    const [error, setError] = useState("");
    
    const navigate = useNavigate(); // Call useNavigate at the top level of the component

    function GoToLessons(chapter){
        navigate("/lessons", { state: { chapter } });
    }

    useEffect(() => {
        if (course && course.course_name) {
            fetch(`http://localhost:3001/api/${course.course_name}/chapters`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                        setError(data.error);
                    } else {
                        console.log(data.data); // Ensure data.data is an array
                        setChapters(data.data);
                    }
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                    setError('An error occurred while fetching chapters.');
                });
        } else {
            console.log('Invalid course:', course);
            setError('Course is not defined.');
        }
    }, [course]);

    return (
        <>
            <NavbarRenderer username={username} />
            <p>{error}</p>
            <div className="chapters-course-card">
                <h1 className="chapters-course-header">{course.course_name}</h1>
                <p className="chapters-course-description">{course.description}</p>
            </div>
            <div className="chapters-list">
                {chapters.length === 0 ? (
                    <p>No chapters available.</p>
                ) : (
                    chapters.map(chapter => (
                        <div className="chapters-card" key={chapter.chapter_id} onClick={() => GoToLessons(chapter)}>
                            <h2 className="chapters-card-title">{chapter.chapter_title}</h2>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default Chapters;