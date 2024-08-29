import { useState } from 'react';
import { Typography, Box, Container, Tabs, Tab, Card, CardContent, CardMedia, IconButton, Link, Breadcrumbs } from '@mui/material';
import { AccessTime, CalendarToday, LocationOn, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './CourseListPageInstructor.css';
import CourseListPageInstructorCourseCreation from './CourseListPageInstructorCourseCreation';
import CourseListPageInstructorStudentRegistration from './CourseListPageInstructorStudentRegistration';

const studentsData = [
  {
    name: 'Beatrice Shelby',
    major: 'Kinesiology',
    semester: '1st Sem',
    level: 'Grad',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Sarah Timberland',
    major: 'Physical Activity',
    semester: '1st Sem',
    level: 'Undergrad',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
];

const coursesData = [
  {
    title: 'Pathology and Corrective Movements',
    students: studentsData.slice(0, 9),
    image: '/img/Pathology and Corrective Movements.jpg'
  },
  {
    title: 'Human Ergonomics Principles & Anatomies',
    students: studentsData.slice(0, 8),
    image: '/img/human-ergonomics.jpg'
  },
];

const CourseListPageInstructor = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCardClick = (courseTitle) => {
    navigate(`/course-instructor-course-details/${courseTitle}`);
  };

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

  return (
    <div className="course-list-page-instructor">
      <Container>
        <Box bgcolor="#FFFFFF" mt={3} mb={2} display="flex" alignItems="center" justifyContent="space-between" textAlign="left">
          <Box display="flex" alignItems="center" borderLeft={'5px solid #05440A'} paddingLeft={1} borderRadius={1}>
            <img src="/img/Fallsemester.jpg" alt="Fallsemester in University of Regina" className="logo" width={80} />
            <Box ml={2}>
              <Typography variant="h4">Good Afternoon Sir Smith!</Typography>
              <Typography variant="subtitle1">Fall Semester 2024</Typography>
            </Box>
          </Box>
        </Box>

        <Box mb={2} textAlign="left">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="#" onClick={() => navigate('/courses-instrustor')}>
              Instructor's Portal
            </Link>
            <Link underline="hover" color="inherit" href="#" onClick={() => navigate('/courses-instrustor')}>
              Course List
            </Link>
            <Typography color="textPrimary">{getBreadcrumbLabel()}</Typography>
          </Breadcrumbs>
        </Box>
        <Tabs value={activeTab} textColor="#000000" onChange={handleChange} TabIndicatorProps={{ style: { backgroundColor: '#05440A' } }} sx={{ '& .Mui-selected': { fontSize: '18px' } }} centered>
          <Tab label="Courses" sx={{ fontSize: '16px', textTransform: 'none' }} />
          <Tab label="Course Creation" sx={{ fontSize: '16px', textTransform: 'none' }} />
          <Tab label="Student Registration" sx={{ fontSize: '16px', textTransform: 'none' }} />
        </Tabs>
        <Box mt={3}>
          {activeTab === 0 && (
            <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
              {coursesData.map((course, index) => (
                <Card key={index} className="course-card" sx={{ maxWidth: 345 }} onClick={() => handleCardClick(course.title)} style={{ cursor: 'pointer' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography gutterBottom variant="h5" component="div">
                        {course.title}
                      </Typography>
                      <Box>
                        <IconButton aria-label="edit" sx={{ color: 'inherit', '&:hover': { color: 'green' } }}>
                          <Edit />
                        </IconButton>
                      </Box>
                    </Box>
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
              ))}
            </Box>
          )}
          {activeTab === 1 && <CourseListPageInstructorCourseCreation />}
          {activeTab === 2 && <CourseListPageInstructorStudentRegistration />}
        </Box>
      </Container>
    </div>
  );
};

export default CourseListPageInstructor;
