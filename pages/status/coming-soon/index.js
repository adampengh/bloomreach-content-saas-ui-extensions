import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Divider,
  OutlinedInput,
  IconButton,
  Tooltip,
  FormControl,
  InputAdornment,
  Button,
  styled,
  FormHelperText
} from '@mui/material';

import SidebarLayout from 'src/layouts/SidebarLayout';

import Head from 'next/head';
import Logo from 'src/components/LogoSign';

import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  ({ theme }) => `
  display: flex;
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(6)};
`
);

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
  font-size: ${theme.typography.pxToRem(75)};
`
);

const TypographyH3 = styled(Typography)(
  ({ theme }) => `
  color: ${theme.colors.alpha.black[50]};
`
);

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
`
);

const ButtonNotify = styled(Button)(
  ({ theme }) => `
    margin-right: -${theme.spacing(1)};
`
);

function StatusComingSoon() {
  const calculateTimeLeft = () => {
    const difference = +new Date(`2023`) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <Box textAlign="center" px={3}>
        <TypographyH1 variant="h1">{timeLeft[interval]}</TypographyH1>
        <TypographyH3 variant="h3">{interval}</TypographyH3>
      </Box>
    );
  });

  return (
    <>
      <Head>
        <title>Status - Coming Soon</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center" mb={3}>
              <Container maxWidth="xs">
                <Typography variant="h1" sx={{ mt: 4, mb: 2 }}>
                  Coming Soon
                </Typography>
                <Typography
                  variant="h3"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{ mb: 4 }}
                >
                  We're working on implementing this feature!
                </Typography>
              </Container>
            </Box>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default StatusComingSoon;

StatusComingSoon.getLayout = function getLayout(page) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
