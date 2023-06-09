import { getMarkdown } from '/lib/markdown';

// Layout
import SidebarLayout from 'src/layouts/SidebarLayout';

// Modules
import MarkdownPage from 'modules/markdown/MarkdownPage'


function ReleaseNotes({markdown}) {
  return (
    <MarkdownPage
      markdown={markdown}
      title='Release Notes'
    />
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

ReleaseNotes.getLayout = function getLayout(page) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default ReleaseNotes;
