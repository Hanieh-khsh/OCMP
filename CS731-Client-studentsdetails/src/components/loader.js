// FullScreenLoader.js
import React from 'react';
import { CircularProgress, Box } from '@mui/material';

/* 
Component for displaying a full-screen loading spinner.
Used to indicate ongoing asynchronous operations.
*/
const FullScreenLoader = () => {
    return (
        <Box
            sx={{
                position: 'fixed', // Fixed positioning to cover the entire screen
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex', // Flexbox layout for centering the spinner
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
                zIndex: 9999, // High z-index to ensure it appears on top of other elements
            }}
        >
            <CircularProgress /> {/* Material-UI circular progress indicator */}
        </Box>
    );
};

export default FullScreenLoader;
