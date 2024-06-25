import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { TranslationsModule } from 'src/modules';

export const metadata = {
  title: 'Translations'
}

export default function Page() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Translations'
        />
      </PageTitleWrapper>
      <TranslationsModule />
    </>
  )
}
