import { Fragment, useContext, useEffect, useState } from 'react'

// API
import {
  getChannelParameters,
  getChannel,
  putChannel,
} from 'api'

// Components
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

// Contexts
import { ErrorContext } from 'src/contexts/ErrorContext';

const HELPER_TEXT_MAP = {
  "discoveryRealm": "STAGING or PRODUCTION",
  "spaUrl": "Frontend URL"
}

const ChannelParametersValuesTab = ({ channel, environment, xAuthToken }) => {
  // Context
  const { handleShowSnackbar } = useContext(ErrorContext)

  // State
  const [channelData, setChannelData] = useState(channel)
  const [parameters, setParameters] = useState(null)

  useEffect(() => {
    setChannelData(channel)

    getChannelParameters(environment, xAuthToken, channel.id)
      .then(response => {
        setParameters(response.data)
      })
      .catch(error => {
        handleShowSnackbar('error', error.message)
      })
  }, [channel])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const xResourceVersion = await getChannel(environment, xAuthToken, channelData.id)
      .then(response => response.headers['x-resource-version'])
      .catch(error => console.error(error))

    if (xResourceVersion) {
      await putChannel(environment, xAuthToken, channelData.id, channelData, xResourceVersion)
        .then(response =>
          handleShowSnackbar('success', 'Properties Saved')
        )
        .catch(error => {
          console.log('error', error)
          handleShowSnackbar('error', error.message)
        })
    }
  }

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      display="flex"
      sx={{ margin: 0 }}
    >
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="stretch"
        rowSpacing={3}
        columnSpacing={0}
        sx={{ width: '100%', marginTop: -2 }}
      >
        <Grid
          container
          display="flex"
          justifyContent="space-between"
          alignContent="center"
          alignItems="flex-end"
          spacing={0}
          sx={{ width: '100%', paddingBottom: 3, margin: 0 }}
        >
          <Grid item>
            <Typography variant="h4">Property Values</Typography>
          </Grid>
        </Grid>

        <Stack
          sx={{ width: '100%', maxWidth: '480px', padding: 0 }}
          spacing={3}
        >
          {parameters?.map((parameter, index) => (
            <Fragment key={index}>
              {parameter.name === 'discoveryRealm' ?
                <FormControl
                  variant="outlined"
                  sx={{ width: '100%', marginRight: 1 }}
                >
                  <InputLabel id="sourceProjectId">{parameter.displayName}</InputLabel>
                  <Select
                    id={parameter.displayName}
                    labelId="sourceProjectId"
                    name={parameter.displayName}
                    label={parameter.displayName}
                    value={channelData.parameters[parameter.name] || 'PRODUCTION'}
                    onChange={(e) => {
                      setChannelData(prevState => ({
                        ...prevState,
                        parameters: {
                          ...prevState.parameters,
                          [parameter.name]: e.target.value
                        }
                      }))
                    }}
                  >
                    <MenuItem value='PRODUCTION'>PRODUCTION</MenuItem>
                    <MenuItem value='STAGING'>STAGING</MenuItem>
                  </Select>
                </FormControl>
              :
                <TextField
                  id={parameter.displayName}
                  name={parameter.displayName}
                  label={parameter.displayName}
                  value={channelData.parameters[parameter.name]}
                  fullWidth
                  onChange={(e) => {
                    setChannelData(prevState => ({
                      ...prevState,
                      parameters: {
                        ...prevState.parameters,
                        [parameter.name]: e.target.value
                      }
                    }))
                  }}
                  helperText={HELPER_TEXT_MAP[parameter.name]}
                />
              }
            </Fragment>
          ))}
        </Stack>
        <Grid item xs={12}>
          <Button
            variant="contained"
            type="submit"
          >Save</Button>
        </Grid>
      </Grid>
    </Box>
  )
}



export default ChannelParametersValuesTab
