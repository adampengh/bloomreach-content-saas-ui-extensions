import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ComponentsPage from 'src/modules/ComponentsPage';
import ComponentsPageErrorContent from 'src/modules/ComponentsPage/ComponentsPageErrorContent';

export const metadata = {
  title: 'Component Details'
}

export default function Page({ params }) {
  const { params: urlParams } = params
  const [channelId, componentGroup, componentName] = urlParams

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Component Details'
        />
      </PageTitleWrapper>

      {urlParams.length < 3 ? (
        <ComponentsPageErrorContent />
      ) : (
        <ComponentsPage channelId={channelId} componentGroup={componentGroup} componentName={componentName} />
      )}
    </>
  )
}
