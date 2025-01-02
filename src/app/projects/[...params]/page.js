import { ProjectsDetailsModule } from './ProjectsDetailsModule'

export const metadata = {
  title: 'Project Details'
}

export default function Page({ params }) {
  const [instance, projectId] = params.params

  return (
    <>
      <ProjectsDetailsModule instance={instance} projectId={projectId} />
    </>
  )
}
