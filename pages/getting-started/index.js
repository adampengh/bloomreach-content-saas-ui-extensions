import { getMarkdown } from '/lib/markdown';

// Layout
import SidebarLayout from 'src/layouts/SidebarLayout';

// Modules
import MarkdownPage from 'modules/markdown/MarkdownPage'


function GettingStarted({markdown}) {
  return (
    <MarkdownPage
      markdown={markdown}
      title='Getting Started'
    />
  );
}

export async function getStaticProps() {
  const markdown = await getMarkdown('GETTING-STARTED.md');
  return {
    props: {
      markdown
    },
  };
}

GettingStarted.getLayout = function getLayout(page) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default GettingStarted;
