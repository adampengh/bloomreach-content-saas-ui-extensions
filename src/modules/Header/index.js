import { useContext } from 'react';
import styled from '@emotion/styled'
import { config } from '../../theme/schemes/BloomreachTheme'

// Components
import {
  alpha,
  lighten,
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';

// Contexts
import { SidebarContext } from 'src/contexts';

// Icons
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
    height: ${config.header.height};
    color: ${config.header.textColor};
    padding: ${theme.spacing(0, 2)};
    right: 0;
    z-index: 6;
    background-color: ${alpha(config.header.background, 1)};
    backdrop-filter: blur(3px);
    position: fixed;
    justify-content: space-between;
    width: 100%;
    box-shadow:
      ${theme.palette.mode === 'dark'
        ? `0 1px 0 ${alpha(lighten(theme.colors.primary.main, 0.7), 0.15)}`
        : `0px 2px 8px -3px ${alpha(theme.colors.alpha.black[100], 0.2)},
          0px 5px 22px -4px ${alpha(theme.colors.alpha.black[100], 0.1)};`}
    @media (min-width: ${theme.breakpoints.values.lg}px) {
        left: ${config.sidebar.width};
        width: auto;
    }
`
);

const Header = () => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  return (
    <HeaderWrapper
      as='header'
      display={config.header.height != 0 ? 'flex' : 'none'}
      alignItems='center'
    >
      <Stack
        direction='row'
        divider={<Divider orientation='vertical' flexItem />}
        alignItems='center'
        spacing={2}
      >
        {/* <Environments /> */}
      </Stack>
      <Box display='flex' alignItems='center'>
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
      </Box>
      </HeaderWrapper>
  )
}

export default Header;
