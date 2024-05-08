import { useContext, useState } from 'react';

// Components
import ConfigurationModule from 'src/modules/Configuration';
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { StyledHeaderWrapper } from './styles';

// Contexts
import { SidebarContext } from 'src/contexts';

// Icons
import { CloseTwoToneIcon, MenuTwoToneIcon, SettingsIcon } from 'src/icons';


const Header = () => {
  const [ drawerOpen, setDrawerOpen ] = useState(false);
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  return (
    <>
      <StyledHeaderWrapper
        as='header'
        sx={{ justifyContent: { lg: 'flex-start', xs: 'space-between' } }}
      >
        <Button
          variant='outlined'
          color='primary'
          onClick={() => setDrawerOpen(true)}
          startIcon={<SettingsIcon fontSize='small' />}
        >Configuration</Button>

        <Box
          component='span'
          sx={{
            ml: 2,
            display: { lg: 'none', xs: 'inline-block' }
          }}
        >
          <Tooltip arrow title='Toggle Menu'>
            <IconButton color='primary' onClick={toggleSidebar}>
              {!sidebarToggle ? (
                <MenuTwoToneIcon fontSize='small' />
              ) : (
                <CloseTwoToneIcon fontSize='small' />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </StyledHeaderWrapper>

      {/* Configuration Drawer */}
      <Drawer
        anchor='top'
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <IconButton
          color='primary'
          onClick={() => setDrawerOpen(false)}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0
          }}
        >
          <CloseTwoToneIcon fontSize='small' />
        </IconButton>

        <Box padding={3} sx={{ backgroundColor: 'background.default' }}>
          <Container maxWidth='xl'>
            <Typography variant='h3' sx={{ mb: 1 }}>Configuration</Typography>
            <Divider sx={{ mb: 3 }} />
          </Container>
          <ConfigurationModule />
        </Box>
      </Drawer>
    </>
  )
}

export default Header;
