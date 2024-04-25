import ConfigurationComponent from 'src/modules/Configuration';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

export const metadata = {
  title: 'Configuration'
}

export default function Page() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Configuration'
          subHeading='Configuration used throughout the application'
        />
      </PageTitleWrapper>
      <ConfigurationComponent />
    </>
  )
}
