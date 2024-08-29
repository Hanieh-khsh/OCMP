import React from 'react';
import { Box, Skeleton } from '@mui/material';

const Placeholder = () => (
  <Box display="flex" flexDirection="column" alignItems="left" width="100%">
    <Skeleton variant="circular" width={40} height={40} />
    <Skeleton variant="rectangular" width="60%" height={20} sx={{ my: 1 }} />
    <Skeleton variant="rectangular" width="80%" height={20} sx={{ my: 1 }} />
    <Skeleton variant="rectangular" width="70%" height={20} sx={{ my: 1 }} />
    <Skeleton variant="rectangular" width="90%" height={20} sx={{ my: 1 }} />
    <Skeleton variant="rectangular" width="50%" height={20} sx={{ my: 1 }} />
  </Box>
);

export default Placeholder;
