import React, { useState } from 'react';
import '../css/Login.css';
import LoginForm from './LoginForm'; // Assuming LoginForm is in the same directory

/* 
Component for managing login and registration for students and instructors.
Includes tabs for different login forms and a modal for new user information.
*/
const Login = () => {
  // State variables
  const [activeTab, setActiveTab] = useState('student'); // Tracks the active tab
  const [showModal, setShowModal] = useState(false); // Controls modal visibility

  // Handle tab click to switch between login forms
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Handle form submission for new registration
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'new') {
      setShowModal(true);
    }
  };

  // Close modal function
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="login-container">
      {/* Header Section */}
      <div className="header">
        <img src="logo-url" alt="University of Regina" className="logo" />
        <h1>Online Course Management</h1>
      </div>
      
      {/* Tab Navigation for Login Forms */}
      <div className="login-tabs">
        <button
          className={`login-tab ${activeTab === 'student' ? 'active' : ''}`}
          onClick={() => handleTabClick('student')}
        >
          Student Login
        </button>
        <button
          className={`login-tab ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => handleTabClick('new')}
        >
          New Student/Instructor
        </button>
      </div>

      {/* Conditional Rendering of Login Forms */}
      {activeTab === 'student' && (
        <LoginForm userType="student" />
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
            <label htmlFor="studentNumber">Student Id/Instructor Id</label>
            <input type="text" id="studentNumber" placeholder="Type your Student Id/Instructor Id" />
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
            <input type="text" id="city" placeholder="Enter your Current City of Resident" />
          </div>
          <button type="submit" className="submit-button">Register</button>
        </form>
      )}

      {/* Modal for New Registration Information */}
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
