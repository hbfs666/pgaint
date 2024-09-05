import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, LinearProgress, Box } from '@mui/material';

const ErrorPopup = ({ open, message, severity, handleClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (open) {
      setProgress(100); // Reset progress when popup opens

      const timer = setInterval(() => {
        setProgress((prev) => prev - 1);
      }, 30);

      const timeout = setTimeout(() => {
        handleClose(); 
      }, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
        setProgress(100);
      };
    }
  }, [open, handleClose]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity || 'error'} sx={{ width: '100%' }}>
        {message}
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default ErrorPopup;

