import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ChannelsComponent from 'src/components/Channels';

export const metadata = {
  title: 'Channels'
}

export default function Configuration() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Channels"
        />
      </PageTitleWrapper>
      <ChannelsComponent />
    </>
  )
}
