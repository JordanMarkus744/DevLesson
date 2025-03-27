import React, { useState, useEffect,  } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"

function NavbarRenderer({username}){
    const [profilePicture, setProfilePicture] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropDown = () => {
        setIsOpen(!isOpen); // When the profile pic is clicked, if isOpen is false, then it gets set to true.
    }

    useEffect(() => {
        async function fetchProfilePicture() {

            let url = 'https://i.imgur.com/';

            fetch(`http://localhost:3001/api/profilePictureRender/${username}`)
                .then(response => response.json())
                .then(data => {
                    if (!data.error) {
                        url = url + data.data.userProfilePicture + ".jpg";
                        console.log(url);
                        setProfilePicture(url);
                    } else {
                        console.log(data.error);
                    }
            }); 
        }

        if (username){
            fetchProfilePicture();
        }

        console.log(username);


    }, [username])




    return(
    <nav className="navbar">
        <div className="navbar-container">
            <div className="logo">
                <img src='https://i.imgur.com/H3DgOAN.png' alt="Logo" referrerPolicy="none" className="Logo"/>
            </div>
            <ul className="nav-links">
            <li><a onClick={() => navigate("/dashboard")} className="nav-link">Courses</a></li>
                <li><a href="#leaderboard">Leaderboard</a></li>
                <li><a href="#code-bits">Code Bits</a></li>
                <li><a href="#discuss">Discuss</a></li>
                <li><a href="#blog">Blog</a></li>
            </ul>
            <div className="nav-buttons">
                <a href="#go-pro" className="btn-pro">UPGRADE</a>
                <div className="profile-pic">
                        <img src={profilePicture} alt="Profile" onClick={toggleDropDown} className="profile-picture"/>
                        {isOpen && (
                            <div className="dropdown-menu">
                                <a href="#Settings">Settings</a>
                                <a href="#Help">Help</a>
                                <a href="#Logout">Logout</a>
                            </div>
                        )}
                </div>
            </div>
        </div>
    </nav>  
    );
}

export default NavbarRenderer;