import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, Button, Accordion, AccordionSummary, AccordionDetails, Breadcrumbs, Link, IconButton, List, ListItem, ListItemText, ListItemIcon, Skeleton, Tab, Tabs, Avatar, Icon, Divider } from '@mui/material';
import { ExpandMore, GetApp, CloudUpload, Favorite } from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FullScreenLoader from '../components/loader'; // Import the loading animation component
import '../css/CourseListPageCourseDetails.css';

const CourseListPageCourseDetails = () => {
  const { courseTitle } = useParams(); // Extracts the course title parameter from the URL
  const [courseDetails, setCourseDetails] = useState({}); // State for course details
  const [loading, setLoading] = useState(false); // Tracks loading state
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Provides information about the current URL
  const [activeTab, setActiveTab] = useState(0); // Tracks the active tab index
  const [breadcrumb, setBreadcrumb] = useState('Course Detail'); // Breadcrumb text for navigation

  // Extract courseName from location state or use a default value
  const courseName = location.state?.courseName || "defaultCourseName";

  useEffect(() => {
    const courseID = courseName;

    // Fetch course content and instructor name from the server
    const fetchCourseData = async () => {
      try {
        setLoading(true); // Show loader

        // Fetch course content
        const courseResponse = await fetch(`http://204.83.75.184:8080/getCourseContent/${courseID}`);
        if (!courseResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const courseData = await courseResponse.json();
        setCourseDetails(courseData); // Update state with fetched course details

        // Fetch instructor name using student ID
        const instructorResponse = await fetch(`http://204.83.75.184:8080/getUser/getUser/${courseData.studentID}`);
        if (instructorResponse.ok) {
          const instructorData = await instructorResponse.json();
          setCourseDetails((prevDetails) => ({
            ...prevDetails,
            instructorName: `${instructorData.firstName} ${instructorData.lastName}`
          }));
        } else {
          console.error('Failed to fetch instructor data');
        }
      } catch (error) {
        console.error('Error fetching course content:', error);
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchCourseData();
  }, [courseName]);

  // Handle download of course materials
  const handleDownload = (material, index) => {
    const link = document.createElement('a');
    link.href = `http://204.83.75.184:8080${material}`;
    link.download = `session-material-${index + 1}${material.substring(material.lastIndexOf('.'))}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

 
  const handleInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File uploaded:', file.name);
    }
  };

  
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    updateBreadcrumb(newValue);
  };

  const handleNameClick = (StudentName, tab) => {
    navigate('/studentDashboard', { state: { StudentName, activeTab: tab } });
  };

  
  const updateBreadcrumb = (tabIndex) => {
    let breadcrumbText;
    switch (tabIndex) {
      case 0:
        breadcrumbText = 'Course Detail';
        break;
      case 1:
        breadcrumbText = 'Participants Detail';
        break;
      default:
        breadcrumbText = 'Course Detail';
    }
    setBreadcrumb(breadcrumbText);
  };

  useEffect(() => {
    updateBreadcrumb(activeTab);
  }, [activeTab]);

  return (
    <div className="course-details-page" style={{ width: '100%', height: '100%' }}>
      {loading && <FullScreenLoader />} {/* Show loading spinner if loading */}
      {/* Header section displaying course details and exam information */}
      <Box bgcolor="#FFFFFF" mt={3} mb={2} display="flex" alignItems="center" justifyContent="space-between" textAlign="left">
        <Box display="flex" alignItems="center" borderLeft={'5px solid #05440A'} paddingLeft={1} borderRadius={1}>
          <img src={`http://204.83.75.184:8080${courseDetails.coverImage}`} alt={courseDetails.courseName} width={80} />
          <Box ml={2}>
            <Typography variant="h4">{courseDetails.courseName}</Typography>
            <Typography variant="subtitle1">Student ID: {courseDetails.studentID}</Typography>
            <Typography variant="subtitle2">{courseDetails.day} , {courseDetails.time}</Typography>
            <Typography variant="subtitle2">Instructor: {courseDetails.instructorName || 'Loading...'}</Typography> {/* Display instructor name */}
          </Box>
        </Box>
        <Box textAlign="right" padding={2}>
          <Typography variant="h6" color="#05440A">Exam Date: {courseDetails.examTime}</Typography>
          <Typography variant="subtitle2" color="#05440A">Exam Location: {courseDetails.examLocation}</Typography>
        </Box>
      </Box>
      
      <Container style={{ width: '100%', padding: '0' }}>
        
        <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/courses" onClick={() => navigate('/courses')}>
              Student's Portal
            </Link>
            <Link underline="hover" color="inherit" href="/courses" onClick={() => navigate('/courses')}>
              Course List
            </Link>
            <Typography color="textPrimary">{breadcrumb}</Typography>
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
          <Tab label="Course Detail" sx={{ fontSize: '16px', textTransform: 'none' }} />
          <Tab label="Participants' Detail" sx={{ fontSize: '16px', textTransform: 'none' }} />
        </Tabs>
        {/* Content for the active tab */}
        {activeTab === 0 && (
          <Box mt={3}>
            <Box className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
              <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
                <Accordion sx={{ width: '100%' }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography gutterBottom variant="h6" component="div">
                      What will you learn?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {courseDetails.description || 'No description provided.'}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
            {/* Section for course materials */}
            <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
              <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography gutterBottom variant="h6" component="div">
                    What are Course materials?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {courseDetails.sessionMaterials && courseDetails.sessionMaterials.length > 0 ? (
                    <List>
                      {courseDetails.sessionMaterials.map((material, index) => {
                        // Get the full file name from the URL
                        const fileNameWithPrefix = material.substring(material.lastIndexOf('/') + 1);

                        // Use a regular expression to remove any leading numbers and underscores
                        const fileName = fileNameWithPrefix.replace(/^[\d]+_/g, '');

                        return (
                          <ListItem key={index}>
                            <ListItemText primary={fileName} />
                            <ListItemIcon>
                              <IconButton
                                onClick={() => handleDownload(material, index)}
                                sx={{ color: '#537756' }}
                              >
                                <GetApp />
                              </IconButton>
                            </ListItemIcon>
                          </ListItem>
                        );
                      })}
                    </List>
                  ) : (
                    <Typography variant="body2">No course materials available for download.</Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>
            {/* Placeholder for future features */}
            <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
              <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography gutterBottom variant="h6" component="div">
                    Future Feature
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display="flex" flexDirection="column" alignItems="left" width="100%">
                    <Skeleton variant="rectangular" width="60%" height={20} sx={{ my: 1 }} />
                    <Skeleton variant="rectangular" width="80%" height={20} sx={{ my: 1 }} />
                    <Skeleton variant="rectangular" width="70%" height={20} sx={{ my: 1 }} />
                    <Skeleton variant="rectangular" width="90%" height={20} sx={{ my: 1 }} />
                    <Skeleton variant="rectangular" width="50%" height={20} sx={{ my: 1 }} />
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        )}
        {activeTab === 1 && (
          <Box mt={3}>
          <Box className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
            <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
              <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                 <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                    <Avatar alt="Student Image" src="/path/to/student-image.jpg" sx={{ width: 48, height: 48 }} />
                    <Typography ml={2} variant="h6" onClick={() => handleNameClick('Student name1', 'StudentDashboard')} sx={{ cursor: 'pointer', '&:hover': { color: '#05440A' , fontWeight: 'bold'} }}>
                            Student Name1
                    </Typography>
                    <Box textAlign="right" ml="auto" mr={2}>
                      <Button variant="contained" color="primary" startIcon={<Favorite />} sx={{ textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, width: '120px' }}>
                        Follow
                      </Button>
                    </Box>
                  </Box>
                </AccordionSummary>
                      
                  
                 
                  <AccordionDetails>

                  <Box display="flex" alignItems="center" flexDirection="row" spacing={2}>


                     <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Student Major</Typography>
                        <Typography variant="body2">Number of Semester </Typography>
                    </Box>
                     <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Student state</Typography>
                        <Typography variant="body2" color="Green" >Present: 8 sessions </Typography>
                        <Typography variant="body2" color="Red" >Absent: 2 sessions</Typography>
                        <Typography variant="body2" color="Orange">Tardy: 1 session </Typography>
                        <Typography variant="body2" color="text.secondary" > NW: 5 sessions </Typography>
                    </Box>
                          
                    <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Assignment Submittion State</Typography>
                        <Typography variant="body2" color="Green" >Assignment1: Submited </Typography>
                        <Typography variant="body2" color="Orange" >Assignment2: Late Submited</Typography>
                        <Typography variant="body2" color="Red" >Assignment3: Not Submited </Typography>
                        <Typography variant="body2" color="text.secondary" >Assignment4: NW </Typography>
                    </Box>

                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
            <Box className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
            <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
              <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                    <Avatar alt="Student Image" src="/path/to/student-image.jpg" sx={{ width: 48, height: 48 }} />
                    <Typography ml={2} variant="h6" onClick={() => handleNameClick('Student name2', 'StudentDashboard')} sx={{ cursor: 'pointer', '&:hover': { color: '#05440A' , fontWeight: 'bold'} }}>
                            Student Name2
                    </Typography>
                    <Box textAlign="right" ml="auto" mr={2}>
                      <Button variant="contained" color="primary" startIcon={<Favorite />} sx={{ textTransform: 'none', bgcolor: 'black', '&:hover': { bgcolor: '#05440A' }, width: '120px' }}>
                        UnFollow
                      </Button>
                    </Box>
                  </Box>
                </AccordionSummary>
                    
                  <AccordionDetails>

                  <Box display="flex" alignItems="center" flexDirection="row" spacing={2}>


                     <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Student Major</Typography>
                        <Typography variant="body2">Number of Semester </Typography>
                    </Box>
                     <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Student State</Typography>
                        <Typography variant="body2" color="Green" >Present: 8 sessions </Typography>
                        <Typography variant="body2" color="Red" >Absent: 2 sessions</Typography>
                        <Typography variant="body2" color="Orange">Tardy: 1 session </Typography>
                        <Typography variant="body2" color="text.secondary" > NW: 5 sessions </Typography>
                    </Box>
                          
                    <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Assignment Submittion State</Typography>
                        <Typography variant="body2" color="Green" >Assignment1: Submited </Typography>
                        <Typography variant="body2" color="Orange" >Assignment2: Late Submited</Typography>
                        <Typography variant="body2" color="Red" >Assignment3: Not Submited </Typography>
                        <Typography variant="body2" color="text.secondary" >Assignment4: NW </Typography>
                    </Box>

                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default CourseListPageCourseDetails;
