import { getMarkdown } from 'src/lib/markdown';

import MarkdownContent from 'src/modules/MarkdownContent';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

export const metadata = {
  title: 'Getting Started'
}

async function getMarkdownContent() {
  const markdown = await getMarkdown('GETTING-STARTED.md');
  return markdown;
}

export default async function GettingStarted() {
  const markdown = await getMarkdownContent();

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Getting Started'
        />
      </PageTitleWrapper>
      <MarkdownContent markdown={markdown} />
    </>
  )
}
