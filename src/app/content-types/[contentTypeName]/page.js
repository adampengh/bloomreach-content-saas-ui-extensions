import ContentTypeDetailComponent from 'src/components/ContentTypes/ContentTypeDetail'

export const metadata = {
  title: 'Content Type Details'
}

export default function Page({ params }) {
  const { contentTypeName } = params

  return (
    <>
      <ContentTypeDetailComponent contentTypeName={contentTypeName} />
    </>
  )
}
