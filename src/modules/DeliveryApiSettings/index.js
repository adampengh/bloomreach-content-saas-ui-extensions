'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// Components
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import { TabPanel } from '@/components';
import { DeliverApiSettingsV1 } from './tabs/DeliveryApiSettingsV1'
import { DeliverApiSettingsV2 } from './tabs/DeliveryApiSettingsV2'

const TABS = [
  'Delivery API V1',
  'Delivery API V2',
]

export const DeliveryApiSettingsModule = () => {
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || TABS[0];

  // State
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (tab && TABS.indexOf(tab) != -1) setValue(TABS.indexOf(tab));
  }, [tab])

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    router.push(`${pathname}?tab=${TABS[newValue]}`);
  };

  return (
    <Container maxWidth={false}>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='stretch'
        alignContent='stretch'
      >
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ fontWeight: 'bold' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleTabChange}>
                  <Tab label={`${TABS[0]}`} />
                  <Tab label={`${TABS[1]}`} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <DeliverApiSettingsV1 />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <DeliverApiSettingsV2 />
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
