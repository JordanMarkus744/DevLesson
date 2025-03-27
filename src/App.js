import { React, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignUpApp from "./signup";
import LoginApp from "./login";
import Dashboard from "./dashboard";
import Chapters from "./chapters";
import Lessons from "./lessons";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/signup" element={<SignUpApp />} />
                    <Route path="/login" element={<LoginApp setIsLoggedIn={setIsLoggedIn} setLoggedInUser={setLoggedInUser} />} />
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard username={loggedInUser} setSelectedCourse={setSelectedCourse} /> : <Navigate to="/login" />} />
                    <Route path="/chapters" element={<Chapters username={loggedInUser} course={selectedCourse} />} />
                    <Route path="/lessons" element={<Lessons />}/>
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;