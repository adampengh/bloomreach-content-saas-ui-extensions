
import PageTitle from 'src/components/PageTitle'
import PageTitleWrapper from 'src/components/PageTitleWrapper'

import { WebhooksListingModule } from 'src/modules'

export const metadata = {
  title: 'Webhooks'
}

export default async function WebhooksListing() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle heading='Webhooks' />
      </PageTitleWrapper>
      <WebhooksListingModule />
    </>
  )
}
