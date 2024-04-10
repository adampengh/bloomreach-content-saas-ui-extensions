import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ListingTemplateComponent from 'src/components/Templates/ListingTemplate';

export const metadata = {
  title: 'Listing Page'
}

export default async function ListingTemplate() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Listing Page"
        />
      </PageTitleWrapper>
      <ListingTemplateComponent />
    </>
  )
}
