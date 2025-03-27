import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./App.css";

export default function LogInApp({setIsLoggedIn, setLoggedInUser}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password");
    } else {
      setError("");
      const data = {
        username: username,
        password: password
      };
      fetch(`http://localhost:3001/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error); // Handle error messages from the server
        } else if (data.success) {
          setMessage('Logged In!');
          setError('');
          setIsLoggedIn(true);
          setLoggedInUser(username);
          navigate('/dashboard'); // Redirect to dashboard on successful login
        } else {
          setMessage('');
          setError('Unexpected error has occured!');
        }
      })
      .catch(error => {
        setError('An unexpected error occurred');
        console.error('Error:', error);
      });
    }
  };

  return (
    <div className="App">
      <div className="signup-container">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          {error && <p className="error">{error}</p>}
          {message && <p className="account-created">{message}</p>}
          <button type="submit">Log In</button>
          <p className="no-account">Don't have an account? <a href="/signup">Sign up</a> here!</p>
        </form>
      </div>
    </div>
  );
}