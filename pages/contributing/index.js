import { getMarkdown } from '/lib/markdown';

// Layout
import SidebarLayout from 'src/layouts/SidebarLayout';

// Modules
import MarkdownPage from 'modules/markdown/MarkdownPage'


function Contributing({markdown}) {
  return (
    <MarkdownPage
      markdown={markdown}
      title='Contributing'
    />
  );
}

export async function getStaticProps() {
  const markdown = await getMarkdown('CONTRIBUTING.md');
  return {
    props: {
      markdown
    },
  };
}

Contributing.getLayout = function getLayout(page) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Contributing;
