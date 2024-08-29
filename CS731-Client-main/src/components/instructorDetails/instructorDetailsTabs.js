import React from 'react';
import { Tabs, Tab } from '@mui/material';

const TabsNavigation = ({ activeTab, handleTabChange }) => (
  <Tabs
    value={activeTab}
    onChange={handleTabChange}
    indicatorColor="primary"
    textColor="primary"
    centered
    sx={{ '& .Mui-selected': { fontSize: '18px' } }}
  >
    <Tab label="Course Detail" sx={{ fontSize: '16px', textTransform: 'none' }} />
    <Tab label="Participants' Detail" sx={{ fontSize: '16px', textTransform: 'none' }} />
    <Tab label="Lecture" sx={{ fontSize: '16px', textTransform: 'none' }} />
  </Tabs>
);

export default TabsNavigation;
