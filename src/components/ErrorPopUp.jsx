import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, LinearProgress, Box } from '@mui/material';

const ErrorPopup = ({ id, open, message, severity, handleClose, verticalOffset }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (open) {
      setProgress(100); // Reset progress when popup opens

      const timer = setInterval(() => {
        setProgress((prev) => prev - 1);
      }, 30);

      const timeout = setTimeout(() => {
        handleClose(id); 
      }, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
        setProgress(100);
      };
    }
  }, [open, handleClose, id]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => handleClose(id)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ position: 'relative', top: verticalOffset, width: '100%', maxWidth: '90vw',marginTop:1 }}
    >
      <Alert onClose={() => handleClose(id)} severity={severity || 'error'} sx={{ width: '100%' }}>
        {message}
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default ErrorPopup;
