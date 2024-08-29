import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Container, Tabs, Tab, Card, CardContent, CardMedia, IconButton, Link, Breadcrumbs
} from '@mui/material';
import { AccessTime, CalendarToday, LocationOn, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FullScreenLoader from '../components/loader'; // Import the loading animation component
import '../css/CourseListPageInstructor.css';
import CourseListPageInstructorCourseCreation from './CourseListPageInstructorCourseCreation';
import CourseListPageInstructorStudentRegistration from './CourseListPageInstructorStudentRegistration';
import config from '../config';  // Import the config
import useLocalStorage from '../hooks/useLocalStorage';  // Import the custom hook

const CourseListPageInstructor = () => {
  // State variables
  const [activeTab, setActiveTab] = useState(0); // Tracks the active tab index
  const [courses, setCourses] = useState([]); // List of courses fetched from the server
  const [studentID, setStudentID] = useLocalStorage('studentID', null); // Stores student ID from local storage
  const [userData, setUserData] = useState(null); // Stores user data fetched from the server
  const [currentSemester, setCurrentSemester] = useState(''); // Current semester information
  const [loading, setLoading] = useState(false); // Tracks loading state

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (studentID) {
      fetchInstructorCourses(studentID); // Fetch instructor's courses
      fetchUserData(studentID); // Fetch user data
    } else {
      console.warn('No student ID found in local storage.');
    }
    updateCurrentSemester(); // Update the current semester based on the date
  }, [studentID]); // Add studentID to the dependency array to ensure it triggers the effects when updated

  // Fetch instructor's courses based on user ID
  const fetchInstructorCourses = async (userID) => {
    try {
      setLoading(true); // Show loader
      const response = await fetch(`${config.API}/getCourseListInstructor/${userID}/courses`);
      if (response.ok) {
        const data = await response.json();
        await fetchInstructorData(data); // Fetch and update instructor data for each course
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Fetch user data based on student ID
  const fetchUserData = async (studentID) => {
    try {
      setLoading(true); // Show loader
      const response = await fetch(`${config.API}/getUser/getUser/${studentID}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Fetch instructor data for each course
  const fetchInstructorData = async (courseList) => {
    const updatedCourses = await Promise.all(courseList.map(async (course) => {
      try {
        const response = await fetch(`${config.API}/getUser/getUser/${course.studentID}`);
        if (response.ok) {
          const userData = await response.json();
          return {
            ...course,
            instructor: `${userData.firstName} ${userData.lastName}`,
          };
        } else {
          console.error('Failed to fetch instructor data');
          return {
            ...course,
            instructor: 'N/A',
          };
        }
      } catch (error) {
        console.error('Error fetching instructor data:', error);
        return {
          ...course,
          instructor: 'N/A',
        };
      }
    }));
    setCourses(updatedCourses);
  };

  // Handle tab change
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle edit button click and navigate to course edit page
  const handleEditClick = (event, courseName) => {
    event.stopPropagation(); // Prevent event propagation
    navigate('/courses-instructor/CourseEditPage', { state: { courseName } });
  };

  // Handle course card click and navigate to course details page
  const handleCardClick = (courseName) => {
    navigate('/courses-instructor/Coursedetails', { state: { courseName } });
  };

  // Get the label for the breadcrumb based on the active tab
  const getBreadcrumbLabel = () => {
    switch (activeTab) {
      case 0:
        return 'Courses';
      case 1:
        return 'Course Creation';
      case 2:
        return 'Student Registration';
      default:
        return '';
    }
  };

  // Generate greeting message based on the current time
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  // Determine the current semester based on the date
  const updateCurrentSemester = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let semester;
    if (currentMonth < 4) {
      semester = `Winter Semester ${currentYear}`;
    } else if (currentMonth < 8) {
      semester = `Spring/Summer Semester ${currentYear}`;
    } else {
      semester = `Fall Semester ${currentYear}`;
    }
    setCurrentSemester(semester);
  };

  return (
    <div className="course-list-page-instructor">
      {loading && <FullScreenLoader />} {/* Show loading spinner if loading */}
      {/* Header section with greeting and current semester */}
      <Container>
        <Box bgcolor="#FFFFFF" mt={3} mb={2} display="flex" alignItems="center" justifyContent="space-between" textAlign="left">
          <Box display="flex" alignItems="center" borderLeft={'5px solid #05440A'} paddingLeft={1} borderRadius={1}>
            <img src="/img/Fallsemester.jpg" alt="Fallsemester in University of Regina" className="logo" width={80} />
            <Box ml={2}>
              <Typography variant="h4">
                {getGreeting()}, {userData ? `${userData.firstName}` : 'Guest'}!
              </Typography>
              <Typography variant="subtitle1">{currentSemester}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Breadcrumb navigation */}
        <Box mb={2} textAlign="left">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="#" onClick={() => navigate('/courses-instructor')}>
              Instructor's Portal
            </Link>
            <Link underline="hover" color="inherit" href="#" onClick={() => navigate('/courses-instructor')}>
              Course List
            </Link>
            <Typography color="textPrimary">{getBreadcrumbLabel()}</Typography>
          </Breadcrumbs>
        </Box>

        {/* Tabs for navigation */}
        <Tabs
          value={activeTab}
          textColor="#000000"
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: '#05440A' } }}
          sx={{ '& .Mui-selected': { fontSize: '18px' } }}
          centered
        >
          <Tab label="Courses" sx={{ fontSize: '16px', textTransform: 'none' }} />
          <Tab label="Course Creation" sx={{ fontSize: '16px', textTransform: 'none' }} />
          <Tab label="Student Registration" sx={{ fontSize: '16px', textTransform: 'none' }} />
        </Tabs>

        {/* Content for the active tab */}
        <Box mt={3}>
          {activeTab === 0 && (
            <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
              {courses.length > 0 ? (
                // Display course cards if courses are available
                courses.map((course, index) => (
                  <Card
                    key={index}
                    className="course-card"
                    sx={{ maxWidth: 345 }}
                    onClick={() => handleCardClick(course.courseName)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={course.coverImage ? `${config.API}${course.coverImage}` : '/img/default-course.jpg'}
                      alt={course.courseName}
                    />
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography gutterBottom variant="h5" component="div">
                          {course.courseName}
                        </Typography>
                        <Box>
                          <IconButton
                            aria-label="edit"
                            sx={{ color: '#537756', '&:hover': { color: '#05440A' }, ml: 2 }}
                            onClick={(event) => handleEditClick(event, course.courseName)} // Added event to handleEditClick
                          >
                            <Edit />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Instructors: {course.instructor || 'N/A'}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <AccessTime fontSize="small" />
                        <Typography variant="body2" ml={1}>
                          {course.time || 'TBD'} on {course.day || 'TBD'}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mt={1}>
                        <LocationOn fontSize="small" />
                        <Typography variant="body2" ml={1}>
                          Classroom: {course.classroom || 'TBD'}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mt={1}>
                        <CalendarToday fontSize="small" />
                        <Typography variant="body2" ml={1}>
                          Exam: {course.examTime || 'TBD'} at {course.examLocation || 'TBD'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Display a message if no courses are found
                <Typography variant="h6" color="textSecondary">
                  No courses found.
                </Typography>
              )}
            </Box>
          )}
          {/* Render components for other tabs */}
          {activeTab === 1 && <CourseListPageInstructorCourseCreation />}
          {activeTab === 2 && <CourseListPageInstructorStudentRegistration />}
        </Box>
      </Container>
    </div>
  );
};

export default CourseListPageInstructor;
