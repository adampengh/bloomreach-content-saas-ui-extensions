import React, { useContext, useState } from 'react'

// API
import {
  createWebhookConfiguration,
  getAllWebhookConfigurations,
} from 'bloomreach-content-management-apis'

// Components
import {
  useTheme,
  Badge,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormControl,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

// Constants
import { DEFAULT_WEBHOOK_CONFIGURATION_VALUES, WEBHOOK_TRIGGERS } from '@/lib/constants'

// Context
import { ConfigurationContext, ErrorContext, LoadingContext } from '@/contexts'

// Icons
import { AddIcon, CloseIcon, DeleteIcon } from '@/icons'

export const CreateWebhookModal = ({
  showModal,
  setShowModal,
  setWebhooks,
}) => {
  const theme = useTheme()
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source
  const { handleShowSnackbar } = useContext(ErrorContext)
  const { setLoading } = useContext(LoadingContext)

  // State
  const [ formData, setFormData ] = useState(DEFAULT_WEBHOOK_CONFIGURATION_VALUES)
  const [ triggers, setTriggers ] = useState(WEBHOOK_TRIGGERS)
  const [ headers, setHeaders ] = useState(DEFAULT_WEBHOOK_CONFIGURATION_VALUES.headers)

  const handleClose = () => {
    setShowModal(false)
  };

  const handleTriggersChange = (event) => {
    const name = event.target.name
    const checked = event.target.checked

    if (checked) {
      setTriggers([...triggers, name])
    } else {
      setTriggers(triggers.filter(trigger => trigger !== name))
    }
  };

  const errorMessage = 'Error creating webhook configuration'
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading({ loading: true, message: 'Creating webhook configuration...' })

    await createWebhookConfiguration(environment, xAuthToken, { ...formData, triggers, headers })
      .then(async () => {
        await getAllWebhookConfigurations(environment, xAuthToken)
          .then(async (response) => {
            // Reset form
            setFormData(DEFAULT_WEBHOOK_CONFIGURATION_VALUES)
            setHeaders(DEFAULT_WEBHOOK_CONFIGURATION_VALUES.headers)
            setTriggers([])
            // Update the state
            await setWebhooks(response.data)
            await setShowModal(false)
            // Show success message
            await handleShowSnackbar('success', 'Webhook configuration created successfully')

          })
          .catch(async (error) => {
            console.error(errorMessage, error)
            handleShowSnackbar('error', errorMessage)
          })
      })
      .catch(error => {
        console.error(errorMessage, error)
        handleShowSnackbar('error', errorMessage)
      })

    await setLoading({ loading: false, message: '' })
  }

  return (
    <Dialog
      open={showModal}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'md'}
    >
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <DialogTitle>
          <Typography variant='h3' sx={{ fontWeight: 'bold' }}>Create Webhook Configuration</Typography>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack
              sx={{ width: '100%', mt: 2 }}
              spacing={3}
            >
              {/* Enabled */}
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='enabled'>Enabled</InputLabel>
                <Select
                  id='enabled'
                  labelId='enabled'
                  label={'Enabled'}
                  value={formData.enabled}
                >
                  <MenuItem value={true}>
                    <Badge
                      badgeContent=''
                      color={'success'}
                      variant='dot'
                      anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                      sx={{ top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <Typography variant='p' component='span' sx={{ pl: 1 }}>Enabled</Typography>
                  </MenuItem>
                  <MenuItem value={false}>
                    <Badge
                      badgeContent=''
                      color={'error'}
                      variant='dot'
                      anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                      sx={{
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                    <Typography variant='p' component='span' sx={{ pl: 1 }}>Disabled</Typography>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Webhook Name */}
              <TextField
                id='name'
                name='name'
                label='Webhook Name'
                value={formData.name || ''}
                fullWidth
                sx={{ '&.MuiTextField-root': { mx: 0, mt: 3 } }}
                onChange={(e) => {
                  setFormData(prevState => ({
                    ...prevState,
                    name: e.target.value
                  }))
                }}
              />

              {/* Webhook URL */}
              <TextField
                id='url'
                name='url'
                label='URL'
                value={formData.url || ''}
                fullWidth
                sx={{ '&.MuiTextField-root': { mx: 0, mt: 2 } }}
                onChange={(e) => {
                  setFormData(prevState => ({
                    ...prevState,
                    url: e.target.value
                  }))
                }}
              />

              {/* Method */}
              <TextField
                disabled
                id='method'
                name='method'
                label='Method'
                value={formData.method || 'POST'}
                fullWidth
                sx={{ '&.MuiTextField-root': { mx: 0, mt: 2, mb: 0 } }}
              />

              {/* Triggers */}
              <Paper
                square={false}
                sx={{
                  p: 2,
                  border: triggers.length === 0 ? `1px solid ${theme.palette.error.light}` : `1px solid ${theme.palette.primary.light}`
                }}
              >
                <FormControl
                  required
                  sx={{ width: '100%' }}
                  error={triggers.length === 0 && true}
                >
                  <FormLabel component='legend'>
                    <strong>Triggers</strong>
                  </FormLabel>
                  <FormGroup sx={{ padding: 1, display: 'flex', flexDirection: 'row' }}>
                    {WEBHOOK_TRIGGERS.map((trigger) => (
                      <FormControlLabel
                        key={trigger}
                        control={
                          <Checkbox
                            name={trigger}
                            checked={triggers.indexOf(trigger) > -1}
                            onChange={handleTriggersChange}
                          />
                        }
                        label={trigger}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Paper>

              {/* Headers */}
              <HeadersField
                headers={headers}
                setHeaders={setHeaders}
              />
            </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ pr: '24px' }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant='contained'
            type='submit'
          >Create</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

const HeadersField = ({ headers, setHeaders }) => {
  const theme = useTheme()

  const handleHeaderDelete = (index) => {
    setHeaders(headers?.filter((_, i) => i !== index))
  }

  const handleHeaderAdd = () => {
    if (!headers) {
      setHeaders([{ name: '', value: '', secret: false }])
      return
    }
    setHeaders([...headers, { name: '', value: '', secret: false }])
  }

  return (
    <Paper square={false} sx={{ padding: 2, border: `1px solid ${theme.palette.primary.light}` }}>
      <FormLabel component='legend' sx={{ mb: 2 }}>
        <strong>Headers</strong>
      </FormLabel>

      {headers?.map((header, index) => {
        return (
        <Grid key={index} container spacing={1} alignItems={'center'} sx={{ mb: 2 }}>
          <Grid item xs>
            <TextField
              id={`name-${index}`}
              name={`name-${index}`}
              label='Name'
              fullWidth
              value={header.name}
              onChange={(e) => {
                console.log(`name-${index}`, e.target.value)
                setHeaders((prevState) => {
                  const updatedHeaders = [...prevState]
                  updatedHeaders[index].name = e.target.value
                  return updatedHeaders
                })
              }}
            />
          </Grid>
          <Grid item xs>
            <TextField
              id={`value-${index}`}
              name={`value-${index}`}
              label='Value'
              fullWidth
              value={header.value}
              onChange={(e) => {
                console.log(`value-${index}`, e.target.value)
                setHeaders((prevState) => {
                  const updatedHeaders = [...prevState]
                  updatedHeaders[index].value = e.target.value
                  return updatedHeaders
                })
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth variant='outlined'>
              <InputLabel id={`secret-${index}`}>Secret</InputLabel>
              <Select
                id={`secret-${index}`}
                value={header.secret}
                label='Secret'
                onChange={(e) => {
                  console.log(`secret-${index}`, e.target.value)
                  setHeaders((prevState) => {
                    const updatedHeaders = [...prevState]
                    updatedHeaders[index].secret = e.target.value
                    return updatedHeaders
                  })
                }}
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <IconButton onClick={() => handleHeaderDelete(index)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
        )}
      )}

        <Grid container spacing={1} alignItems={'center'}>
          <Grid item>
            <Button color='primary' variant='outlined' onClick={handleHeaderAdd}>
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
    </Paper>
  )
}
