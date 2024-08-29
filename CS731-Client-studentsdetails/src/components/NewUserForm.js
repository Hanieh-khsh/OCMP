import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import FullScreenLoader from './loader'; // Import loading animation component
import useForm from '../hooks/useForm'; // Import custom hook
import FormFields from './NewUserFormFields'; // Import form fields component
import '../css/NewUserForm.css';
import config from '../config'; // Import the config

/* 
Component for registering new users (students or instructors).
Includes a form with fields for personal details and validates input.
*/
const NewUserForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [formValues, handleChange, errors, setFormErrors] = useForm({
    firstName: '',
    lastName: '',
    id: '',
    phoneNumber: '',
    email: '',
    password: '',
    position: '',
  }); // State for form input values

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^(\+?1\s?)?(\(?\d{3}\)?|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;

    if (!phoneRegex.test(formValues.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number.';
    }

    if (!/^[0-9]+$/.test(formValues.id)) {
      newErrors.id = 'ID must be numeric and contain at least one digit.';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) {
      return; // Exit if form is not valid
    }

    setLoading(true); // Show loader

    try {
      const response = await fetch(`${config.API}/addUser/addUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        alert('User created successfully!');
        window.location.reload(); // Refresh the page
      } else {
        console.error('Error creating user');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />} {/* Display loader during loading */}
      <Container mt={1} maxWidth="sm">
        <Box mt={0}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <FormFields
                formValues={formValues}
                handleChange={handleChange}
                errors={errors}
              /> {/* Render form fields */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 2,
                    bgcolor: '#537756',
                    '&:hover': { bgcolor: '#05440A' },
                    textTransform: 'none',
                  }}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default NewUserForm;
