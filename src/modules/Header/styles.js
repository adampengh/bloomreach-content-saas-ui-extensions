import styled from '@emotion/styled'
import { config } from '../../theme/schemes/BloomreachTheme'
import {
  alpha,
  lighten,
  Box,
} from '@mui/material';

export const StyledHeaderWrapper = styled(Box)(
  ({ theme }) => `
    align-items: center;
    background-color: ${alpha(config.header.background, 1)};
    backdrop-filter: blur(3px);
    box-shadow:
      ${theme.palette.mode === 'dark'
        ? `0 1px 0 ${alpha(lighten(theme.colors.primary.main, 0.7), 0.15)}`
        : `0px 2px 8px -3px ${alpha(theme.colors.alpha.black[100], 0.2)},
          0px 5px 22px -4px ${alpha(theme.colors.alpha.black[100], 0.1)};`}
    color: ${config.header.textColor};
    display: ${config.header.height != 0 ? 'flex' : 'none'};
    height: ${config.header.height};
    padding: ${theme.spacing(0, 2)};
    position: fixed;
    right: 0;
    width: 100%;
    z-index: 6;
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      left: ${config.sidebar.width};
      width: auto;
    }
`);
