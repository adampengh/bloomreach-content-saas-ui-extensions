import { useState, createContext, useEffect } from 'react';

import {
  Alert,
  Snackbar,
} from '@mui/material';

export const ErrorContext = createContext({});

export function ErrorProvider({ children }) {
  const [snackPack, setSnackPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);
  const [messageSeverity, setMessageSeverity] = useState('success')

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open])

  // TODO: Pass in error and handle the error here instead of individual components
  const handleShowSnackbar = (severity, message) => {
    setMessageSeverity(severity)
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }])
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <ErrorContext.Provider
      value={{
        snackPack,
        setSnackPack,
        open,
        setOpen,
        messageInfo,
        setMessageInfo,
        messageSeverity,
        setMessageSeverity,
        handleShowSnackbar,
      }}
    >
      {children}

      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        sx={{ zIndex: 1000 }}
      >
        <Alert
          onClose={handleClose}
          variant="filled"
          severity={messageSeverity}
          sx={{ width: '100%', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}
        >
          {messageInfo?.message}
        </Alert>
      </Snackbar>
    </ErrorContext.Provider>
  );
}
