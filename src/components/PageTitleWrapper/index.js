'use client'

import { Box, alpha, lighten } from '@mui/material';
import styled from '@emotion/styled'

const PageTitle = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(4)};
    margin-bottom: ${theme.spacing(4)};
    background: ${theme.palette.common.white};
    box-shadow: ${theme.palette.mode === 'dark'
        ? `0 1px 0 ${alpha(lighten(theme.colors.primary.main, 0.7), 0.15)},
          0px 2px 4px -3px rgba(0, 0, 0, 0.2),
          0px 5px 12px -4px rgba(0, 0, 0, .1)`
        : `0px 2px 4px -3px ${alpha(theme.palette.common.black,0.1)},
          0px 5px 12px -4px ${alpha(theme.palette.common.black,0.05)}`
      }
  `
);

const PageTitleWrapper = ({ children }) => {
  return (
    <PageTitle className='MuiPageTitle-wrapper'>
      {children}
    </PageTitle>
  );
};


export default PageTitleWrapper;
