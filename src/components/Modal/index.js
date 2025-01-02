import React from 'react'

// Components
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material'

// Icons
import { CloseIcon } from '@/icons'

export default function Modal({
  showModal,
  setShowModal,
  onConfirm,
  onCancel,
  modalWidth,
  title,
  children,
}) {
  const handleClose = () => setShowModal(false)

  return (
    <Dialog
      fullWidth={true}
      maxWidth={modalWidth || 'sm'}
      open={showModal}
      onClose={handleClose}
      PaperProps={{ elevation: 1 }}
    >
      {/* Close Button */}
      <IconButton
        aria-label='close'
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}>
        <CloseIcon />
      </IconButton>

      <Box
        component='form'
        sx={{
          ...(title ? {}: {paddingTop: 3}),
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete='off'
      >
        {title &&  <>
          <DialogTitle>
            <Typography variant='h3' sx={{ fontWeight: 'bold' }}>{title}</Typography>
          </DialogTitle>
          <Divider />
        </> }

        <DialogContent>
          {children}
        </DialogContent>

        <Divider />
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            color='primary'
            variant='contained'
            onClick={onConfirm}
          >Ok</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
