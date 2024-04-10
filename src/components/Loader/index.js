'use client'

import {
  Backdrop,
  CircularProgress,
} from '@mui/material';

export const Loader = ({ open = true }) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: 99999 }}
      open={open}
    >
      <CircularProgress />
    </Backdrop>
  )
}
