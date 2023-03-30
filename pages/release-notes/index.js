import Head from 'next/head';
import { getMarkdown } from '/lib/markdown';

// Layout
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import { Container } from '@mui/material';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';


function ReleaseNotes({markdown}) {
  return (
    <>
      <Head>
        <title>Release Notes</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle heading='Release Notes' />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <div dangerouslySetInnerHTML={{ __html: markdown.contentHtml }} />
      </Container>
    </>
  );
}

export async function getStaticProps() {
  const markdown = await getMarkdown('CHANGELOG.md');
  return {
    props: {
      markdown
    },
  };
}

export default ReleaseNotes;

ReleaseNotes.getLayout = function getLayout(page) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
