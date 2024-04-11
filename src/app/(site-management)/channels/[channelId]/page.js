import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ChannelDetails from 'src/modules/Channels/ChannelDetails';

export const metadata = {
  title: 'Channel Details'
}

export default function Page({ params }) {
  const { channelId } = params

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Channel Details"
        />
      </PageTitleWrapper>
      <ChannelDetails channelId={channelId} />
    </>
  )
}
