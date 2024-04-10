import { useState } from 'react'

// Components
import ChannelDetailsTab from 'src/components/Channels/tabs/ChannelDetailsTab'
import ChannelParametersTab from 'src/components/Channels/tabs/ChannelParametersTab'
import ChannelParametersValuesTab from 'src/components/Channels/tabs/ChannelParametersValuesTab'
import ChannelResponseHeaders from 'src/components/Channels/tabs/ChannelResponseHeaders'
import {
  Box,
  Grid,
  Tabs,
  Tab,
} from '@mui/material'
import { TabPanel } from 'src/components';

export const ChannelTab = ({ channel, environment, xAuthToken }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={3}
      sx={{ width: '100%' }}
    >
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', minHeight: '400px' }}>
          <Tabs
            orientation="vertical"
            value={activeTab}
            onChange={handleTabChange}
            sx={{ borderRight: 1, borderColor: 'divider', marginRight: 3 }}
          >
            <Tab label="Channel Settings" />
            <Tab label="Properties" />
            <Tab label="Property Values" />
            {/* <Tab label="Response Headers" /> */}
          </Tabs>

          {/* Channel Settings Tab */}
          <TabPanel value={activeTab} index={0} style={{ width: '100%' }}>
            <ChannelDetailsTab
              channel={channel}
              environment={environment}
              xAuthToken={xAuthToken}
            />
          </TabPanel>

          {/* Properties Tab */}
          <TabPanel value={activeTab} index={1} style={{ width: '100%' }}>
            <ChannelParametersTab
              channel={channel}
              environment={environment}
              xAuthToken={xAuthToken}
            />
          </TabPanel>

          {/* Properties Values Tab */}
          <TabPanel value={activeTab} index={2} style={{ width: '100%' }}>
            <ChannelParametersValuesTab
              channel={channel}
              environment={environment}
              xAuthToken={xAuthToken}
            />
          </TabPanel>

          {/* Response Headers Tab */}
          {/* TODO: Add Response Headers Tab */}
          {/* <TabPanel value={activeTab} index={3} style={{ width: '100%' }}>
            <ChannelResponseHeaders channel={channel} />
          </TabPanel> */}
        </Box>
      </Grid>

    </Grid>
  )
}
