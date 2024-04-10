import { getMarkdown } from 'src/lib/markdown';

import MarkdownContent from 'src/components/MarkdownContent';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

export const metadata = {
  title: 'Release Notes'
}

async function getMarkdownContent() {
  const markdown = await getMarkdown('CHANGELOG.md');
  return markdown;
}

export default async function ReleaseNotes() {
  const markdown = await getMarkdownContent();

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Release Notes"
        />
      </PageTitleWrapper>
      <MarkdownContent markdown={markdown} />
    </>
  )
}
