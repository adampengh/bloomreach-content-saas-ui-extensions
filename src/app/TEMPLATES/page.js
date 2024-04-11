import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import TemplatePageComponent from 'src/modules/Templates';

export const metadata = {
  title: 'Templates'
}

export default async function Templates() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Templates"
        />
      </PageTitleWrapper>
      <TemplatePageComponent />
    </>
  )
}
