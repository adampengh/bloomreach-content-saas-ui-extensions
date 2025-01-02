// API
import {
  getPage,
  putPage,
} from 'bloomreach-content-management-apis'

export const copyPage = async (appConfiguration, sourceProjectId, targetProjectId, pagePath) => {
  console.group('COPY PAGE')
  console.log('pagePath', pagePath)
  console.log('sourceProjectId', sourceProjectId)
  console.log('targetProjectId', targetProjectId)

  const regex = /(?:\/content\/documents\/)([a-zA-Z0-9-]*)(?:\/)(pages\/.*)/;
  const matches = pagePath.match(regex)
  const channel = matches[1]
  const path = matches[2]

  console.log('channel:', channel)
  console.log('path:', path)

  const {
    environment: sourceEnvironment,
    xAuthToken: sourceXAuthToken,
  } = appConfiguration.environments.source

  const {
    environment: targetEnvironment,
    xAuthToken: targetXAuthToken,
  } = appConfiguration.environments.target

  // Get the page from the source channel
  // If the page is not part of the project, get the page data from 'core'
  const pageData = await getPage(sourceEnvironment, sourceXAuthToken, channel, path, sourceProjectId)
    .then(response => response.data)
    .catch(async (err) => {
      if (err.response.status === 404) {
        return await getPage(sourceEnvironment, sourceXAuthToken, channel, path, 'core')
          .then(response => response.data)
      } else {
        console.error('Get page error', err);
      }
    })

  // Put Page into Target Channel
  if (pageData) {
    await putPage(targetEnvironment, targetXAuthToken, targetProjectId, channel, path, pageData)
      .then(() => {
        // Page Copied
        console.log('Page Copied')
      })
    .catch(async (err) => {
      if (err.response.status === 409) {
        console.warn('Page already exists in this project. Getting X-Resource-Version and trying again.')
        await getPage(targetEnvironment, targetXAuthToken, channel, path, targetProjectId)
          .then(async (response) => {
            const xResourceVersion = response.headers['x-resource-version']
            await putPage(targetEnvironment, targetXAuthToken, targetProjectId, channel, path, pageData, xResourceVersion)
              .then(() => {
                // Page Copied
                console.log('Page Copied')
              })
              .catch((err) => console.error('Failed to putPage existing page:', err))
            })
      } else {
        console.error('Failed to putPage:', err.response);
      }
    })
  }

  console.groupEnd()
}
