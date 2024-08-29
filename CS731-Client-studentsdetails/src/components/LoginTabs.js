import React from 'react';
import useTabs from '../hooks/useTabs'; // Import custom hook
import '../css/LoginTabs.css';
import LoginForm from './LoginForm';
import NewUserForm from './NewUserForm';

/* 
Component for toggling between login and registration forms.
Includes tabs for login and registration and renders respective form based on the active tab.
*/
const LoginTabs = () => {
  const [activeTab, changeTab] = useTabs('student'); // Use custom hook to manage tabs

  return (
    <div className="login-tabs">
      <TabButtons activeTab={activeTab} changeTab={changeTab} /> {/* Separate component for tab buttons */}
      <TabContent activeTab={activeTab} /> {/* Separate component for tab content */}
    </div>
  );
};

// Separate component for rendering tab buttons
const TabButtons = ({ activeTab, changeTab }) => (
  <div className="tabs">
    <button onClick={() => changeTab('student')} className={activeTab === 'student' ? 'active' : ''}>
      Login
    </button>
    <button onClick={() => changeTab('newUser')} className={activeTab === 'newUser' ? 'active' : ''}>
      Register
    </button>
  </div>
);

// Separate component for rendering the content of the active tab
const TabContent = ({ activeTab }) => (
  <div className="tab-content">
    {activeTab === 'student' && <LoginForm userType="student" />}
    {activeTab === 'newUser' && <NewUserForm />}
  </div>
);

export default LoginTabs;
