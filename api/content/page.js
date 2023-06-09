import axios from 'axios'

const CONTENT_API_PATH = 'management/content/v1'

/**
 * Get a page from either a project or core
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channel
 * @param {string} path
 * @param {string} projectId
 * @returns
 */
export const getPage = async (environment, xAuthToken, channel, path, projectId) => {
    console.groupCollapsed('API: getPage()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('channel:', channel)
    console.log('path:', path)
    console.log('projectId:', projectId)

    const response = await axios(`https://${environment}.bloomreach.io/${CONTENT_API_PATH}/project/${projectId}/channel/${channel}/page/${path}`, {
        method: 'GET',
        headers: {
          'x-auth-token': xAuthToken
        }
      })

    console.log('response', response.data)
    console.groupEnd()

    return response
}

/**
 * Put a page into a project (not core)
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} projectId
 * @param {string} channel
 * @param {string} path
 * @param {string} pageData
 * @returns
 */
export const putPage = async (environment, xAuthToken, projectId, channel, path, pageData, initialRequest) => {
    console.groupCollapsed('API: putPage()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('projectId:', projectId)
    console.log('channel:', channel)
    console.log('path:', path)
    console.log('pageData', pageData)
    console.log('initialRequest', initialRequest)

    const response = await axios(`https://${environment}.bloomreach.io/${CONTENT_API_PATH}/project/${projectId}/channel/${channel}/page/${path}`, {
        method: 'PUT',
        headers: {
            'x-auth-token': xAuthToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: pageData
    }).catch((error) => {
        if (error.response.status === 409 && initialRequest === true) {
            console.warn('Page already exists in this project. Deleting and trying again...')
            deletePage(environment, xAuthToken, projectId, channel, path)
            // API takes too long to recognize the page is actually deleted
            // putPage(environment, xAuthToken, projectId, channel, path, pageData, false)
        } else {
            console.error('Failed to putPage:', error.response);
        }
    })

    console.log('response', response)
    console.groupEnd()

    return response
}

/**
 * Put a page into a project (not core)
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} projectId
 * @param {string} channel
 * @param {string} path
 * @param {string} pageData
 * @returns
 */
export const deletePage = async (environment, xAuthToken, projectId, channel, path) => {
    console.groupCollapsed('API: deletePage()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('projectId:', projectId)
    console.log('channel:', channel)
    console.log('path:', path)

    const response = await axios(`https://${environment}.bloomreach.io/${CONTENT_API_PATH}/project/${projectId}/channel/${channel}/page/${path}`, {
        method: 'DELETE',
        headers: {
            'x-auth-token': xAuthToken,
            'Accept': 'application/json',
        }
    })

    console.log('response', response)
    console.groupEnd()

    return response
}
