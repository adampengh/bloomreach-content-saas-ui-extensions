import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ConvertPageLayoutComponent from 'src/components/Pages/ConvertPageLayout';

export const metadata = {
  title: 'Convert Page Layout'
}

export default function Page() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Convert Page Layout'
        />
      </PageTitleWrapper>
      <ConvertPageLayoutComponent />
    </>
  )
}
