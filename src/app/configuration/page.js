import ConfigurationComponent from 'src/components/configuration';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

export const metadata = {
  title: 'Configuration'
}

export default function Configuration() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Configuration"
          subHeading="Configuration used throughout the application"
        />
      </PageTitleWrapper>
      <ConfigurationComponent />
    </>
  )
}
