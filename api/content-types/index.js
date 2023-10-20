import axios from 'axios';

const CONTENT_TYPE_API_PATH = 'management/contenttypes/v1'

/**
 * Get all content types
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} opt_projectId
 */
export const getAllContentTypes = async (environment, xAuthToken, opt_projectId) => {
  const projectId = opt_projectId || 'development';

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
  const projectId = opt_projectId || 'development';
  const contentType = contentTypeName.replace(':', '-')

  console.groupCollapsed('API: getContentType()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('projectId:', projectId)
  console.log('contentTypeName:', contentTypeName)
  console.log('contentType:', contentType)

  const response = await axios(`https://${environment}.bloomreach.io/${CONTENT_TYPE_API_PATH}/${projectId}/${contentType}`, {
    method: 'GET',
    headers: {
      'x-auth-token': xAuthToken
    }
  })

  console.log('response', response.data)
  console.groupEnd()

  return response
}


export const putContentType = async (environment, xAuthToken, contentTypeName, data, opt_xResourceVersion) => {
  const contentType = contentTypeName.replace(':', '-')

  console.groupCollapsed('API: putContentType()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('contentTypeName:', contentTypeName)
  console.log('contentType:', contentType)
  console.log('data:', data)
  console.log('opt_xResourceVersion:', opt_xResourceVersion)

  const url = `https://${environment}.bloomreach.io/${CONTENT_TYPE_API_PATH}/development/${contentType}`
  console.log('url:', url)
  const response = await axios(url, {
    method: 'PUT',
    headers: {
      'x-auth-token': xAuthToken,
      'accept': 'application/json',
      'content-type': 'application/json',
      ...(opt_xResourceVersion && {'x-resource-version': opt_xResourceVersion}),
    },
    data: data
  })

  console.log('response', response.data)
  console.groupEnd()

  return response

}


export const deleteContentType = async (environment, xAuthToken, contentType) => {
  contentType = contentType.replace(':', '-')

  console.groupCollapsed('API: deleteContentType()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('contentType:', contentType)

  const response = await axios(`/api/contenttypes/${contentType}?environment=${environment}`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': xAuthToken
    }
  })

  console.log('response', response.data)
  console.groupEnd()

  return response
}
