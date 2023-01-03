import React, { useState } from 'react';
import Head from 'next/head';

import SidebarLayout from 'src/layouts/SidebarLayout';

import PageHeader from 'src/content/Pages/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Checkbox,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import Footer from 'src/components/Footer';

function Pages() {
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };



  return (
    <>
      <Head>
        <title>Pages List</title>
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
            <List
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  All Pages
                </ListSubheader>
              }
            >
              {[0, 1, 2, 3].map((value) => {
                const labelId = `checkbox-list-label-${value}`;
                return (
                  <ListItem
                    key={value}
                    disablePadding
                  >
                    <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                    </ListItemButton>
                  </ListItem>
                )
              })}


              {/* <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Starred" />
                </ListItemButton>
              </List> */}
            </List>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}


const PageList = () => {

}


Pages.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Pages;
