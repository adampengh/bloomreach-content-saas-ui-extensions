import { getMarkdown } from 'src/lib/markdown';

import MarkdownContent from 'src/modules/MarkdownContent';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

export const metadata = {
  title: 'Contributing'
}

async function getMarkdownContent() {
  const markdown = await getMarkdown('CONTRIBUTING.md');
  return markdown;
}

export default async function ReleaseNotes() {
  const markdown = await getMarkdownContent();

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Contributing"
        />
      </PageTitleWrapper>
      <MarkdownContent markdown={markdown} />
    </>
  )
}
