import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Lessons() {
    const location = useLocation();
    const [lessons, setLessons] = useState([]); // This will hold all lessons and quizzes
    const { chapter } = location.state || {}; // Destructure and default to an empty object if state is undefined

    useEffect(() => {
        if (chapter && chapter.chapter_id) { // Ensure chapter and chapter_id are defined
            const id = chapter.chapter_id;
            fetch(`http://localhost:3001/api/${id}/lessons`)
                .then(response => response.json())
                .then(data => {
                    if (!data.error) {
                        setLessons(data.data);
                    } else {
                        console.log("ahhhhh");
                    }
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                });
        }
        else{
            console.log("AHHHH");
        }
    }, [chapter]); // Add chapter to dependency array


    return (
        <div>
            {lessons.length === 0 ? (
                <p>No lessons available.</p>
            ) : (
                lessons.map(lesson => (
                    <div key={lesson.lesson_id}>
                        <h1 className="lessons-title">{lesson.lesson_title}</h1>
                        <p>{lesson.content}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Lessons;