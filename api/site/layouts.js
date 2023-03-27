import axios from 'axios';

const SITE_MANAGEMENT_API_PATH = 'management/site/v1'

/**
 * Get all layouts
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
export const getAllLayouts = async (environment, xAuthToken, channelId) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/layouts`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}

export const getLayout = async (environment, xAuthToken, channelId, layout) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/layouts/${layout}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}

export const putLayout = async (environment, xAuthToken, channelId, layout, data, opt_xResourceVersion) => {
  console.log('opt_xResourceVersion:', opt_xResourceVersion)
  const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/layouts/${layout}`, {
      method: 'PUT',
      headers: {
          'x-auth-token': xAuthToken,
          ...(opt_xResourceVersion && {'x-resource-version': opt_xResourceVersion}),
      },
      data: data
  })

  return response
}

export const deleteLayout = async (environment, xAuthToken, channelId, layout) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/layouts/${layout}`, {
        method: 'DELETE',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}
