'use client'

import {
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import styled from '@emotion/styled'

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

const NotFoundComponent = () => {
  return (
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
  )
}

export default NotFoundComponent;
