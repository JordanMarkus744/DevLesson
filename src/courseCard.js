import { useNavigate } from "react-router-dom";
import "./App.css";

const CourseCard = ({ course, setSelectedCourse }) => {
    const navigate = useNavigate(); // Call useNavigate at the top level

    function OnClickRouter() {
        setSelectedCourse(course);
        navigate("/chapters");
    }

    return (
        <div className="course-card" onClick={OnClickRouter}>
            <img src={course.course_logo} alt={`${course.course_name} logo`} className="course-logo" />
            <p className="course-name">{course.course_name}</p>
        </div>
    );
};

export default CourseCard;