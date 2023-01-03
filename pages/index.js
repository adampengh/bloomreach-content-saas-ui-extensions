import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled
} from '@mui/material';
import SidebarLayout from 'src/layouts/SidebarLayout';

import Link from 'src/components/Link';
import Head from 'next/head';

import Logo from 'src/components/LogoSign';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
`
);

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
