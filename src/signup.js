import React, { useState } from "react";
import "./App.css";

export default function SignUpApp(){
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email){
      setError("Please enter your email");
    }
    else if (!username || !password){
      setError("Please enter both username and password");
    }
    else if (!confirmPassword){
      setError("Please reenter your password");
    }
    else if (confirmPassword !== password){
      setError("Password does not match");
    }
    else if (username.length > 15){
      setError("Username must be less than 15 characters");
    }
    else if (password.length < 6){
      setError("Password must be longer than 5 characters");
    }
    else{
      setError("");
      const data = {
        userEmail: email,
        userName: username,
        userPassword: password
      };
      fetch(`http://localhost:3001/api/signup`, {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if (!data.error){
            setMessage('Account Created');
            setError("");
            window.location.href = '/login';
        } else {
            setMessage("");
            setError('Could not create account');
            console.log(data.error);
        }
        
      });
    }
  };

  return (
    <div className="App">
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
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
          <div className="form-group">
            <label>Confirm Password</label>
            <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
            placeholder="Confirm password"
            />
          </div>
          {error && <p className="error">{error}</p>}
          {message && <p className="account-created">{message}</p>}
          <button type="submit">Create Account</button>
          <p className="no-account">Have an account? <a href="/login">Log in</a> here!</p>
        </form>
      </div>
    </div>
  );
};
