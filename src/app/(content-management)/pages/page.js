import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PagesComponent from 'src/modules/Pages';

export const metadata = {
  title: 'Pages'
}

export default function Page() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Pages'
        />
      </PageTitleWrapper>
      <PagesComponent />
    </>
  )
}
