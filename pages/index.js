import {
  Box,
  styled
} from '@mui/material';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Head from 'next/head';

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

export default function Overview() {
  return (
    <OverviewWrapper>
      <Head>
        <title>UI Extensions</title>
      </Head>
    </OverviewWrapper>
  );
}

Overview.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
