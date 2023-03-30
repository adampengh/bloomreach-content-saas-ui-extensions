import axios from 'axios';

const CONTENT_TYPE_API_PATH = 'management/contenttypes/v1'

/**
 * Get all content types
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} opt_projectId
 */
export const getAllContentTypes = async (environment, xAuthToken, opt_projectId) => {
    const projectId = opt_projectId || 'core';

    const response = await axios(`https://${environment}.bloomreach.io/${CONTENT_TYPE_API_PATH}/${projectId}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}

/**
 * Get a single content type
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} contentTypeName
 * @param {string} opt_projectId
 */
export const getContentType = async (environment, xAuthToken, contentTypeName, opt_projectId) => {
    const projectId = opt_projectId || 'core';
    const contentType = contentTypeName.replace(':', '-')

    const response = await axios(`https://${environment}.bloomreach.io/${CONTENT_TYPE_API_PATH}/${projectId}/${contentType}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}


export const putContentType = async (environment, xAuthToken, contentTypeName, data, opt_xResourceVersion) => {
  const contentType = contentTypeName.replace(':', '-')
  const response = await axios(`https://${environment}.bloomreach.io/${CONTENT_TYPE_API_PATH}/development/${contentTypeName}`, {
      method: 'GET',
      headers: {
          'x-auth-token': xAuthToken,
          ...(opt_xResourceVersion && {'x-resource-version': opt_xResourceVersion}),
      },
      data: data
  })

  return response
}
