import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from './useFetch';
import config from '../config';

const useCourseDetails = (courseID) => {
  const navigate = useNavigate();
  const [coverImageName, setCoverImageName] = useState('');
  const [courseDetails, setCourseDetails] = useState({});
  const [newMaterials, setNewMaterials] = useState([]); // Ensure newMaterials is an array

  const { data, loading, error, refetch } = useFetch(`${config.API}/getCourseContent/${courseID}`, [], { manual: false });

  useEffect(() => {
    if (data) {
      setCourseDetails(data);
      if (data.coverImage) {
        const cleanedCoverImageName = data.coverImage.split('/').pop().replace(/^[\d]+_/g, '');
        setCoverImageName(cleanedCoverImageName);
      }
    }
  }, [data]);

  const handleEditClick = useCallback(() => {
    navigate('/courses-instructor/CourseEditPage', { state: { courseName: courseID } });
  }, [navigate, courseID]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setNewMaterials(files);
    }
  };

  const handleUpload = async () => {
    if (newMaterials.length === 0) {
      alert('No files to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('courseName', courseID);
    newMaterials.forEach((file) => formData.append('courseMaterials', file));

    try {
      const response = await fetch(`${config.API}/uploadCourseMaterial/uploadCourseMaterials`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const updatedData = await response.json();
          setCourseDetails(updatedData);
          setNewMaterials([]);
          alert('Files uploaded successfully!');
          refetch(); // Ensure you have a function or logic to refetch or update the data.
        } else {
          console.error('Unexpected response format:', await response.text());
          alert('Files uploaded, but received unexpected response format.');
        }
      } else {
        const errorText = await response.text();
        console.error('Error uploading files:', errorText);
        alert(`Error uploading files: ${errorText}`);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('An error occurred while uploading the files.');
    }
  };


  const handleDownload = useCallback((material, index) => {
    const link = document.createElement('a');
    link.href = `${config.API}${material}`;
    link.download = `course-material-${index + 1}${material.substring(material.lastIndexOf('.'))}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleDelete = async (material, index) => {
    if (window.confirm(`Are you sure you want to delete ${material}?`)) {
      try {
        const response = await fetch(`${config.API}/deleteCourseMaterial/removeFile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: courseDetails.courseName,
            filePath: material,
          }),
        });

        if (response.ok) {
          alert('File deleted successfully!');
          const updatedMaterials = courseDetails.sessionMaterials.filter((_, i) => i !== index);
          setCourseDetails((prevDetails) => ({ ...prevDetails, sessionMaterials: updatedMaterials }));
          refetch();
        } else {
          console.error('Error deleting file:', await response.text());
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  return {
    courseDetails,
    loading,
    coverImageName,
    handleEditClick,
    handleFileChange,
    handleUpload,
    handleDownload,
    handleDelete,
    newMaterials, // Add this to return object to ensure it is passed properly
  };
};

export default useCourseDetails;
