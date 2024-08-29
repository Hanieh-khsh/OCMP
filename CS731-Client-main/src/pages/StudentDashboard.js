import React, { useEffect, useState } from 'react';
import {
  Box, Container, Tabs, Link, Tab, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FullScreenLoader from '../components/shared/loader';
import Header from '../components/studentDashboard/header';
import CourseAccordion from '../components/studentDashboard/courseAccordion';
import Placeholder from '../components/shared/placeholder';
import {
  fetchUserData, fetchStudentCourses, getGradientColor, updateCurrentSemester
} from '../hooks/useCourseList';
import '../css/CourseListPage.css';
import { fetchAttendanceData, fetchInstructorName, fetchGradesForCourse } from '../hooks/useCourseList'; // Make sure the path is correct


const CourseListPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [breadcrumb, setBreadcrumb] = useState('Student Dashboard');
  const [userData, setUserData] = useState(null);
  const [currentSemester, setCurrentSemester] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedStudentID = localStorage.getItem('studentID');
    const numericStudentID = storedStudentID ? storedStudentID.replace(/['"]+/g, '') : null;
    if (storedStudentID) {
      fetchUserData(numericStudentID, setLoading, setUserData);
      fetchStudentCourses(numericStudentID, setLoading, setCourses, fetchAttendanceData, fetchInstructorName, fetchGradesForCourse);
    }
    updateCurrentSemester(setCurrentSemester);
  }, []);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    updateBreadcrumb(newValue);
  };

  const updateBreadcrumb = (tabIndex) => {
    let breadcrumbText;
    switch (tabIndex) {
      case 0:
        breadcrumbText = 'Courses';
        break;
      case 1:
        breadcrumbText = 'Future Feature2';
        break;
      case 2:
        breadcrumbText = 'Future Feature3';
        break;
      default:
        breadcrumbText = 'Courses';
    }
    setBreadcrumb(breadcrumbText);
  };

  const handleNameClick = (courseName) => {
    console.log(`Course name clicked: ${courseName}`);
    navigate('/courses/Coursedetails', { state: { courseName } });
  };

  return (
    <div className="course-list-page">
      {loading && <FullScreenLoader />}
      <Header userData={userData} currentSemester={currentSemester} />

      <Container>
        <Box mb={2} textAlign="left">
          <Link href="#" color="inherit" onClick={() => navigate('/StudentDashboard')} underline="hover">
            Student Portal
          </Link>
          {' / '}
          <Link href="#" color="inherit" onClick={() => navigate('/StudentDashboard')} underline="hover">
            Course List
          </Link>
          {' / '}
          <Typography component="span" color="textPrimary">
            {breadcrumb}
          </Typography>
        </Box>
        <Tabs
          value={activeTab}
          textColor="#000000"
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: '#05440A' } }}
          sx={{ '& .Mui-selected': { fontSize: '18px' } }}
          centered
        >
          <Tab label="Courses" sx={{ fontSize: '16px', textTransform: 'none' }} />
          <Tab label="Future Feature2" sx={{ fontSize: '16px', textTransform: 'none' }} />
          <Tab label="Future Feature3" sx={{ fontSize: '16px', textTransform: 'none' }} />
        </Tabs>
        <Box mt={3}>
          {activeTab === 0 && (
            <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <CourseAccordion
                    key={index}
                    course={course}
                    handleNameClick={handleNameClick}
                    getGradientColor={getGradientColor}
                  />
                ))
              ) : (
                <Typography variant="h6" color="textSecondary">
                  No courses found.
                </Typography>
              )}
            </Box>
          )}
          {activeTab === 1 && <Placeholder />}
          {activeTab === 2 && <Placeholder />}
        </Box>
      </Container>
    </div>
  );
};

export default CourseListPage;
