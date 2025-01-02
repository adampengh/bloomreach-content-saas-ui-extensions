import { useContext, useEffect, useState } from 'react'

import {
  getChannel,
  putChannel,
} from 'bloomreach-content-management-apis'

// Components
import { ChannelIcon } from 'src/components'
import {
  Autocomplete,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'

// Contexts
import { ErrorContext } from 'src/contexts'

// Lib
import { locales } from 'src/lib/locales'


const ChannelDetailsTab = ({ channel, environment, xAuthToken }) => {
  // Context
  const { handleShowSnackbar } = useContext(ErrorContext)

  // State
  const [channelData, setChannelData] = useState(channel)

  useEffect(() => {
    console.log('useEffect', channel)
    setChannelData(channel)
  }, [channel])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const xResourceVersion = await getChannel(environment, xAuthToken, channelData.id)
      .then(response => response.headers['x-resource-version'])
      .catch(error => console.error(error))

    if (xResourceVersion) {
      await putChannel(environment, xAuthToken, channelData.id, channelData, xResourceVersion)
        .then(response => {
          console.log(response)
          handleShowSnackbar('success', 'Channel Saved')
        })
        .catch(error => {
          handleShowSnackbar('error', error.message)
        })
    }
  }

  return (
    <>
      <Box
        component='form'
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit}
        display='flex'
        sx={{ margin: 0, marginTop: -2 }}
      >
        <Grid
          container
          direction='row'
          justifyContent='flex-start'
          alignItems='stretch'
          rowSpacing={3}
          columnSpacing={3}
          sx={{ width: '100%' }}
        >
          <Grid item xs={6}>
            <Stack
              sx={{ width: '100%', maxWidth: '480px' }}
              spacing={3}
            >
              <TextField
                id='name'
                name='name'
                label='Channel Name'
                value={channelData.name}
                fullWidth
                onChange={(e) => {
                  console.log('e', e.target.value)
                  setChannelData(prevState => ({
                    ...prevState,
                    name: e.target.value
                  }))
                }}
              />
              <TextField
                disabled
                id='id'
                name='id'
                label='Channel ID'
                value={channelData.id}
                fullWidth
              />
              <TextField
                disabled
                id='branch'
                name='branch'
                label='Branch'
                value={channelData.branch}
                fullWidth
              />
              <TextField
                disabled
                id='branchOf'
                name='branchOf'
                label='Branch of'
                value={channelData.branchOf}
                fullWidth
              />
              <TextField
                disabled
                id='projectName'
                name='projectName'
                label='Project Name'
                value={channelData.projectName}
                fullWidth
              />
              <TextField
                disabled
                id='contentRootPath'
                name='contentRootPath'
                label='Content Root Path'
                value={channelData.contentRootPath}
                fullWidth
              />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack
              spacing={3}
              sx={{ width: '100%', maxWidth: '480px' }}
            >
              <TextField
                id='icon'
                name='icon'
                label='Icon'
                value={channelData.icon}
                fullWidth
                onChange={(e) =>
                  setChannelData(prevState => ({
                    ...prevState,
                    icon: e.target.value
                  }))
                }
                InputProps={{
                  endAdornment:
                    <InputAdornment position='end'>
                      <ChannelIcon icon={channelData.icon} />
                    </InputAdornment>
                }}
              />
              <Autocomplete
                freeSolo
                disablePortal
                id='locale'
                name='locale'
                options={locales}
                fullWidth
                value={channelData.locale}
                renderInput={(params) => <TextField {...params} label='Locale' />}
                renderOption={(props, option) => (
                  <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    {option.label} - {option.locale}
                  </Box>
                )}
                onChange={(event, value) => {
                  setChannelData(prevState => ({
                    ...prevState,
                    locale: value?.locale
                  }))
                }}
              />
              <TextField
                disabled
                id='defaultDevice'
                name='defaultDevice'
                label='Default Device'
                value={channelData.defaultDevice}
                fullWidth
              />
              <FormControlLabel
                id='remoteHostProtection'
                name='remoteHostProtection'
                onClick={(e) =>
                  setChannelData(prevState => ({
                    ...prevState,
                    remoteHostProtection: e.target.checked
                  }))
                }
                control={
                  <Checkbox checked={channelData.remoteHostProtection} />
                }
                label='Remote Host Protection'
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant='contained'
              type='submit'
            >Save</Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default ChannelDetailsTab
