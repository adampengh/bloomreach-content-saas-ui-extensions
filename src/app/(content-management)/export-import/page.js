import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ExportImportModule from 'src/modules/ExportImport';

export const metadata = {
  title: 'Content Export/Import'
}

export default function Configuration() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Export & Import'
          subHeading='Batch Export & Import Operation'
        />
      </PageTitleWrapper>
      <ExportImportModule />
    </>
  )
}
