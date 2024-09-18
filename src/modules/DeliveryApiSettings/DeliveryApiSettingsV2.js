'use client'

import React, { useState } from 'react'

// Components
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material';

// Constants
import { SECURED_APIS } from 'src/lib/constants';


export const DeliverApiSettingsV2 = () => {
  const [data, setData] = useState({
    enabled: true,
    format: 'flattened',
    secret: null,
    securedApis: ['folders', 'documents'],
    skipTranslations: false,
  })

  const handleSecuredApisChange = (event) => {
    const name = event.target.name
    const checked = event.target.checked

    if (checked) {
      setData(prevState => ({
        ...prevState,
        securedApis: [...prevState.securedApis, name]
      }))
    } else {
      setData(prevState => ({
        ...prevState,
        securedApis: prevState.securedApis.filter(securedApi => securedApi !== name)
      }))
    }
  };

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant='h3'>Delivery API V2</Typography>
        }
      />
      <Divider />
      <CardContent>
      <Box
          component='form'
          noValidate
          autoComplete='off'
          // onSubmit={handleSubmit}
        >
          <Stack spacing={3}>
            <FormControl
              fullWidth
              variant='outlined'
            >
              <InputLabel id='v1ApiEnabled'>API Enabled</InputLabel>
              <Select
                id='v2ApiEnabled'
                labelId='v2ApiEnabled'
                label={'API Enabled'}
                value={data.enabled}
                onChange={(e) => setData({...data, enabled: e.target.value})}
              >
                <MenuItem value={true}>
                  <Badge
                    badgeContent=''
                    color={'success'}
                    variant='dot'
                    anchorOrigin={{
                      horizontal: 'left',
                      vertical: 'top'
                    }}
                    sx={{
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  <Typography variant='p' component='span' sx={{ pl: 1 }}>Enabled</Typography>
                </MenuItem>
                <MenuItem value={false}>
                  <Badge
                    badgeContent=''
                    color={'error'}
                    variant='dot'
                    anchorOrigin={{
                      horizontal: 'left',
                      vertical: 'top'
                    }}
                    sx={{
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  <Typography variant='p' component='span' sx={{ pl: 1 }}>Disabled</Typography>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              variant='outlined'
            >
              <InputLabel id='v2SkipTranslations'>Skip Translations</InputLabel>
              <Select
                id='v2SkipTranslations'
                labelId='v2SkipTranslations'
                label={'Skip Translations'}
                value={data.skipTranslations}
                onChange={(e) => setData({...data, skipTranslations: e.target.value})}
              >
                <MenuItem value={true}>
                  <Badge
                    badgeContent=''
                    color={'success'}
                    variant='dot'
                    anchorOrigin={{
                      horizontal: 'left',
                      vertical: 'top'
                    }}
                    sx={{
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  <Typography variant='p' component='span' sx={{ pl: 1 }}>Enabled</Typography>
                </MenuItem>
                <MenuItem value={false}>
                  <Badge
                    badgeContent=''
                    color={'error'}
                    variant='dot'
                    anchorOrigin={{
                      horizontal: 'left',
                      vertical: 'top'
                    }}
                    sx={{
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  <Typography variant='p' component='span' sx={{ pl: 1 }}>Disabled</Typography>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              variant='outlined'
            >
              <InputLabel id='v2SkipTranslations'>Format</InputLabel>
              <Select
                id='v2SkipTranslations'
                labelId='v2SkipTranslations'
                label={'Format'}
                value={data.format}
                onChange={(e) => setData({...data, format: e.target.value})}
              >
                <MenuItem value={'flattened'}>Flattened</MenuItem>
                <MenuItem value={'inline'}>Inline</MenuItem>
              </Select>
            </FormControl>

            <Divider />

            <Typography variant='h4'>Authorization</Typography>
            <FormControl variant='outlined'>
              <InputLabel htmlFor='v2ApiSecret'>Secret</InputLabel>
              <OutlinedInput
                id='v2ApiSecret'
                name='v2ApiSecret'
                type='text'
                label='Secret'
                value={data.secret}
                onChange={(e) => setData({...data, secret: e.target.value})}
              />
            </FormControl>

            <FormControl sx={{ p: 1, width: '100%' }}>
              <FormLabel component='legend'>
                <strong>Secured APIs</strong>
              </FormLabel>
              <FormGroup sx={{ padding: 1, display: 'flex', flexDirection: 'row' }}>
                {SECURED_APIS.map((securedApi) => (
                  <FormControlLabel
                    key={securedApi}
                    control={
                      <Checkbox
                        name={securedApi}
                        checked={data.securedApis.indexOf(securedApi) > -1}
                        onChange={handleSecuredApisChange}
                      />
                    }
                    label={securedApi}
                  />
                ))}
              </FormGroup>
            </FormControl>

            <Button variant='contained' type='submit'>Save</Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
