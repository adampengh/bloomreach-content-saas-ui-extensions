// API
import {
  getDocument,
  putDocument,
} from 'bloomreach-content-management-apis'

export const copyDocument = async (appConfiguration, sourceProjectId, targetProjectId, documentPath) => {
  console.group('COPY DOCUMENT')
  console.log('sourceProjectId', sourceProjectId)
  console.log('targetProjectId', targetProjectId)
  console.log('documentPath', documentPath)

  const {
    environment: sourceEnvironment,
    xAuthToken: sourceXAuthToken,
  } = appConfiguration.environments.source

  const {
    environment: targetEnvironment,
    xAuthToken: targetXAuthToken,
  } = appConfiguration.environments.target

  // Get the document from the source channel
  const documentData = await getDocument(sourceEnvironment, sourceXAuthToken, documentPath, sourceProjectId)
    .then(response => response.data)
    .catch(async (err) => {
      if (err.response.status === 404 || err.response.status === 400) {
        return await getDocument(sourceEnvironment, sourceXAuthToken, documentPath, 'core')
          .then(response => response.data)
      } else {
        console.error('Get document error', err);
      }
    })
  console.log('documentData', documentData)

  // Put Document into Target Environment
  if (documentData) {
    await putDocument(targetEnvironment, targetXAuthToken, targetProjectId, documentPath, documentData)
      .then(() => {
        // Document Copied
        console.log('Document Copied')
      })
      .catch(async (err) => {
        if (err.response.status === 409) {
          console.warn('Document already exists in this project. Getting X-Resource-Version and trying again.')
          await getDocument(targetEnvironment, targetXAuthToken, documentPath, targetProjectId)
            .then(async (response) => {
              const xResourceVersion = response.headers['x-resource-version']
              await putDocument(targetEnvironment, targetXAuthToken, targetProjectId, documentPath, documentData, xResourceVersion)
                .then(() => {
                  // Document Copied
                  console.log('Document Copied')
                })
                .catch((err) => {
                  console.error('Failed to putDocument existing document:', err)
              })
            })
        } else {
          console.error('Failed to putDocument:', err.response);
        }
      })
  }

  console.groupEnd()
}
