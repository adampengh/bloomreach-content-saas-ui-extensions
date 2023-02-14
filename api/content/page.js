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
export const getPage = async (environment, xAuthToken, channel, path, projectId = 'core') => {
    const response = await axios(`https://${environment}.bloomreach.io/${CONTENT_API_PATH}/project/${projectId}/channel/${channel}/page/${path}`, {
        method: 'GET',
        headers: {
          'x-auth-token': xAuthToken
        }
      })

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
export const putPage = async (environment, xAuthToken, projectId, channel, path, pageData) => {
    const url = `https://${environment}.bloomreach.io/${CONTENT_API_PATH}/project/${projectId}/channel/${channel}/page/${path}`
    const response = await axios(url, {
        method: 'PUT',
        headers: {
            'x-auth-token': xAuthToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: pageData
    })

    return response
}
