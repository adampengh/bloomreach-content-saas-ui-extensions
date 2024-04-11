'use client'

import { Box, Container, Typography } from '@mui/material';
import { MainContent, TopWrapper } from './styles';

const ComingSoonComponent = () => {
  return (
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
  );
}

export default ComingSoonComponent;
