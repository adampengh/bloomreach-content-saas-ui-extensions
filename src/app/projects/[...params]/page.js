import ProjectDetails from 'src/components/Projects/ProjectDetails'

export const metadata = {
  title: 'Project Details'
}

export default function Page({ params }) {
  const [instance, projectId] = params.params
  console.log('PAGE:', instance, projectId)

  return (
    <>
      <ProjectDetails instance={instance} projectId={projectId} />
    </>
  )
}
