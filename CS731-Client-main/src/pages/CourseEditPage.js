import React, { useEffect, useState } from 'react';
import { Container, Box, Button } from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import useForm from '../hooks/useForm'; // Custom hook for form handling
import useFetch from '../hooks/useFetch'; // Custom hook for fetching data
import CourseFormFields from '../components/courseEditPage/courseEditFormFields'; // Form fields component
import '../css/CourseListPageInstructor.css';
import config from '../config'; // Configuration for API endpoints

const EditCoursePage = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const courseName = location.state?.courseName || '';

  const [coverImageName, setCoverImageName] = useState('');

  const [formValues, handleChange, errors, setFormValues] = useForm({
    courseName,
    coverImage: null,
    coverImagePath: '',
    firstSessionTitle: '',
    day: '',
    time: '',
    classroom: '',
    assignmentDueTime: '',
    examTime: '',
    examLocation: '',
    description: '',
  });

  const { data: courseData, loading } = useFetch(`${config.API}/getCourseContent/${courseName}`);
  const navigate = useNavigate();

  useEffect(() => {
    if (courseData) {
      const { coverImage, ...details } = courseData;
      setFormValues((prevValues) => ({
        ...prevValues,
        ...details,
        coverImagePath: coverImage || '',
      }));

      if (coverImage) {
        const cleanedCoverImageName = coverImage.split('/').pop().replace(/^[\d]+_/g, '');
        setCoverImageName(cleanedCoverImageName);
      }
    }
  }, [courseData, setFormValues]);

  useEffect(() => {
    const storedStudentID = localStorage.getItem('studentID');
    if (storedStudentID) {
      handleChange({ target: { name: 'studentID', value: storedStudentID } });
    }
  }, [handleChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('courseID', courseName);
    formData.append('courseName', formValues.courseName);

    if (formValues.coverImage) {
      formData.append('coverImage', formValues.coverImage);
    } else {
      formData.append('coverImagePath', formValues.coverImagePath);
    }

    Object.keys(formValues).forEach((key) => {
      if (key !== 'coverImage' && key !== 'coverImagePath') {
        formData.append(key, formValues[key]);
      }
    });

    try {
      const response = await fetch(`${config.API}/editCourse/editCourse`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Course updated successfully!');
        navigate('/courses-instructor');
      } else {
        console.error('Error updating course:', await response.text());
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <div className="course-list-page-instructor">
      <Container>
        <Box mt={3}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2} className="course-creation-form">
                <CourseFormFields
                  formValues={formValues}
                  handleChange={handleChange}
                  coverImageName={coverImageName}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, width: '50%', display: 'block', mx: 'auto' }}
                >
                  Update Course
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default EditCoursePage;
