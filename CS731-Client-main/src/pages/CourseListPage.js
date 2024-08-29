import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Tabs, Link, Tab, Card, CardContent, CardMedia, Button, Skeleton } from '@mui/material';
import { AccessTime, CalendarToday, LocationOn, EventAvailable } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FullScreenLoader from '../components/shared/loader'; // Import the loading animation component
import '../css/CourseListPage.css';
import config from '../config';  // Import the config


/* 
Main component for displaying a list of courses for students. 
Features include tabs for navigation, course cards with details, and future placeholders.
*/
const CourseListPage = () => {
  // State variables
  const [activeTab, setActiveTab] = useState(0); // Tracks the active tab index
  const [breadcrumb, setBreadcrumb] = useState('Student Dashboard'); // Breadcrumb text for navigation
  const [studentID, setStudentID] = useState(null); // Stores student ID from local storage
  const [userData, setUserData] = useState(null); // Stores user data fetched from the server
  const [currentSemester, setCurrentSemester] = useState(''); // Current semester information
  const [courses, setCourses] = useState([]); // List of courses fetched from the server
  const [loading, setLoading] = useState(false); // Tracks loading state

  const navigate = useNavigate(); // Hook for navigation

  // Fetch data on component mount
  useEffect(() => {
    // Fetch student ID from local storage
    const storedStudentID = localStorage.getItem('studentID');
    if (storedStudentID) {
      setStudentID(storedStudentID);
      fetchUserData(storedStudentID); // Fetch user data
      fetchStudentCourses(storedStudentID); // Fetch courses
    }
    updateCurrentSemester(); // Update the current semester based on the date
  }, []);

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

  // Fetch instructor data for each course based on student ID
  const fetchInstructorData = async (courseList) => {
    const updatedCourses = await Promise.all(courseList.map(async (course) => {
      try {
        setLoading(true); // Show loader
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
      } finally {
        setLoading(false); // Hide loader
      }
    }));
    setCourses(updatedCourses);
  };

  // Fetch courses based on student ID
  const fetchStudentCourses = async (studentID) => {
    try {
      setLoading(true); // Show loader
      const response = await fetch(`${config.API}/getCourseListStudent/getCourseListStudent/${studentID}`);
      if (response.ok) {
        const data = await response.json();
        const courseList = data.courses || [];
        await fetchInstructorData(courseList);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Handle tab change and update breadcrumb text
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    updateBreadcrumb(newValue);
  };

  // Update breadcrumb text based on the active tab index
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

  // Navigate to course details page on card click
  const handleCardClick = (courseName) => {
    navigate('/courses/Coursedetails', { state: { courseName } });
  };

  // Render placeholder skeletons for future feature tabs
  const renderPlaceholder = () => (
    <Box display="flex" flexDirection="column" alignItems="left" width="100%">
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width="60%" height={20} sx={{ my: 1 }} />
      <Skeleton variant="rectangular" width="80%" height={20} sx={{ my: 1 }} />
      <Skeleton variant="rectangular" width="70%" height={20} sx={{ my: 1 }} />
      <Skeleton variant="rectangular" width="90%" height={20} sx={{ my: 1 }} />
      <Skeleton variant="rectangular" width="50%" height={20} sx={{ my: 1 }} />
    </Box>
  );

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
    <div className="course-list-page">
      {loading && <FullScreenLoader />} {/* Show loading spinner if loading */}
      {/* Header section with greeting and action button */}
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
        <Box textAlign="right" padding={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EventAvailable />}
            sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, textTransform: 'none' }}
          >
            Future Feature
          </Button>
        </Box>
      </Box>

      {/* Main container for the course list and tabs */}
      <Container>
        {/* Breadcrumb navigation */}
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
          <Tab label="Future Feature2" sx={{ fontSize: '16px', textTransform: 'none' }} />
          <Tab label="Future Feature3" sx={{ fontSize: '16px', textTransform: 'none' }} />
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
                      <Typography gutterBottom variant="h5" component="div">
                        {course.courseName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Instructor: {course.instructor || 'N/A'}
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
          {/* Placeholder for future feature tabs */}
          {activeTab === 1 && renderPlaceholder()}
          {activeTab === 2 && renderPlaceholder()}
        </Box>
      </Container>
    </div>
  );
};

export default CourseListPage;
