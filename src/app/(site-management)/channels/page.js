import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ChannelsComponent from 'src/modules/Channels';

export const metadata = {
  title: 'Channels'
}

export default function Page() {
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
