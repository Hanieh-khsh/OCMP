import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const FormFields = ({ formValues, handleChange, errors }) => (
  <>
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
        error={!!errors.id}
        helperText={errors.id}
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
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber}
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
    </Grid>
  </>
);

export default FormFields;
