import React from 'react';
import './config.js';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, CssBaseline, Link as RouterLink } from '@mui/material';
import LoginTabs from './components/login/LoginTabs';
import CourseListPage from './pages/CourseListPage';
import NewUserForm from './components/signUp/NewUserForm.js';
import './App.css';
import CourseListPageInstructor from './pages/CourseListPageInstructor';
import CourseListPageCourseDetials from './pages/CourseListPageCourseDetials';
import CourseInstructorCourseDetails from './pages/CourseInstructorCourseDetails';
import CourseEditPage from './pages/CourseEditPage';
import StudentDashboard from './pages/StudentDashboard';
import ChatButton from './components/chat/chatButton.js';

/* 
Component for displaying a banner with university logo and name.
*/
const Banner = () => (
  <Box sx={{ bgcolor: 'white', color: 'white', py: 1, pb: 5, textAlign: 'center' }}>
    <img src="/logo.png" alt="University of Regina" width={100} />
    <Typography variant="h4" color="#05440A">University of Regina</Typography>
    <Typography variant="subtitle1" color="#05440A">Online Course Management</Typography>
  </Box>
);

/* 
Component for custom toolbar with navigation and logout functionality.
*/
const CustomToolbar = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/', { replace: true });
  };

  return (
    <AppBar position="sticky" color="default">
      <Toolbar>
        <img src="/logo.png" alt="University of Regina" className="logo" width={60} />
        <Box ml={2}>
          <Typography variant="h6" color="#05440A">
            University of Regina
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Online Course Management
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box mb={2} textAlign="right">
          <RouterLink to="/" onClick={handleLogout}>
            Log out
          </RouterLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

/* 
Component to wrap the application layout.
Displays either a banner or toolbar based on the current route.
*/
const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginOrNewUser = location.pathname === '/' || location.pathname === '/new-user';
  
  return (
    <div className="App">
      <CssBaseline />
      {isLoginOrNewUser ? <Banner /> : <CustomToolbar />}
      <Container>
        {children}
      </Container>
    </div>
  );
};

/* 
Main application component with routing logic.
Defines routes for different pages and uses a layout for consistent styling.
*/
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout><LoginTabs /></Layout>} />
      <Route path="/courses" element={<Layout><CourseListPage /></Layout>} />
      <Route path="/new-user" element={<Layout><NewUserForm /></Layout>} />
      <Route path="/courses-instructor" element={<Layout><CourseListPageInstructor /></Layout>} />
      <Route path="/courses/Coursedetails" element={<Layout><CourseListPageCourseDetials /></Layout>} />
      <Route path="/courses-instructor/Coursedetails" element={<Layout><CourseInstructorCourseDetails /></Layout>} />
      <Route path="/courses-instructor/CourseEditPage" element={<Layout><CourseEditPage /></Layout>} />
      <Route path="/StudentDashboard" element={<Layout><StudentDashboard/></Layout>} />
    </Routes>
  </Router>
);

export default App;
