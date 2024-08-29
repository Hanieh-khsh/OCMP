import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, CssBaseline, Link } from '@mui/material';
import LoginTabs from './components/LoginTabs';
import CourseListPage from './components/CourseListPage';
import NewUserForm from './components/NewUserForm';
import './App.css';
import CourseListPageInstructor from './components/CourseListPageInstructor';
import CourseListPageCourseDetials from './components/CourseListPageCourseDetials';
import CourseInstructorCourseDetails from './components/CourseInstructorCourseDetails';


const Banner = () => (
  <Box sx={{ bgcolor: 'white', color: 'white', py: 1, pb:5 , textAlign: 'center' }}>
    <img src="/logo.png" alt="University of Regina" width={100} />
    <Typography variant="h4" color="#05440A">University of Regina</Typography>
    <Typography variant="subtitle1" color="#05440A">Online Course Management</Typography>
  </Box>
);

const CustomToolbar = () => (
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
          {/* <Link href="#">Course list</Link> | <Link href="#">Your Profile</Link> | <Link href="#">Log out</Link> */}
           <Link href="/">Log out</Link>
        </Box>
    </Toolbar>
  </AppBar>
);

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

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout><LoginTabs /></Layout>} />
      <Route path="/courses" element={<Layout><CourseListPage /></Layout>} />
      <Route path="/new-user" element={<Layout><NewUserForm /></Layout>} />
      <Route path="/courses-instrustor" element={<Layout><CourseListPageInstructor/></Layout>} />
      <Route path="/courses/Coursedetails" element={<Layout><CourseListPageCourseDetials/></Layout>} />
      <Route path="/courses-instrustor/Coursedetails" element={<Layout><CourseInstructorCourseDetails/></Layout>} />

    </Routes>
  </Router>
);

export default App;
