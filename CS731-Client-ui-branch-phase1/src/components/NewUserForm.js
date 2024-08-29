import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import './NewUserForm.css';

const NewUserForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    id: '',
    phoneNumber: '',
    email: '',
    password: '' ,
    Position:'',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://204.83.75.184:8080/addUser/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formValues)
      });

      if (response.ok) {
        setShowModal(true);
      } else {
        console.error('Error creating user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container mt={1} maxWidth="sm">
      <Box mt={0}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID Number"
                name="id"
                value={formValues.id}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth required>
                <InputLabel id="position-label">Position</InputLabel>
                <Select
                  labelId="position-label"
                  id="position-select"
                  value={formValues.position}
                  onChange={handleChange}
                  label="Position"
                  name="position"
                >
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Instructor">Instructor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
           
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleChange}
                variant="outlined"
                required
              />
                <Box textAlign="left">
          <FormControlLabel
            control={<Checkbox name="saveInfo" color="primary" />}
            label="Save my information"
          />
        </Box>
            </Grid>
          
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2, bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, textTransform: 'none' }}>
                Create my User name & Password
              </Button>
            </Grid>
           
          </Grid>
        </form>
      </Box>
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Typography>Your username and password have been created successfully.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NewUserForm;
