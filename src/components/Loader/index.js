'use client'

// Components
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';


export const Loader = ({
  loading,
  setLoading,
}) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: 99999 }}
      open={loading.loading}
    >
      <IconButton
        aria-label='close loader'
        onClick={() => setLoading({ loading: false, message: '' })}
        sx={{ position: 'absolute', top: 10, right: 10 }}
      >
        <CloseIcon />
      </IconButton>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignContent='center'
        alignItems='center'
      >
        { loading.message &&
          <Typography
            color='primary'
            variant='h4'
            sx={{ mb: 1 }}
          >{loading.message}</Typography>
        }
        <CircularProgress />
      </Box>
    </Backdrop>
  )
}
