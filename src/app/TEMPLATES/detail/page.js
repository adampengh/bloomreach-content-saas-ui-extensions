// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

// Modules
import { DetailTemplateModule } from 'src/modules/Templates/detail';

export const metadata = {
  title: 'Detail Page'
}

export default async function DetailTemplate() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Detail Page'
        />
      </PageTitleWrapper>
      <DetailTemplateModule />
    </>
  )
}
