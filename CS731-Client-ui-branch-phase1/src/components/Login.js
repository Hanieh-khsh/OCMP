import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [showModal, setShowModal] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'new') {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="login-container">
      <div className="header">
        <img src="logo-url" alt="University of Regina" className="logo" />
        <h1>Online Course Management</h1>
      </div>
      <div className="login-tabs">
        <button className={`login-tab ${activeTab === 'student' ? 'active' : ''}`} onClick={() => handleTabClick('student')}>
          Student Login
        </button>
        <button className={`login-tab ${activeTab === 'instructor' ? 'active' : ''}`} onClick={() => handleTabClick('instructor')}>
          Instructor Login
        </button>
        <button className={`login-tab ${activeTab === 'new' ? 'active' : ''}`} onClick={() => handleTabClick('new')}>
          New Student/Instructor
        </button>
      </div>

      {activeTab === 'student' && (
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input type="text" id="studentId" placeholder="Type your Student ID" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Type your Password" />
          </div>
          <div className="remember-me">
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">Save my information</label>
          </div>
          <button type="submit" className="login-button">LOG IN</button>
          <a href="#" className="disposal-password">Give me a disposal Password</a>
        </form>
      )}

      {activeTab === 'instructor' && (
        <div className="placeholder-content">
          <h2>Instructor Login Form Placeholder</h2>
        </div>
      )}

      {activeTab === 'new' && (
        <form className="new-form" onSubmit={handleSubmit}>
          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" placeholder="Type your First Name" />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" placeholder="Type your Last Name" />
          </div>
          <div className="form-group">
            <label htmlFor="studentNumber">Student Number/ Organization Code</label>
            <input type="text" id="studentNumber" placeholder="Type your Student Number/ Organization Code" />
          </div>
          <h2>Contact Information</h2>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="text" id="phoneNumber" placeholder="Type your Phone number" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Type your Email address" />
          </div>
          <div className="form-group">
            <label htmlFor="city">Current City of Resident</label>
            <input type="text" id="city" placeholder="Select your Current City of Resident" />
          </div>
          <button type="submit" className="submit-button">Create my User name & Password</button>
        </form>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Hi Beatrice!</h2>
            <p>Welcome to University of Regina!</p>
            <p>Your User Name is: 200511066</p>
            <p>Password: T2r0i0x5!</p>
            <button className="modal-button" onClick={closeModal}>Send to My Phone</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
