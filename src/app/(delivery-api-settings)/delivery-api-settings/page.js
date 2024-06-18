
import PageTitle from 'src/components/PageTitle'
import PageTitleWrapper from 'src/components/PageTitleWrapper'

import { DeliveryApiSettingsModule } from 'src/modules'

export const metadata = {
  title: 'Delivery API Settings'
}

export default function DeliveryApiSettings() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Delivery API Settings'
        />
      </PageTitleWrapper>
      <DeliveryApiSettingsModule />
    </>
  )
}
