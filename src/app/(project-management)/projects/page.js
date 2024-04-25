
import PageTitle from 'src/components/PageTitle'
import PageTitleWrapper from 'src/components/PageTitleWrapper'
import { ProjectsListModule } from 'src/modules'

export const metadata = {
  title: 'Projects'
}

export default function Page() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Projects'
        />
      </PageTitleWrapper>
      <ProjectsListModule />
    </>
  )
}
