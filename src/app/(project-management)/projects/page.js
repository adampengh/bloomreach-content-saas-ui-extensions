import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ProjectsComponent from 'src/modules/Projects';

export const metadata = {
  title: 'Projects'
}

export default function Page() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Projects"
        />
      </PageTitleWrapper>
      <ProjectsComponent />
    </>
  )
}
