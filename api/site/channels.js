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
 * Put channel
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @param {object} data
 * @param {string=} opt_xResourceVersion
 * @returns
 */
export const putChannel = async (environment, xAuthToken, channelId, data, opt_xResourceVersion) => {
  console.groupCollapsed('Site Management API: putChannel()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('channelId:', channelId)
  console.log('data:', data)
  console.log('opt_xResourceVersion:', opt_xResourceVersion)

  const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}`, {
      method: 'PUT',
      headers: {
          'x-auth-token': xAuthToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(opt_xResourceVersion && {'x-resource-version': opt_xResourceVersion}),
      },
      data: data
  })

  console.log('response', response)
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
    console.groupCollapsed('Site Management API: addChannelToProject()')
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
  console.groupCollapsed('Site Management API: deleteChannelBranch()')
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

/**
 * Get channel fieldgroups
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
export const getChannelFieldGroups = async (environment, xAuthToken, channelId) => {
  console.groupCollapsed('Site Management API: getChannelFieldGroups()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('channelId:', channelId)

  const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/fieldgroups`, {
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
 * Put channel fieldgroups
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @param {string} fieldGroup
 * @param {object} data
 * @param {string=} opt_xResourceVersion
 * @returns
 */
export const putChannelFieldGroups = async (environment, xAuthToken, channelId, fieldGroup, data, opt_xResourceVersion) => {
  console.groupCollapsed('Site Management API: putChannelFieldGroups()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('channelId:', channelId)
  console.log('fieldGroup:', fieldGroup)
  console.log('data:', data)
  console.log('opt_xResourceVersion:', opt_xResourceVersion)

  const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/fieldgroups/${fieldGroup}`, {
      method: 'PUT',
      headers: {
          'x-auth-token': xAuthToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(opt_xResourceVersion && {'x-resource-version': opt_xResourceVersion}),
      },
      data: data
  })

  console.log('response', response.data)
  console.groupEnd()

  return response
}

/**
 * Delete channel fieldgroups
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @param {string} fieldGroup
 * @returns
 */
export const deleteChannelFieldGroups = async (environment, xAuthToken, channelId, fieldGroup) => {
  console.groupCollapsed('Site Management API: deleteChannelFieldGroups()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('channelId:', channelId)
  console.log('fieldGroup:', fieldGroup)

  const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/fieldgroups/${fieldGroup}`, {
      method: 'DELETE',
      headers: {
          'x-auth-token': xAuthToken
      }
  })

  console.log('response', response.data)
  console.groupEnd()

  return response
}




/**
 * Get channel parameters
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
export const getChannelParameters = async (environment, xAuthToken, channelId) => {
  console.groupCollapsed('Site Management API: getChannelParameters()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('channelId:', channelId)

  const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/parameters`, {
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
 * Get channel parameter
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @param {string} parameter
 * @returns
 */
export const getChannelParameter = async (environment, xAuthToken, channelId, parameter) => {
  console.groupCollapsed('Site Management API: getChannelParameter()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('channelId:', channelId)
  console.log('parameter:', parameter)

  const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/parameters/${parameter}`, {
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
 * Put channel parameter
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @param {string} parameter
 * @param {object} data
 * @param {string=} opt_xResourceVersion
 * @returns
 */
export const putChannelParameter = async (environment, xAuthToken, channelId, parameter, data, opt_xResourceVersion) => {
  console.groupCollapsed('Site Management API: putChannelParameter()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('channelId:', channelId)
  console.log('parameter:', parameter)
  console.log('data:', data)
  console.log('opt_xResourceVersion:', opt_xResourceVersion)

  /** Sample data
   *
    {
      "name": "smAccountId",
      "valueType": "string",
      "required": true,
      "hidden": false,
      "overlay": false,
      "defaultValue": "",
      "displayName": "brSM Account ID RENAMED",
      "system": false,
      "config": null
    }
   */

  const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/parameters/${parameter}`, {
      method: 'PUT',
      headers: {
          'x-auth-token': xAuthToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(opt_xResourceVersion && {'x-resource-version': opt_xResourceVersion}),
      },
      data: data
  })

  console.log('response', response.data)
  console.groupEnd()

  return response
}

/**
 * Delete channel parameter
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @param {string} parameter
 * @returns
 */
export const deleteChannelParameter = async (environment, xAuthToken, channelId, parameter) => {
  console.groupCollapsed('Site Management API: deleteChannelFieldGroups()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('channelId:', channelId)
  console.log('parameter:', parameter)

  const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels/${channelId}/parameters/${parameter}`, {
      method: 'DELETE',
      headers: {
          'x-auth-token': xAuthToken
      }
  })

  console.log('response', response.data)
  console.groupEnd()

  return response
}
