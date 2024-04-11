import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import DetailTemplateComponent from 'src/modules/Templates/DetailTemplate';

export const metadata = {
  title: 'Detail Page'
}

export default async function DetailTemplate() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Detail Page"
        />
      </PageTitleWrapper>
      <DetailTemplateComponent />
    </>
  )
}
