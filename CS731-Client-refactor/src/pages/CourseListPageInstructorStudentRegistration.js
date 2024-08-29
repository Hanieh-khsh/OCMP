import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Container, Button, Checkbox, List, ListItem, ListItemText, ListItemAvatar, Avatar, Card, CardContent, CardMedia
} from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';
import FullScreenLoader from '../components/shared/loader'; // Import the loading animation component
import '../css/CourseListPageInstructor.css';
import '../css/CourseListPageinstructorStudentregistration.css';
import config from '../config';  // Import the config
import useLocalStorage from '../hooks/useLocalStorage';  // Import the useLocalStorage hook


/* 
Component for instructors to manage student registration for courses.
Includes features for viewing and selecting students to register for courses.
*/
const CourseListPageInstructorStudentRegistration = () => {
  // State variables
  const [activeTab, setActiveTab] = useState(2); // Tracks the active tab index
  const [selectedStudents, setSelectedStudents] = useState({}); // Stores selected students per course
  const [studentsData, setStudentsData] = useState([]); // Stores the list of students
  const [courses, setCourses] = useState([]); // Stores the list of courses
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [storedStudentID, setStoredStudentID] = useLocalStorage('studentID', null); // Using the custom hook

  useEffect(() => {
    // Fetch data on component mount
    const fetchData = async () => {
      setLoading(true); // Show loader
      try {
        // Fetch all students
        const studentResponse = await fetch(`${config.API}/getAllStudents/getAllStudents`);
        if (!studentResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const studentData = await studentResponse.json();
        const formattedStudents = studentData.map(student => ({
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          major: 'Undeclared',
          semester: '1st Sem',
          level: student.position === 'Student' ? 'Undergrad' : 'Grad',
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` // Placeholder avatar
        }));
        setStudentsData(formattedStudents);

        // Fetch courses for the instructor and filter students who are already registered
        await fetchInstructorCourses(formattedStudents);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchData();
  }, [storedStudentID]); // Depend on storedStudentID

  // Fetch courses and filter out registered students
  const fetchInstructorCourses = async (allStudents) => {
    if (!storedStudentID) return;

    try {
      const response = await fetch(`${config.API}/getCourseListInstructor/${storedStudentID}/courses`);
      if (response.ok) {
        const coursesData = await response.json();

        // Fetch registered students for each course
        const updatedCourses = await Promise.all(coursesData.map(async course => {
          const registeredStudentsResponse = await fetch(`${config.API}/getRegisteredStudents/getRegisteredStudents/${course.courseName}`);

          if (!registeredStudentsResponse.ok) {
            console.error(`Failed to fetch registered students for ${course.courseName}`);
            return { ...course, eligibleStudents: allStudents }; // Return all students if fetch fails
          }

          let registeredStudentsData;
          try {
            registeredStudentsData = await registeredStudentsResponse.json();
          } catch (err) {
            console.error('Error parsing registered students response:', err);
            return { ...course, eligibleStudents: allStudents }; // Return all students if parsing fails
          }

          if (!registeredStudentsData.success || !Array.isArray(registeredStudentsData.registeredStudents)) {
            console.error('Expected an array for registered students:', registeredStudentsData);
            return { ...course, eligibleStudents: allStudents }; // Return all students if response structure is unexpected
          }

          const registeredStudentIds = new Set(registeredStudentsData.registeredStudents.map(student => student.studentID));

          // Filter out registered students from studentsData
          const eligibleStudents = allStudents.filter(student => !registeredStudentIds.has(student.id));

          return { ...course, eligibleStudents };
        }));

        setCourses(updatedCourses);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Handle student selection
  const handleStudentSelect = (courseName, student) => {
    setSelectedStudents(prevSelected => {
      const isSelected = prevSelected[courseName]?.includes(student.id);
      return {
        ...prevSelected,
        [courseName]: isSelected
          ? prevSelected[courseName].filter(id => id !== student.id)
          : [...(prevSelected[courseName] || []), student.id],
      };
    });
  };

  // Handle accepting all eligible students for a course
  const handleAcceptAll = (courseTitle) => {
    const course = courses.find(c => c.courseName === courseTitle);
    if (!course) return;

    const allStudentIds = course.eligibleStudents.map(student => student.id);
    setSelectedStudents(prevSelected => ({
      ...prevSelected,
      [courseTitle]: [...new Set([...(prevSelected[courseTitle] || []), ...allStudentIds])],
    }));
  };

  // Handle accepting selected students for a course
  const handleAcceptSelected = (courseTitle) => {
    const selectedStudentIds = selectedStudents[courseTitle];
    if (selectedStudentIds) {
      setLoading(true); // Show loader
      fetch(`${config.API}/registerStudents/registerUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: courseTitle,
          studentIDs: selectedStudentIds,
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            alert('Students added successfully!');
            window.location.reload(); // Refresh the page
          } else {
            throw new Error(data.message || 'Unexpected response structure');
          }
        })
        .catch(error => {
          console.error('Error registering students:', error);
        })
        .finally(() => {
          setLoading(false); // Hide loader
        });
    }
  };

  // Check if any student is selected for a given course
  const isAnyStudentSelected = courseName => {
    return selectedStudents[courseName] && selectedStudents[courseName].length > 0;
  };

  return (
    <div className="course-list-page-instructor">
      {loading && <FullScreenLoader />} {/* Display the loader if loading */}
      <Container>
        <Box mt={3}>
          {activeTab === 2 && (
            <>
              <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                {courses.map((course, index) => (
                  <Card key={index} className="course-card" sx={{ maxWidth: 345 }}>
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
                      <Box textAlign="right">
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, textTransform: 'none' }}
                          onClick={() => handleAcceptAll(course.courseName)}
                        >
                          Accept All {course.eligibleStudents.length}
                        </Button>
                      </Box>
                      <List>
                        {course.eligibleStudents.length > 0 ? (
                          course.eligibleStudents.map((student, studentIndex) => (
                            <ListItem key={studentIndex}>
                              <ListItemAvatar>
                                <Avatar src={student.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`} />
                              </ListItemAvatar>
                              <ListItemText
                                primary={`${student.name}, ${student.major}, ${student.semester}, ${student.level}`}
                              />
                              <Checkbox
                                icon={<CheckBoxOutlineBlank />}
                                checkedIcon={<CheckBox />}
                                checked={(selectedStudents[course.courseName] || []).includes(student.id)}
                                onChange={() => handleStudentSelect(course.courseName, student)}
                              />
                            </ListItem>
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No students available.
                          </Typography>
                        )}
                      </List>
                      <Box textAlign="center">
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, textTransform: 'none' }}
                          onClick={() => handleAcceptSelected(course.courseName)}
                          disabled={!isAnyStudentSelected(course.courseName)}
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
