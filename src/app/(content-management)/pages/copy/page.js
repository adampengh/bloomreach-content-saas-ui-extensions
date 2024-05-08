import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PagesCopyModule from 'src/modules/Pages/copy';

export const metadata = {
  title: 'Copy Pages'
}

export default function Page() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Copy Pages'
        />
      </PageTitleWrapper>
      <PagesCopyModule />
    </>
  )
}
