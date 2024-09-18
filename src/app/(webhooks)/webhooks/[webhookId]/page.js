
import PageTitle from 'src/components/PageTitle'
import PageTitleWrapper from 'src/components/PageTitleWrapper'

import { WebhooksDetailsModule } from 'src/modules'

export const metadata = {
  title: 'Webhook Details'
}

export default async function WebhookDetails({ params: { webhookId } }) {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle heading='Webhook Details' />
      </PageTitleWrapper>
      <WebhooksDetailsModule webhookId={webhookId} />
    </>
  )
}
