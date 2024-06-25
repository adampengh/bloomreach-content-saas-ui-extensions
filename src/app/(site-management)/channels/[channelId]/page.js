import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { ChannelDetailsModule } from 'src/modules';

export const metadata = {
  title: 'Channel Details'
}

export default function Page({ params }) {
  const { channelId } = params

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Channel Details'
        />
      </PageTitleWrapper>
      <ChannelDetailsModule channelId={channelId} />
    </>
  )
}
