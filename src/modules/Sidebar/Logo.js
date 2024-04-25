'use client'

import {
  Tooltip,
  Typography,
  tooltipClasses,
} from '@mui/material';
import styled from '@emotion/styled'
import Link from 'src/components/Link';
import packageInfo from '../../../package.json';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
      color: ${theme.palette.text.primary};
      display: flex;
      text-decoration: none;
      width: 153px;
      margin: 0;
      font-weight: ${theme.typography.fontWeightBold};
    .cls-1{fill:#ffffff;}
    .cls-2{fill:#ffd500;}
    .cls-3{fill:#002840;}
`);


const TooltipWrapper = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100]
  }
}));

export const Logo = () => {
  return (
    <TooltipWrapper
      title='Bloomreach UI Extension'
      arrow
    >
      <>
        <LogoWrapper href='/'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 331.82 71.87'>
            <defs>
              <style></style>
            </defs>
            <g id='Layer_2' data-name='Layer 2'>
              <g id='bloomreach-logo'>
                <path className='cls-1' d='M119.81,17.27V49.84h-5.22V17.27Z'/>
                <path className='cls-1' d='M213.68,36.38V49.84h-5.21V37.25A5.24,5.24,0,1,0,198,37.12V49.84h-5.21V37.25a5.06,5.06,0,0,0-5.25-5.43,5.26,5.26,0,0,0-5.21,5.47V49.84h-5.21V27.44h5.21V30A8.62,8.62,0,0,1,189,27a8.82,8.82,0,0,1,7.47,3.82A9.64,9.64,0,0,1,204.26,27,9.06,9.06,0,0,1,213.68,36.38Z'/>
                <path className='cls-1' d='M230.78,27v5.52c-5-.35-7.55,2.26-7.55,5.69V49.84H218V27.44h5.21v3.17A9.58,9.58,0,0,1,230.78,27Z'/>
                <path className='cls-1' d='M254.41,40.51H236.78a6.54,6.54,0,0,0,6.68,5.12,6.79,6.79,0,0,0,6.26-3.6l4.34,1.82a11.35,11.35,0,0,1-10.34,6.43c-7.12,0-12-5.17-12-11.64A11.39,11.39,0,0,1,243.29,27C249.72,27,255.71,32.34,254.41,40.51Zm-17.59-3.95h12.9a6.49,6.49,0,0,0-6.3-4.91A6.64,6.64,0,0,0,236.82,36.56Z'/>
                <path className='cls-1' d='M280.81,27.44v22.4h-5.22v-3a9.5,9.5,0,0,1-7.51,3.43c-6.25,0-10.9-4.78-10.9-11.64S261.83,27,268.08,27a9.5,9.5,0,0,1,7.51,3.43v-3Zm-5.22,11.2a6.63,6.63,0,0,0-6.6-6.9c-3.82,0-6.51,3.08-6.51,6.9s2.69,6.91,6.51,6.91A6.64,6.64,0,0,0,275.59,38.64Z'/>
                <path className='cls-1' d='M284.45,38.64a11.68,11.68,0,0,1,22.45-4.47l-4.82,1.65a6.65,6.65,0,0,0-5.95-4c-3.91,0-6.47,3-6.47,6.82a6.5,6.5,0,0,0,12.59,2.56L306.94,43A11.47,11.47,0,0,1,296,50.28,11.34,11.34,0,0,1,284.45,38.64Z'/>
                <path className='cls-1' d='M331.82,36.86v13h-5.21V37.68a5.52,5.52,0,0,0-5.73-5.86,5.69,5.69,0,0,0-5.78,6V49.84h-5.21V17.27h5.21V30.35A9.29,9.29,0,0,1,322.27,27C327.44,27,331.82,30.65,331.82,36.86Z'/>
                <path className='cls-1' d='M92.28,29h0V17.27H87.07V49.84h5.21V48.25h0a11.76,11.76,0,0,0,6.38,1.81,12.07,12.07,0,0,0,4.39-.81A11.67,11.67,0,0,0,103,28a12.16,12.16,0,0,0-4.36-.8A11.65,11.65,0,0,0,92.28,29h0m5.77,16.43A6.42,6.42,0,0,1,92.28,42a7.26,7.26,0,0,1,0-6.74,6.42,6.42,0,0,1,5.77-3.45,6.62,6.62,0,0,1,6.6,6.82A6.62,6.62,0,0,1,98.05,45.46Z'/>
                <path className='cls-1' d='M123.67,38.64a11.81,11.81,0,1,1,11.81,11.64A11.46,11.46,0,0,1,123.67,38.64Zm11.81,6.82a6.62,6.62,0,0,0,6.6-6.82,6.6,6.6,0,1,0-13.2,0A6.59,6.59,0,0,0,135.48,45.46Z'/>
                <path className='cls-1' d='M149.89,38.64a11.82,11.82,0,1,1,11.82,11.64A11.47,11.47,0,0,1,149.89,38.64Zm11.82,6.82a6.62,6.62,0,0,0,6.6-6.82,6.6,6.6,0,1,0-13.2,0A6.59,6.59,0,0,0,161.71,45.46Z'/>
                <circle className='cls-2' cx='35.94' cy='35.94' r='35.94'/>
                <path className='cls-3' d='M43.22,28.47,41.46,33a6.6,6.6,0,0,1,3,5.64,6.38,6.38,0,1,1-12.76,0A6.36,6.36,0,0,1,37.83,32l1.65-4.6A11,11,0,0,0,26.71,38.29h0V49.84h5V48a11.7,11.7,0,0,0,6.38,1.82,11.26,11.26,0,0,0,5.11-21.37Z'/>
                <path className='cls-3' d='M26.69,27.92a15.51,15.51,0,0,1,5-3.41V17.27h-5Z'/>
              </g>
            </g>
          </svg>
        </LogoWrapper>
        <Typography variant='p' component='small'>Version: {packageInfo?.version}</Typography>
      </>
    </TooltipWrapper>
  );
}
