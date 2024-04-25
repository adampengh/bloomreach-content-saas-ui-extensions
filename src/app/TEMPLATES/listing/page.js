import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

// Modules
import { ListingTemplateModule } from 'src/modules/Templates/listing';

export const metadata = {
  title: 'Listing Page'
}

export default async function TemplatesListing() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Listing Page'
        />
      </PageTitleWrapper>
      <ListingTemplateModule />
    </>
  )
}
