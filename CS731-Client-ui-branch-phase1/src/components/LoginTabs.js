import React, { useState } from 'react';
import './LoginTabs.css';
import LoginForm from './LoginForm';
import NewUserForm from './NewUserForm';

const LoginTabs = () => {
  const [activeTab, setActiveTab] = useState('student');

  return (
    <div className="login-tabs">
      <div className="tabs">
        <button onClick={() => setActiveTab('student')} className={activeTab === 'student' ? 'active' : ''}>Student Login</button>
        <button onClick={() => setActiveTab('instructor')} className={activeTab === 'instructor' ? 'active' : ''}>Instructor Login</button>
        <button onClick={() => setActiveTab('newUser')} className={activeTab === 'newUser' ? 'active' : ''}>New Student/ Instructor</button>
      </div>
      <div className="tab-content">
        {activeTab === 'student' && <LoginForm userType="student" />}
        {activeTab === 'instructor' && <LoginForm userType="instructor" />}
        {activeTab === 'newUser' && <NewUserForm />}
      </div>
    </div>
  );
};

export default LoginTabs;
