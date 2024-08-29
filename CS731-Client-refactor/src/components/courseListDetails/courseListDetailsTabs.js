import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const CourseTabs = ({ activeTab, handleChange }) => (
  <Tabs
    value={activeTab}
    textColor="#000000"
    onChange={handleChange}
    TabIndicatorProps={{ style: { backgroundColor: '#05440A' } }}
    sx={{ '& .Mui-selected': { fontSize: '18px' } }}
    centered
  >
    <Tab label="Course Detail" sx={{ fontSize: '16px', textTransform: 'none' }} />
    <Tab label="Participants' Detail" sx={{ fontSize: '16px', textTransform: 'none' }} />
  </Tabs>
);

export default CourseTabs;
