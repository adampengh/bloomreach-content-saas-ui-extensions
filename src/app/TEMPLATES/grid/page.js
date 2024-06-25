import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

// Modules
import { GridTemplateModule } from 'src/modules/Templates/grid';

export const metadata = {
  title: 'Grid Page'
}

export default async function TemplatesGrid() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Grid Page'
        />
      </PageTitleWrapper>
      <GridTemplateModule />
    </>
  )
}
