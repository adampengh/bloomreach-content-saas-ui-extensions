import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ExportImport from 'src/components/ExportImport';

export const metadata = {
  title: 'Content Export/Import'
}

export default function Configuration() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Export & Import"
          subHeading="Batch Export & Import Operation"
        />
      </PageTitleWrapper>
      <ExportImport />
    </>
  )
}
