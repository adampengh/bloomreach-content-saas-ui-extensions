import axios from 'axios';

const SITE_MANAGEMENT_API_PATH = 'management/site/v1'

export const getAllMenus = async (environment, xAuthToken, channelId) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}

export const getMenu = async (environment, xAuthToken, channelId, menu) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}

export const putMenu = async (environment, xAuthToken, channelId, menu, data, opt_xResourceVersion) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}`, {
        method: 'PUT',
        headers: {
            'x-auth-token': xAuthToken,
            ...(opt_xResourceVersion && {'x-resource-version': opt_xResourceVersion}),
        },
        data: data
    })

    return response
}

export const getMenuItems = async (environment, xAuthToken, channelId, menu) => {
  console.groupCollapsed('API: getMenuItems()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('channelId:', channelId)
  console.log('menu:', menu)

  const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}/items`, {
      method: 'GET',
      headers: {
          'x-auth-token': xAuthToken
      }
  })

  console.log('response', response.data)
  console.groupEnd()

  return response
}

export const putMenuItems = async (environment, xAuthToken, channelId, menu, data, opt_xResourceVersion) => {
  console.groupCollapsed('API: getMenuItems()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('channelId:', channelId)
  console.log('menu:', menu)
  console.log('data:', data)
  console.log('opt_xResourceVersion:', opt_xResourceVersion)

  const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}/items`, {
      method: 'PUT',
      headers: {
          'x-auth-token': xAuthToken,
          ...(opt_xResourceVersion && {'x-resource-version': opt_xResourceVersion}),
      },
      data: data
  })

  console.log('response', response.data)
  console.groupEnd()

  return response
}

export const getMenuProperties = async (environment, xAuthToken, channelId, menu) => {
  const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}/properties`, {
      method: 'GET',
      headers: {
          'x-auth-token': xAuthToken
      },
  })

  return response
}

export const putMenuProperties = async (environment, xAuthToken, channelId, menu, data,opt_xResourceVersion) => {
  const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}/properties`, {
      method: 'PUT',
      headers: {
          'x-auth-token': xAuthToken,
          ...(opt_xResourceVersion && {'x-resource-version': opt_xResourceVersion}),
      },
      data: data
  })

  return response
}

export const deleteMenu = async (environment, xAuthToken, channelId, menu) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/menus/${menu}`, {
        method: 'DELETE',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}
