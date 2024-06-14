import styled from '@emotion/styled'
import Link from 'src/components/Link';

import {
  Tooltip,
  tooltipClasses,
} from '@mui/material';

export const StyledLogoWrapper = styled(Link)(
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

export const StyledLogoTooltipWrapper = styled(({ className, ...props }) => (
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
