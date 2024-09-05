import React, { createContext, useState, useContext } from 'react';
import ErrorPopup from '../../components/ErrorPopUp';

const ErrorContext = createContext();

export const useError = () => {
  return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState({ open: false, message: '', severity: 'error' });

  const showMessage = (message, severity) => {
    setError({ open: true, message, severity });
  };

  const handleClose = () => {
    setError({ ...error, open: false });
  };

  return (
    <ErrorContext.Provider value={showMessage}>
      {children}
      <ErrorPopup open={error.open} message={error.message} severity={error.severity} handleClose={handleClose} />
    </ErrorContext.Provider>
  );
};
