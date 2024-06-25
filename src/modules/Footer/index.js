import { Box, Typography, styled } from '@mui/material';
import { config } from 'src/theme/schemes/BloomreachTheme';

const FooterWrapper = styled(Box)(
  ({ theme }) => `
    align-content: center;
    align-items: center;
    background: ${theme.palette.common.white};
    bottom: 0;
    display: ${config.footer.height != 0 ? 'flex' : 'none'};
    height: 68px;
    left: ${config.sidebar.width};
    margin-top: ${theme.spacing(4)};
    position: fixed;
    right: 0;
    z-index: 10;
`
);

const Footer = () => {
  return (
    <FooterWrapper as='footer' className='footer-wrapper'>
      <Box
        px={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems='center'
        alignContent='center'
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent='space-between'
      >
        <Box>
          <Typography variant='subtitle1'>
            &copy; { new Date().getFullYear() } - Bloomreach
          </Typography>
        </Box>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
