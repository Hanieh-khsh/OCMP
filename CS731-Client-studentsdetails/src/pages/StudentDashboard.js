import React, { useEffect, useState } from 'react';
import { Typography, Box, Container, Tabs, Link, Tab, CardMedia, Button, Accordion, AccordionSummary, AccordionDetails, Avatar } from '@mui/material';
import { AppRegistration, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullScreenLoader from '../components/loader'; 
import '../css/CourseListPage.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [breadcrumb, setBreadcrumb] = useState('Courses');
  const [studentID, setStudentID] = useState(null);
  const [userData, setUserData] = useState(null);
  const [currentSemester, setCurrentSemester] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const storedStudentID = localStorage.getItem('studentID');
      if (storedStudentID) {
        setStudentID(storedStudentID);
        await fetchUserData(storedStudentID);
        await fetchStudentCourses(storedStudentID);
      }
      updateCurrentSemester();
    };
    fetchData();
  }, []);

  const updateCurrentSemester = () => {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 1 && currentMonth <= 5) {
      setCurrentSemester('Spring 2024');
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      setCurrentSemester('Summer 2024');
    } else {
      setCurrentSemester('Fall 2024');
    }
  };

  const fetchUserData = async (studentID) => {
    try {
      setLoading(true);
      const response = await fetch(`http://204.83.75.184:8080/getUser/getUser/${studentID}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructorData = async (courseList) => {
    try {
      setLoading(true);
      const updatedCourses = await Promise.all(courseList.map(async (course) => {
        try {
          const response = await fetch(`http://204.83.75.184:8080/getUser/getUser/${course.studentID}`);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentCourses = async (studentID) => {
    try {
      setLoading(true);
      const response = await fetch(`http://204.83.75.184:8080/getCourseListStudent/getCourseListStudent/${studentID}`);
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
      setLoading(false);
    }
  };

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    updateBreadcrumb(newValue);
  };

  const updateBreadcrumb = (tabIndex) => {
    let breadcrumbText;
    switch (tabIndex) {
      case 0:
        breadcrumbText = 'Ongoing Courses';
        break;
      case 1:
        breadcrumbText = 'Ongoing Mutual Courses';
        break;
      case 2:
        breadcrumbText = 'Passed Courses';
        break;
      case 3:
        breadcrumbText = 'Passed Mutual Courses';
        break;
      default:
        breadcrumbText = 'Student Dashboard';
    }
    setBreadcrumb(breadcrumbText);
  };

  const handleNameClick = (courseName, tab) => {
    navigate('/courses/Coursedetails', { state: { courseName, activeTab: tab } });
  };

  const handleRegistration = (courseName) => {
   
    console.log(`Registration action for course: ${courseName}`);
  };

  useEffect(() => {
    const formattedStudents = studentsData.map(student => ({
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      major: 'Undeclared',
      semester: '1st Sem',
      level: student.position === 'Student' ? 'Undergrad' : 'Grad',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` 
    }));
    setStudentsData(formattedStudents);
  }, [studentsData]);

  const SendEmailButton = () => {
    const handleSendEmail = () => {
      window.location.href = 'mailto:Studentemail@someemail.com';
    };

    return (
      <Button onClick={handleSendEmail} variant="contained" color="primary">
        Send Email
      </Button>
    );
  };

  return (
    <div className="course-list-page">
      {loading && <FullScreenLoader />}
      <Box bgcolor="#FFFFFF" mt={3} mb={2} display="flex" alignItems="center" justifyContent="space-between" textAlign="left">
        <Box display="flex" alignItems="center" borderLeft={'5px solid #05440A'} paddingLeft={1} borderRadius={1}>
          <img src="stuedntimage.jpg" alt="studentname's image" className="logo" width={80} />
          <Box ml={2}>
            <Typography variant="h4">
              {userData ? userData.name : 'Guest'}!
            </Typography>
            <Typography variant="subtitle1">{userData ? userData.email : 'No contact information available'}</Typography>
          </Box>
        </Box>
        <Box textAlign="right" padding={2}>
          <Button variant="contained" color="primary" startIcon={<Favorite />} sx={{ textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, width: '120px' }}>
            Follow
          </Button>
        </Box>
      </Box>

      <Container>
        <Box mb={2} textAlign="left">
          <Link href="#" color="inherit" onClick={() => navigate('/StudentDashboard')} underline="hover">
            Student Dashboard
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
          <Tab label="Ongoing Courses" sx={{ fontSize: '16px', textTransform: 'none' }} />
          <Tab label="Ongoing Mutual Courses" sx={{ fontSize: '16px', textTransform: 'none' }} />
          <Tab label="Passed Courses" sx={{ fontSize: '16px', textTransform: 'none' }} />
          <Tab label="Passed Mutual Courses" sx={{ fontSize: '16px', textTransform: 'none' }} />
        </Tabs>
        <Box mt={3}>
          {activeTab === 0 && (
            <Box mt={3}>
              <Box className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
                <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
                  <Accordion sx={{ width: '100%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                        <CardMedia component="img" image="/path/to/Coursepic.jpg" alt="Coursepic" sx={{ width: 48, height: 48 }} />
                        <Box display="flex" alignItems="center" sx={{ flexGrow: 1, ml: 2 }}>
                        <Typography variant="h6" onClick={() => handleNameClick('Course name2', 'Course Detail')} sx={{ cursor: 'pointer', marginRight: '8px', '&:hover': { color: '#05440A' , fontWeight: 'bold'} }}>
                            Course name1
                          </Typography>
                          <Box ml={2} display="flex" alignItems="center" onClick={() => handleNameClick('Course name1', 'Participants Detail')} style={{ cursor: 'pointer' }}>
                            <Avatar alt="First Follower" src="https://i.pravatar.cc/24?img=1" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/1'); }} />
                            <Avatar alt="Second Follower" src="https://i.pravatar.cc/24?img=2" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/2'); }} />
                            <Avatar alt="Third Follower" src="https://i.pravatar.cc/24?img=3" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/3'); }} />
                            <Avatar alt="Fourth Follower" src="https://i.pravatar.cc/24?img=4" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/4'); }} />
                            <Avatar alt="Fifth Follower" src="https://i.pravatar.cc/24?img=5" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/5'); }} />
                            <Avatar alt="Sixth Follower" src="https://i.pravatar.cc/24?img=6" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/6'); }} />
                            <Typography
                              variant="body1"
                              sx={{ ml: 1, fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
                              onClick={() => handleNameClick('Course name1', 'Participants Detail')}
                            >
                              and 5 more followers are studying this course.
                            </Typography>
                          </Box>
                        </Box>
                        <Box textAlign="right" mr={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AppRegistration />}
                            sx={{ textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, width: '100%' }}
                            onClick={() => handleRegistration('Course name1')} 
                          >
                            Send Request for Registration
                          </Button>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box display="flex" alignItems="center" flexDirection="row" spacing={2}>
                        <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                          <Typography variant="body1">Instructor name: instructor name</Typography>
                          <Typography variant="body2">Days in a week: Mon & Wed </Typography>
                          <Typography variant="body2">Time: 10:00 AM - 12:00 PM </Typography>
                          <Typography variant="body2">Location: classroom 131 </Typography>
                          <Typography variant="body2">Exam date: 28/11/2024, 10:00 AM </Typography>
                        </Box>
                        <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                          <Typography variant="body1">Student's name State</Typography>
                          <Typography variant="body2" color="green">Present: 8 sessions </Typography>
                          <Typography variant="body2" color="red">Absent: 2 sessions</Typography>
                          <Typography variant="body2" color="orange">Tardy: 1 session </Typography>
                          <Typography variant="body2" color="text.secondary"> NW: 5 sessions </Typography>
                        </Box>
                        <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                          <Typography variant="body1">Assignment Submission State of the student's name</Typography>
                          <Typography variant="body2" color="green">Assignment1: Submitted </Typography>
                          <Typography variant="body2" color="orange">Assignment2: Late Submitted</Typography>
                          <Typography variant="body2" color="red">Assignment3: Not Submitted </Typography>
                          <Typography variant="body2" color="text.secondary">Assignment4: NW </Typography>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Box>
              <Box className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
                <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
                  <Accordion sx={{ width: '100%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                        <CardMedia component="img" image="/path/to/Coursepic.jpg" alt="Coursepic" sx={{ width: 48, height: 48 }} />
                        <Box display="flex" alignItems="center" sx={{ flexGrow: 1, ml: 2 }}>
                          <Typography variant="h6" onClick={() => handleNameClick('Course name2', 'Course Detail')} sx={{ cursor: 'pointer', marginRight: '8px', '&:hover': { color: '#05440A' , fontWeight: 'bold'} }}>
                            Course name2
                          </Typography>
                          <Box ml={2} display="flex" alignItems="center" onClick={() => handleNameClick('Course name2', 'Participants Detail')} style={{ cursor: 'pointer' }}>
                            <Avatar alt="First Follower" src="https://i.pravatar.cc/24?img=1" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/1'); }} />
                            <Avatar alt="Second Follower" src="https://i.pravatar.cc/24?img=2" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/2'); }} />
                            <Avatar alt="Third Follower" src="https://i.pravatar.cc/24?img=3" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/3'); }} />
                            <Avatar alt="Fourth Follower" src="https://i.pravatar.cc/24?img=4" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/4'); }} />
                            <Avatar alt="Fifth Follower" src="https://i.pravatar.cc/24?img=5" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/5'); }} />
                            <Avatar alt="Sixth Follower" src="https://i.pravatar.cc/24?img=6" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/6'); }} />
                            <Typography
                              variant="body1"
                              sx={{ ml: 1, fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
                              onClick={() => handleNameClick('Course name2', 'Participants Detail')}
                            >
                              and 5 more followers are studying this course.
                            </Typography>
                          </Box>
                        </Box>
                        <Box textAlign="right" mr={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AppRegistration />} 
                            sx={{ textTransform: 'none', bgcolor: '#000000', '&:hover': { bgcolor: '#05440A' }, width: '100%' }}
                            onClick={() => handleRegistration('Course name2')} 
                          >
                            Undo Request for Registration
                          </Button>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box display="flex" alignItems="center" flexDirection="row" spacing={2}>
                        <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                          <Typography variant="body1">Instructor name: instructor name</Typography>
                          <Typography variant="body2">Days in a week: Mon & Wed </Typography>
                          <Typography variant="body2">Time: 10:00 AM - 12:00 PM </Typography>
                          <Typography variant="body2">Location: classroom 131 </Typography>
                          <Typography variant="body2">Exam date: 28/11/2024, 10:00 AM </Typography>
                        </Box>
                        <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                          <Typography variant="body1">Student name's State</Typography>
                          <Typography variant="body2" color="green">Present: 8 sessions </Typography>
                          <Typography variant="body2" color="red">Absent: 2 sessions</Typography>
                          <Typography variant="body2" color="orange">Tardy: 1 session </Typography>
                          <Typography variant="body2" color="text.secondary"> NW: 5 sessions </Typography>
                        </Box>
                        <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                          <Typography variant="body1">Assignment Submission State of the student's name</Typography>
                          <Typography variant="body2" color="green">Assignment1: Submitted </Typography>
                          <Typography variant="body2" color="orange">Assignment2: Late Submitted</Typography>
                          <Typography variant="body2" color="red">Assignment3: Not Submitted </Typography>
                          <Typography variant="body2" color="text.secondary">Assignment4: NW </Typography>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box mt={3}>
            <Box className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
              <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
                <Accordion sx={{ width: '100%' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                      <CardMedia component="img" image="/path/to/Coursepic.jpg" alt="Coursepic" sx={{ width: 48, height: 48 }} />
                      <Box display="flex" alignItems="center" sx={{ flexGrow: 1, ml: 2 }}>
                      <Typography variant="h6" onClick={() => handleNameClick('Course name2', 'Course Detail')} sx={{ cursor: 'pointer', marginRight: '8px', '&:hover': { color: '#05440A' , fontWeight: 'bold'} }}>
                          Course name1
                        </Typography>
                        <Box ml={2} display="flex" alignItems="center" onClick={() => handleNameClick('Course name1', 'Participants Detail')} style={{ cursor: 'pointer' }}>
                          <Avatar alt="First Follower" src="https://i.pravatar.cc/24?img=1" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/1'); }} />
                          <Avatar alt="Second Follower" src="https://i.pravatar.cc/24?img=2" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/2'); }} />
                          <Avatar alt="Third Follower" src="https://i.pravatar.cc/24?img=3" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/3'); }} />
                          <Avatar alt="Fourth Follower" src="https://i.pravatar.cc/24?img=4" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/4'); }} />
                          <Avatar alt="Fifth Follower" src="https://i.pravatar.cc/24?img=5" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/5'); }} />
                          <Avatar alt="Sixth Follower" src="https://i.pravatar.cc/24?img=6" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/6'); }} />
                          <Typography
                            variant="body1"
                            sx={{ ml: 1, fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
                            onClick={() => handleNameClick('Course name1', 'Participants Detail')}
                          >
                            and 5 more followers are studying this course.
                          </Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right" mr={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AppRegistration />}
                          sx={{ textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, width: '100%' }}
                          onClick={() => handleRegistration('Course name1')} 
                        >
                          Send Request for Registration
                        </Button>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" alignItems="center" flexDirection="row" spacing={2}>
                      <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Instructor name: instructor name</Typography>
                        <Typography variant="body2">Days in a week: Mon & Wed </Typography>
                        <Typography variant="body2">Time: 10:00 AM - 12:00 PM </Typography>
                        <Typography variant="body2">Location: classroom 131 </Typography>
                        <Typography variant="body2">Exam date: 28/11/2024, 10:00 AM </Typography>
                      </Box>
                      <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Student's name State</Typography>
                        <Typography variant="body2" color="green">Present: 8 sessions </Typography>
                        <Typography variant="body2" color="red">Absent: 2 sessions</Typography>
                        <Typography variant="body2" color="orange">Tardy: 1 session </Typography>
                        <Typography variant="body2" color="text.secondary"> NW: 5 sessions </Typography>
                      </Box>
                      <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Assignment Submission State of the student's name</Typography>
                        <Typography variant="body2" color="green">Assignment1: Submitted </Typography>
                        <Typography variant="body2" color="orange">Assignment2: Late Submitted</Typography>
                        <Typography variant="body2" color="red">Assignment3: Not Submitted </Typography>
                        <Typography variant="body2" color="text.secondary">Assignment4: NW </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
            <Box className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
              <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
                <Accordion sx={{ width: '100%' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                      <CardMedia component="img" image="/path/to/Coursepic.jpg" alt="Coursepic" sx={{ width: 48, height: 48 }} />
                      <Box display="flex" alignItems="center" sx={{ flexGrow: 1, ml: 2 }}>
                        <Typography variant="h6" onClick={() => handleNameClick('Course name2', 'Course Detail')} sx={{ cursor: 'pointer', marginRight: '8px', '&:hover': { color: '#05440A' , fontWeight: 'bold'} }}>
                          Course name2
                        </Typography>
                        <Box ml={2} display="flex" alignItems="center" onClick={() => handleNameClick('Course name2', 'Participants Detail')} style={{ cursor: 'pointer' }}>
                          <Avatar alt="First Follower" src="https://i.pravatar.cc/24?img=1" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/1'); }} />
                          <Avatar alt="Second Follower" src="https://i.pravatar.cc/24?img=2" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/2'); }} />
                          <Avatar alt="Third Follower" src="https://i.pravatar.cc/24?img=3" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/3'); }} />
                          <Avatar alt="Fourth Follower" src="https://i.pravatar.cc/24?img=4" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/4'); }} />
                          <Avatar alt="Fifth Follower" src="https://i.pravatar.cc/24?img=5" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/5'); }} />
                          <Avatar alt="Sixth Follower" src="https://i.pravatar.cc/24?img=6" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/6'); }} />
                          <Typography
                            variant="body1"
                            sx={{ ml: 1, fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
                            onClick={() => handleNameClick('Course name2', 'Participants Detail')}
                          >
                            and 5 more followers are studying this course.
                          </Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right" mr={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AppRegistration />} 
                          sx={{ textTransform: 'none', bgcolor: '#000000', '&:hover': { bgcolor: '#05440A' }, width: '100%' }}
                          onClick={() => handleRegistration('Course name2')} 
                        >
                          Undo Request for Registration
                        </Button>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" alignItems="center" flexDirection="row" spacing={2}>
                      <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Instructor name: instructor name</Typography>
                        <Typography variant="body2">Days in a week: Mon & Wed </Typography>
                        <Typography variant="body2">Time: 10:00 AM - 12:00 PM </Typography>
                        <Typography variant="body2">Location: classroom 131 </Typography>
                        <Typography variant="body2">Exam date: 28/11/2024, 10:00 AM </Typography>
                      </Box>
                      <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Student name's State</Typography>
                        <Typography variant="body2" color="green">Present: 8 sessions </Typography>
                        <Typography variant="body2" color="red">Absent: 2 sessions</Typography>
                        <Typography variant="body2" color="orange">Tardy: 1 session </Typography>
                        <Typography variant="body2" color="text.secondary"> NW: 5 sessions </Typography>
                      </Box>
                      <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Assignment Submission State of the student's name</Typography>
                        <Typography variant="body2" color="green">Assignment1: Submitted </Typography>
                        <Typography variant="body2" color="orange">Assignment2: Late Submitted</Typography>
                        <Typography variant="body2" color="red">Assignment3: Not Submitted </Typography>
                        <Typography variant="body2" color="text.secondary">Assignment4: NW </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
          </Box>
          )}
          {activeTab === 2 && (
            <Box mt={3}>
            <Box className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
              <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
                <Accordion sx={{ width: '100%' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                      <CardMedia component="img" image="/path/to/Coursepic.jpg" alt="Coursepic" sx={{ width: 48, height: 48 }} />
                      <Box display="flex" alignItems="center" sx={{ flexGrow: 1, ml: 2 }}>
                      <Typography variant="h6" onClick={() => handleNameClick('Course name2', 'Course Detail')} sx={{ cursor: 'pointer', marginRight: '8px', '&:hover': { color: '#05440A' , fontWeight: 'bold'} }}>
                          Course name1
                        </Typography>
                        <Box ml={2} display="flex" alignItems="center" onClick={() => handleNameClick('Course name1', 'Participants Detail')} style={{ cursor: 'pointer' }}>
                          <Avatar alt="First Follower" src="https://i.pravatar.cc/24?img=1" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/1'); }} />
                          <Avatar alt="Second Follower" src="https://i.pravatar.cc/24?img=2" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/2'); }} />
                          <Avatar alt="Third Follower" src="https://i.pravatar.cc/24?img=3" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/3'); }} />
                          <Avatar alt="Fourth Follower" src="https://i.pravatar.cc/24?img=4" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/4'); }} />
                          <Avatar alt="Fifth Follower" src="https://i.pravatar.cc/24?img=5" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/5'); }} />
                          <Avatar alt="Sixth Follower" src="https://i.pravatar.cc/24?img=6" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/6'); }} />
                          <Typography
                            variant="body1"
                            sx={{ ml: 1, fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
                            onClick={() => handleNameClick('Course name1', 'Participants Detail')}
                          >
                            and 5 more followers are studying this course.
                          </Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right" mr={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AppRegistration />}
                          sx={{ textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, width: '100%' }}
                          onClick={() => handleRegistration('Course name1')} 
                        >
                          Send Request for Registration
                        </Button>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" alignItems="center" flexDirection="row" spacing={2}>
                      <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Instructor name: instructor name</Typography>
                        <Typography variant="body2">Days in a week: Mon & Wed </Typography>
                        <Typography variant="body2">Time: 10:00 AM - 12:00 PM </Typography>
                        <Typography variant="body2">Location: classroom 131 </Typography>
                        <Typography variant="body2">Exam date: 28/11/2024, 10:00 AM </Typography>
                      </Box>
                      <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Student's name State</Typography>
                        <Typography variant="body2" color="green">Present: 8 sessions </Typography>
                        <Typography variant="body2" color="red">Absent: 2 sessions</Typography>
                        <Typography variant="body2" color="orange">Tardy: 1 session </Typography>
                        <Typography variant="body2" color="text.secondary"> NW: 5 sessions </Typography>
                      </Box>
                      <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Assignment Submission State of the student's name</Typography>
                        <Typography variant="body2" color="green">Assignment1: Submitted </Typography>
                        <Typography variant="body2" color="orange">Assignment2: Late Submitted</Typography>
                        <Typography variant="body2" color="red">Assignment3: Not Submitted </Typography>
                        <Typography variant="body2" color="text.secondary">Assignment4: NW </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
            <Box className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
              <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
                <Accordion sx={{ width: '100%' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                      <CardMedia component="img" image="/path/to/Coursepic.jpg" alt="Coursepic" sx={{ width: 48, height: 48 }} />
                      <Box display="flex" alignItems="center" sx={{ flexGrow: 1, ml: 2 }}>
                        <Typography variant="h6" onClick={() => handleNameClick('Course name2', 'Course Detail')} sx={{ cursor: 'pointer', marginRight: '8px', '&:hover': { color: '#05440A' , fontWeight: 'bold'} }}>
                          Course name2
                        </Typography>
                        <Box ml={2} display="flex" alignItems="center" onClick={() => handleNameClick('Course name2', 'Participants Detail')} style={{ cursor: 'pointer' }}>
                          <Avatar alt="First Follower" src="https://i.pravatar.cc/24?img=1" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/1'); }} />
                          <Avatar alt="Second Follower" src="https://i.pravatar.cc/24?img=2" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/2'); }} />
                          <Avatar alt="Third Follower" src="https://i.pravatar.cc/24?img=3" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/3'); }} />
                          <Avatar alt="Fourth Follower" src="https://i.pravatar.cc/24?img=4" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/4'); }} />
                          <Avatar alt="Fifth Follower" src="https://i.pravatar.cc/24?img=5" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/5'); }} />
                          <Avatar alt="Sixth Follower" src="https://i.pravatar.cc/24?img=6" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/6'); }} />
                          <Typography
                            variant="body1"
                            sx={{ ml: 1, fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
                            onClick={() => handleNameClick('Course name2', 'Participants Detail')}
                          >
                            and 5 more followers are studying this course.
                          </Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right" mr={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AppRegistration />} 
                          sx={{ textTransform: 'none', bgcolor: '#000000', '&:hover': { bgcolor: '#05440A' }, width: '100%' }}
                          onClick={() => handleRegistration('Course name2')} 
                        >
                          Undo Request for Registration
                        </Button>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" alignItems="center" flexDirection="row" spacing={2}>
                      <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Instructor name: instructor name</Typography>
                        <Typography variant="body2">Days in a week: Mon & Wed </Typography>
                        <Typography variant="body2">Time: 10:00 AM - 12:00 PM </Typography>
                        <Typography variant="body2">Location: classroom 131 </Typography>
                        <Typography variant="body2">Exam date: 28/11/2024, 10:00 AM </Typography>
                      </Box>
                      <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Student name's State</Typography>
                        <Typography variant="body2" color="green">Present: 8 sessions </Typography>
                        <Typography variant="body2" color="red">Absent: 2 sessions</Typography>
                        <Typography variant="body2" color="orange">Tardy: 1 session </Typography>
                        <Typography variant="body2" color="text.secondary"> NW: 5 sessions </Typography>
                      </Box>
                      <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                        <Typography variant="body1">Assignment Submission State of the student's name</Typography>
                        <Typography variant="body2" color="green">Assignment1: Submitted </Typography>
                        <Typography variant="body2" color="orange">Assignment2: Late Submitted</Typography>
                        <Typography variant="body2" color="red">Assignment3: Not Submitted </Typography>
                        <Typography variant="body2" color="text.secondary">Assignment4: NW </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
          </Box>
          )}
           {activeTab === 3 && (
              <Box mt={3}>
              <Box className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
                <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
                  <Accordion sx={{ width: '100%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                        <CardMedia component="img" image="/path/to/Coursepic.jpg" alt="Coursepic" sx={{ width: 48, height: 48 }} />
                        <Box display="flex" alignItems="center" sx={{ flexGrow: 1, ml: 2 }}>
                        <Typography variant="h6" onClick={() => handleNameClick('Course name2', 'Course Detail')} sx={{ cursor: 'pointer', marginRight: '8px', '&:hover': { color: '#05440A' , fontWeight: 'bold'} }}>
                            Course name1
                          </Typography>
                          <Box ml={2} display="flex" alignItems="center" onClick={() => handleNameClick('Course name1', 'Participants Detail')} style={{ cursor: 'pointer' }}>
                            <Avatar alt="First Follower" src="https://i.pravatar.cc/24?img=1" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/1'); }} />
                            <Avatar alt="Second Follower" src="https://i.pravatar.cc/24?img=2" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/2'); }} />
                            <Avatar alt="Third Follower" src="https://i.pravatar.cc/24?img=3" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/3'); }} />
                            <Avatar alt="Fourth Follower" src="https://i.pravatar.cc/24?img=4" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/4'); }} />
                            <Avatar alt="Fifth Follower" src="https://i.pravatar.cc/24?img=5" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/5'); }} />
                            <Avatar alt="Sixth Follower" src="https://i.pravatar.cc/24?img=6" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/6'); }} />
                            <Typography
                              variant="body1"
                              sx={{ ml: 1, fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
                              onClick={() => handleNameClick('Course name1', 'Participants Detail')}
                            >
                              and 5 more followers are studying this course.
                            </Typography>
                          </Box>
                        </Box>
                        <Box textAlign="right" mr={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AppRegistration />}
                            sx={{ textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, width: '100%' }}
                            onClick={() => handleRegistration('Course name1')} 
                          >
                            Send Request for Registration
                          </Button>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box display="flex" alignItems="center" flexDirection="row" spacing={2}>
                        <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                          <Typography variant="body1">Instructor name: instructor name</Typography>
                          <Typography variant="body2">Days in a week: Mon & Wed </Typography>
                          <Typography variant="body2">Time: 10:00 AM - 12:00 PM </Typography>
                          <Typography variant="body2">Location: classroom 131 </Typography>
                          <Typography variant="body2">Exam date: 28/11/2024, 10:00 AM </Typography>
                        </Box>
                        <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                          <Typography variant="body1">Student's name State</Typography>
                          <Typography variant="body2" color="green">Present: 8 sessions </Typography>
                          <Typography variant="body2" color="red">Absent: 2 sessions</Typography>
                          <Typography variant="body2" color="orange">Tardy: 1 session </Typography>
                          <Typography variant="body2" color="text.secondary"> NW: 5 sessions </Typography>
                        </Box>
                        <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                          <Typography variant="body1">Assignment Submission State of the student's name</Typography>
                          <Typography variant="body2" color="green">Assignment1: Submitted </Typography>
                          <Typography variant="body2" color="orange">Assignment2: Late Submitted</Typography>
                          <Typography variant="body2" color="red">Assignment3: Not Submitted </Typography>
                          <Typography variant="body2" color="text.secondary">Assignment4: NW </Typography>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Box>
              <Box className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
                <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
                  <Accordion sx={{ width: '100%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                        <CardMedia component="img" image="/path/to/Coursepic.jpg" alt="Coursepic" sx={{ width: 48, height: 48 }} />
                        <Box display="flex" alignItems="center" sx={{ flexGrow: 1, ml: 2 }}>
                          <Typography variant="h6" onClick={() => handleNameClick('Course name2', 'Course Detail')} sx={{ cursor: 'pointer', marginRight: '8px', '&:hover': { color: '#05440A' , fontWeight: 'bold'} }}>
                            Course name2
                          </Typography>
                          <Box ml={2} display="flex" alignItems="center" onClick={() => handleNameClick('Course name2', 'Participants Detail')} style={{ cursor: 'pointer' }}>
                            <Avatar alt="First Follower" src="https://i.pravatar.cc/24?img=1" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/1'); }} />
                            <Avatar alt="Second Follower" src="https://i.pravatar.cc/24?img=2" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/2'); }} />
                            <Avatar alt="Third Follower" src="https://i.pravatar.cc/24?img=3" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/3'); }} />
                            <Avatar alt="Fourth Follower" src="https://i.pravatar.cc/24?img=4" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/4'); }} />
                            <Avatar alt="Fifth Follower" src="https://i.pravatar.cc/24?img=5" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/5'); }} />
                            <Avatar alt="Sixth Follower" src="https://i.pravatar.cc/24?img=6" sx={{ width: 24, height: 24, mr: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/StudentDashboard/6'); }} />
                            <Typography
                              variant="body1"
                              sx={{ ml: 1, fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
                              onClick={() => handleNameClick('Course name2', 'Participants Detail')}
                            >
                              and 5 more followers are studying this course.
                            </Typography>
                          </Box>
                        </Box>
                        <Box textAlign="right" mr={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AppRegistration />} 
                            sx={{ textTransform: 'none', bgcolor: '#000000', '&:hover': { bgcolor: '#05440A' }, width: '100%' }}
                            onClick={() => handleRegistration('Course name2')} 
                          >
                            Undo Request for Registration
                          </Button>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box display="flex" alignItems="center" flexDirection="row" spacing={2}>
                        <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                          <Typography variant="body1">Instructor name: instructor name</Typography>
                          <Typography variant="body2">Days in a week: Mon & Wed </Typography>
                          <Typography variant="body2">Time: 10:00 AM - 12:00 PM </Typography>
                          <Typography variant="body2">Location: classroom 131 </Typography>
                          <Typography variant="body2">Exam date: 28/11/2024, 10:00 AM </Typography>
                        </Box>
                        <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                          <Typography variant="body1">Student name's State</Typography>
                          <Typography variant="body2" color="green">Present: 8 sessions </Typography>
                          <Typography variant="body2" color="red">Absent: 2 sessions</Typography>
                          <Typography variant="body2" color="orange">Tardy: 1 session </Typography>
                          <Typography variant="body2" color="text.secondary"> NW: 5 sessions </Typography>
                        </Box>
                        <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                          <Typography variant="body1">Assignment Submission State of the student's name</Typography>
                          <Typography variant="body2" color="green">Assignment1: Submitted </Typography>
                          <Typography variant="body2" color="orange">Assignment2: Late Submitted</Typography>
                          <Typography variant="body2" color="red">Assignment3: Not Submitted </Typography>
                          <Typography variant="body2" color="text.secondary">Assignment4: NW </Typography>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Box>
            </Box>
            )}
        </Box>
      </Container>
    </div>
  );
};

export default StudentDashboard;
