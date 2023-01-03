import Head from 'next/head';
import NextLink from 'next/link';

import SidebarLayout from 'src/layouts/SidebarLayout';

import PageHeader from 'src/content/Channels/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid, List, ListItem, ListItemText, ListItemAvatar, ListItemButton, Avatar, Button } from '@mui/material';
import Footer from 'src/components/Footer';

import AccountBalance from 'src/content/Dashboards/Crypto/AccountBalance';
import Wallets from 'src/content/Dashboards/Crypto/Wallets';
import AccountSecurity from 'src/content/Dashboards/Crypto/AccountSecurity';
import WatchList from 'src/content/Dashboards/Crypto/WatchList';

import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';

function Channels() {
  return (
    <>
      <Head>
        <title>Crypto Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <ListItem component="div">
                <ListItemButton>
                  <NextLink href="/" passHref>
                    <ListItemText primary="Shared English" secondary="Secondary Text" />
                  </NextLink>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <WorkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Aruba English" secondary="Jan 7, 2014" />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <BeachAccessIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Aruba English Mobile" secondary="July 20, 2014" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

Channels.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Channels;
