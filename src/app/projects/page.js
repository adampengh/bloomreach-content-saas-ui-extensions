
import PageTitle from 'src/components/PageTitle'
import PageTitleWrapper from 'src/components/PageTitleWrapper'
import { ProjectsListModule } from './ProjectsListModule'

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
