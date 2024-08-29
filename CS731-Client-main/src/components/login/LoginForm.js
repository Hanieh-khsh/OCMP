import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControlLabel, Container, Box } from '@mui/material';
import FullScreenLoader from '../shared/loader';
import useLocalStorage from '../../hooks/useLocalStorage';
import '../../css/LoginForm.css';
import config from '../../config';

const LoginForm = ({ userType }) => {
  const [studentID, setStudentID] = useLocalStorage('studentID', '');
  const [password, setPassword] = useLocalStorage('password', '');
  const [rememberMe, setRememberMe] = useLocalStorage('rememberMe', false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!studentID || !password) {
      alert('Please enter both Student ID and Password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.API}/loginUser/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentID, password }),
      });

      const responseText = await response.text(); // Capture the response text for debugging

      if (response.ok) {
        try {
          const data = JSON.parse(responseText); // Parse the response as JSON

          localStorage.setItem('studentID', JSON.stringify(data.studentID));
          localStorage.setItem('position', JSON.stringify(data.position));

          if (rememberMe) {
            localStorage.setItem('studentID', JSON.stringify(studentID));
            localStorage.setItem('password', JSON.stringify(password));
          } else {
            localStorage.removeItem('password');
          }

          navigate(data.position === 'Student' ? '/StudentDashboard' : '/courses-instructor');
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          console.error('Response text:', responseText); // Log the response text for debugging
          alert('An error occurred while processing your request. Please try again later.');
        }
      } else {
        console.error('Response text:', responseText); // Log the response text for debugging
        alert(`Login failed: ${responseText}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('An error occurred during login. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <Container maxWidth="xs" className="login-container">
        <Box mt={3} px={3}>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              margin="normal"
              label="ID Number"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              required
            />
            <Box textAlign="left">
              <FormControlLabel
                control={
                  <Checkbox
                    name="saveInfo"
                    color="primary"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Save my information"
              />
            </Box>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2, bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}
            >
              LOG IN
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default LoginForm;
