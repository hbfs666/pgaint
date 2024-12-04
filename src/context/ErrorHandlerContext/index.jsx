import React, { createContext, useState, useContext, useCallback } from 'react';
import ErrorPopup from '../../components/ErrorPopUp';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ErrorContext = createContext();

export const useError = () => {
  return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const showMessage = (message, severity = 'error') => {
    const id = uuidv4();
    setErrors((prevErrors) => [...prevErrors, { id, message, severity, open: true }]);
  };

  const handleClose = useCallback((id) => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
  }, []);

  return (
    <ErrorContext.Provider value={showMessage}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: isMobile ? 'translateX(-50%)' : 'translateX(-50%)',
          width: isMobile ? '90vw' : 'auto',
          zIndex: 1400,
        }}
      >
        {errors.map((error, index) => (
          <ErrorPopup
            key={error.id}
            id={error.id}
            open={error.open}
            message={error.message}
            severity={error.severity}
            handleClose={handleClose}
            verticalOffset={index * (isMobile ? 2 : 10)} // Adjust the offset based on the index
          />
        ))}
      </div>
    </ErrorContext.Provider>
  );
};
