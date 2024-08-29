import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Tabs, Link, Tab, Card, CardContent, CardMedia, Button, Skeleton } from '@mui/material';
import { AccessTime, CalendarToday, LocationOn, Language, EventAvailable, AddAlarm } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './CourseListPage.css';

const CourseListPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [breadcrumb, setBreadcrumb] = useState('Courses');
  const [studentID, setStudentID] = useState(null);
  const [userData, setUserData] = useState(null); // State to store user data
  const navigate = useNavigate();

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

  useEffect(() => {
    // Retrieve the student number from local storage
    const storedStudentID = localStorage.getItem('studentID');
    if (storedStudentID) {
      setStudentID(storedStudentID);
      fetchUserData(storedStudentID);
    }
  }, []);

  const fetchUserData = async (studentID) => {
    try {
      const response = await fetch(`http://204.83.75.184:8080/getUser/getUser/${studentID}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleCardClick = (courseTitle) => {
    navigate(`/course-instructor-course-details/${courseTitle}`);
  };

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

  return (
    <div className="course-list-page">
      <Box bgcolor="#FFFFFF" mt={3} mb={2} display="flex" alignItems="center" justifyContent="space-between" textAlign="left">
        <Box display="flex" alignItems="center" borderLeft={'5px solid #05440A'} paddingLeft={1} borderRadius={1}>
          <img src="/img/Fallsemester.jpg" alt="Fallsemester in University of Regina" className="logo" width={80} />
          <Box ml={2}>
            <Typography variant="h4">Good Afternoon Trix!</Typography>
            <Typography variant="subtitle1">Fall Semester 2024</Typography>
          </Box>
        </Box>
      </Box>

      <Container>
        <Box mb={2} textAlign="left">
          <Link href="#" color="inherit" onClick={() => navigate('/courses')} underline="hover">
            Student Portal
          </Link>
          {' / '}
          <Link href="#" color="inherit" onClick={() => navigate('/courses')} underline="hover">
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
              <Card className="course-card" sx={{ maxWidth: 345, cursor: 'pointer' }} onClick={() => handleCardClick('Pathology and Corrective Movements')}>
                <CardMedia
                  component="img"
                  height="140"
                  image="/img/Pathology and Corrective Movements.jpg"
                  alt="Pathology and Corrective Movements"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Pathology and Corrective Movements
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instructors: Dr. Bil Anderson
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body2" ml={1}>Mon 09-11, Wed 11-13</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mt={1}>
                    <LocationOn fontSize="small" />
                    <Typography variant="body2" ml={1}>Class Room 311</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mt={1}>
                    <CalendarToday fontSize="small" />
                    <Typography variant="body2" ml={1}>Exam date: 28/11/2024</Typography>
                  </Box>
                </CardContent>
              </Card>
              <Card className="course-card" sx={{ maxWidth: 345, cursor: 'pointer' }} onClick={() => handleCardClick('Human Ergonomics Principles & Anatomies')}>
                <CardMedia
                  component="img"
                  height="140"
                  image="/img/human-ergonomics.jpg"
                  alt="Human Ergonomics Principles & Anatomies"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Human Ergonomics Principles & Anatomies
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instructors: Dr. Daniel Smith
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body2" ml={1}>Mon 15-17, Fri 13-15</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mt={1}>
                    <LocationOn fontSize="small" />
                    <Typography variant="body2" ml={1}>Classroom 301</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mt={1}>
                    <CalendarToday fontSize="small" />
                    <Typography variant="body2" ml={1}>Exam date: 28/11/2024</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
          {activeTab === 1 && renderPlaceholder()}
          {activeTab === 2 && renderPlaceholder()}
        </Box>
      </Container>
    </div>
  );
};

export default CourseListPage;
