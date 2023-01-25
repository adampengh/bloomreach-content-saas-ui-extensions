import SidebarLayout from 'src/layouts/SidebarLayout';
import Head from 'next/head';

export default function Overview() {
  return (
    <Head>
      <title>Bloomreach Content SaaS UI Extensions</title>
    </Head>
  );
}

Overview.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
