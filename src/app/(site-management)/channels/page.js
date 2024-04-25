
// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

// Modules
import { ChannelListModule } from 'src/modules';

export const metadata = {
  title: 'Channels'
}

export default function Page() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Channels'
        />
      </PageTitleWrapper>
      <ChannelListModule />
    </>
  )
}
