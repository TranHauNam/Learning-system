import React, { createContext, useState, useCallback } from 'react';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState('');
  const [show, setShow] = useState(false);

  const showAlert = useCallback((message) => {
    setAlert(message);
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  }, []);

  const closeAlert = () => setShow(false);

  return (
    <AlertContext.Provider value={{ alert, show, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
}; 