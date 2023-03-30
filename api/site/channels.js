import axios from 'axios';

const CHANNEL_API_PATH = 'management/site/v1'
const DELIVERY_CHANNEL_API_PATH = 'delivery/site/v1'

/**
 * Get all core channels from Delivery API
 * @param {string} environment
 * @returns
 */
export const getAllCoreChannels = async (environment) => {
  console.groupCollapsed('Site Management API: getAllCoreChannels()')
  console.log('environment:', environment)

  const url = `https://${environment}.bloomreach.io/${DELIVERY_CHANNEL_API_PATH}/channels`
  console.log('url:', url)
  const response = await axios(url, {
    method: 'GET',
  })

  console.log('response', response.data)
  console.groupEnd()

  return response
}

/**
 * Get all channels
 * @param {string} environment
 * @param {string} xAuthToken
 * @returns
 */
export const getAllChannels = async (environment, xAuthToken) => {
    console.groupCollapsed('Site Management API: getAllChannels()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)

    const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels`, {
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
 * Get channel
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
export const getChannel = async (environment, xAuthToken, channelId) => {
    console.groupCollapsed('Site Management API: getChannel()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('channelId:', channelId)

    const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}`, {
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
 * Add channel to project
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} projectId
 * @param {string} channelId
 * @returns
 */
export const addChannelToProject = async (environment, xAuthToken, projectId, channelId) => {
    console.groupCollapsed('Site Management API: getChannel()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('projectId:', projectId)
    console.log('channelId:', channelId)

    const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels`, {
        method: 'POST',
        headers: {
            'x-auth-token': xAuthToken
        },
        data: {
            branch: projectId,
            branchOf: channelId,
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response
}

/**
 * Deletes a channel branch
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
export const deleteChannelBranch = async (environment, xAuthToken, channelId) => {
  console.groupCollapsed('Site Management API: getChannel()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('channelId:', channelId)

  const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}`, {
      method: 'DELETE',
      headers: {
          'x-auth-token': xAuthToken
      }
  })

  console.log('response', response.data)
  console.groupEnd()

  return response
}
