import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';

import HierarchicalList from 'src/components/HierarchicalList';
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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from 'src/components/Footer';

function HierarchicalListPage() {
  return (
    <>
      <Head>
        <title>Hierarchical List - Components</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Hierarchical List"
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
              <CardHeader title="Basic Example" />
              <Divider />
              <CardContent>
                <HierarchicalList />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

HierarchicalListPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default HierarchicalListPage;
