import { Suspense } from 'react';

import ConfigurationModule from 'src/modules/Configuration';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

export const metadata = {
  title: 'Configuration'
}

export default function Page() {
  return (
    <Suspense>
      <PageTitleWrapper>
        <PageTitle
          heading='Configuration'
          subHeading='Configuration used throughout the application'
        />
      </PageTitleWrapper>
      <ConfigurationModule />
    </Suspense>
  )
}
