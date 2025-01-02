// API
import {
  getResourceBundle,
  putResourceBundle,
} from 'bloomreach-content-management-apis'

export const copyResourceBundle = async (appConfiguration, sourceProjectId, targetProjectId, resourceBundlePath) => {
  console.group('COPY RESOURCE BUNDLE')
  console.log('sourceProjectId', sourceProjectId)
  console.log('targetProjectId', targetProjectId)
  console.log('resourceBundlePath', resourceBundlePath)

  const {
    environment: sourceEnvironment,
    xAuthToken: sourceXAuthToken,
  } = appConfiguration.environments.source

  const {
    environment: targetEnvironment,
    xAuthToken: targetXAuthToken,
  } = appConfiguration.environments.target


  // Get the Resource Bundle from the Source Channel
  const resourceBundleData = await getResourceBundle(sourceEnvironment, sourceXAuthToken, resourceBundlePath, sourceProjectId)
    .then(response => response.data)
    .catch(async (err) => {
      console.error('Get Resource Bundle error', err);
    })
  console.log('resourceBundleData', resourceBundleData)

  // Put Resource Bundle into Target Environment
  if (resourceBundleData) {
    await putResourceBundle(targetEnvironment, targetXAuthToken, targetProjectId, resourceBundlePath, resourceBundleData)
      .then(() => {
        // Document Copied
        console.log('Resource Bundle Copied')
      })
      .catch(async (err) => {
        if (err.response.status === 409) {
          console.warn('Resource Bundle already exists in this project. Getting X-Resource-Version and trying again.')
          await getResourceBundle(targetEnvironment, targetXAuthToken, resourceBundlePath, targetProjectId)
            .then(async (response) => {
              const xResourceVersion = response.headers['x-resource-version']
              await putResourceBundle(targetEnvironment, targetXAuthToken, targetProjectId, resourceBundlePath, resourceBundleData, xResourceVersion)
                .then(() => {
                  // Document Copied
                  console.log('Resource Bundle Copied')
                })
                .catch((err) => {
                  console.error('Failed to putResourceBundle existing resource bundle:', err)
              })
            })
        } else {
          console.error('Failed to putResourceBundle:', err.response);
        }
      })
  }

  console.groupEnd()
}
