'use client'

import React, { useState } from 'react'

// Components
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';


export const DeliverApiSettingsV1 = () => {
  const [data, setData] = useState({
    enabled: true,
    skipTranslations: false,
  })

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant='h3'>Delivery API V1</Typography>
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
                id='v1ApiEnabled'
                labelId='v1ApiEnabled'
                label={'API Enabled'}
                value={data.enabled}
                onChange={(e) => setData({...data, enabled: e.target.value})}
              >
                <MenuItem value={true}>Enabled</MenuItem>
                <MenuItem value={false}>Disabled</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              variant='outlined'
            >
              <InputLabel id='v1SkipTranslations'>Skip Translations</InputLabel>
              <Select
                id='v1SkipTranslations'
                labelId='v1SkipTranslations'
                label={'Skip Translations'}
                value={data.skipTranslations}
                onChange={(e) => setData({...data, format: e.target.value})}
              >
                <MenuItem value={true}>Enabled</MenuItem>
                <MenuItem value={false}>Disabled</MenuItem>
              </Select>
            </FormControl>

            <Button variant='contained' type='submit'>Save</Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
