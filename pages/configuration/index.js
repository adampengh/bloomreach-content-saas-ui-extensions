import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import PageTitle from 'src/components/PageTitle';

import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider
} from '@mui/material';
import Footer from 'src/components/Footer';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function Configuration() {
  return (
    <>
      <Head>
        <title>Configuration</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Configuration"
          subHeading="Components that are used to build interactive placeholders used for data collection from users."
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Input Fields" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '100ch' }
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField
                      required
                      id="outlined-required"
                      label="Environment"
                      defaultValue="https://pricesmart.bloomreach.io"
                    />
                    <TextField
                      required
                      id="outlined-required"
                      label="X-Auth-Token"
                    />
                    <TextField
                      required
                      id="outlined-required"
                      label="Channel"
                      defaultValue="shared-english"
                    />
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

Configuration.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Configuration;
