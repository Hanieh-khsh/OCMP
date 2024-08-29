import React, { useState } from 'react';
import { Typography, Box, Container, Button, Link, Checkbox, List, ListItem, ListItemText, ListItemAvatar, Avatar, Card, CardContent, CardMedia } from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';
import './CourseListPageInstructor.css';
import './CourseListPageInstructorStudentRegistration.css';

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

const CourseListPageInstructorStudentRegistration = () => {
  const [activeTab, setActiveTab] = useState(2);
  const [selectedStudents, setSelectedStudents] = useState({});

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleStudentSelect = (courseTitle, student) => {
    const studentId = `${courseTitle}-${student.name}`;
    setSelectedStudents((prevSelected) => ({
      ...prevSelected,
      [courseTitle]: prevSelected[courseTitle]
        ? prevSelected[courseTitle].includes(studentId)
          ? prevSelected[courseTitle].filter((id) => id !== studentId)
          : [...prevSelected[courseTitle], studentId]
        : [studentId],
    }));
  };

  const handleAcceptAll = (courseTitle) => {
    const allStudentIds = coursesData
      .find((course) => course.title === courseTitle)
      .students.map((student) => `${courseTitle}-${student.name}`);
    setSelectedStudents((prevSelected) => ({
      ...prevSelected,
      [courseTitle]: [...new Set([...(prevSelected[courseTitle] || []), ...allStudentIds])],
    }));
  };

  const handleAcceptSelected = (courseTitle) => {
    console.log(`Accepted Students for ${courseTitle}:`, selectedStudents[courseTitle]);
  };

  return (
    <div className="course-list-page-instructor">
      <Container>
        <Box mb={2} textAlign="left">
          <Link href="#" underline="hover" color="inherit" sx={{ ml: 2 }} className="blink">
            Accept all 17 students who are waiting to learn from you!
          </Link>
        </Box>
        <Box mt={3}>
          {activeTab === 2 && (
            <>
              <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                {coursesData.map((course, index) => (
                  <Card key={index} className="course-card" sx={{ maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={course.image}
                      alt={course.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {course.title}
                      </Typography>
                      <Box textAlign="right">
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, textTransform: 'none' }}
                          onClick={() => handleAcceptAll(course.title)}
                        >
                          Accept All {course.students.length}
                        </Button>
                      </Box>
                      <List>
                        {course.students.map((student, studentIndex) => (
                          <ListItem key={studentIndex}>
                            <ListItemAvatar>
                              <Avatar src={student.avatar} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${student.name}, ${student.major}, ${student.semester}, ${student.level}`}
                            />
                            <Checkbox
                              icon={<CheckBoxOutlineBlank />}
                              checkedIcon={<CheckBox />}
                              checked={(selectedStudents[course.title] || []).includes(`${course.title}-${student.name}`)}
                              onChange={() => handleStudentSelect(course.title, student)}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Box textAlign="center">
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, textTransform: 'none' }}
                          onClick={() => handleAcceptSelected(course.title)}
                          disabled={!selectedStudents[course.title] || selectedStudents[course.title].length === 0}
                        >
                          Accept Selected Students
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default CourseListPageInstructorStudentRegistration;
