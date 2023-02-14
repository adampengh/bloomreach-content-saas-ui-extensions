import {
  Box,
  Button,
  Container,
  Typography,
  styled
} from '@mui/material';
import Head from 'next/head';

import SidebarLayout from 'src/layouts/SidebarLayout';

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

function Status404() {
  return (
    <>
      <Head>
        <title>Status - 404</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center">
              <Typography variant="h2" sx={{ my: 2 }}>
                The page you are looking for doesn't exist.
              </Typography>
              <Button href="/" variant="contained">
                Go to homepage
              </Button>
            </Box>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default Status404;

Status404.getLayout = function getLayout(page) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
