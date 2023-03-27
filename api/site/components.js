import axios from 'axios';

const SITE_MANAGEMENT_API_PATH = 'management/site/v1'

/**
 * Get all components
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
export const getAllComponents = async (environment, xAuthToken, channelId, componentGroup) => {
    console.groupCollapsed('API: getAllComponents()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('channelId:', channelId)
    console.log('componentGroup:', componentGroup)

    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/component_groups/${componentGroup}/components/`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response
}

export const getComponent = async (environment, xAuthToken, channelId, componentGroup, componentName) => {
    console.groupCollapsed('API: getComponent()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('channelId:', channelId)
    console.log('componentGroup:', componentGroup)
    console.log('componentName:', componentName)

    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/component_groups/${componentGroup}/components/${componentName}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response
}

export const putComponent = async (environment, xAuthToken, channelId, componentGroup, componentName, data, opt_xResourceVersion) => {
    console.groupCollapsed('API: putComponent()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('channelId:', channelId)
    console.log('componentGroup:', componentGroup)
    console.log('componentName:', componentName)
    console.log('data:', data)
    console.log('opt_xResourceVersion:', opt_xResourceVersion)

    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/component_groups/${componentGroup}/components/${componentName}`, {
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

export const deleteComponent = async (environment, xAuthToken, channelId, componentGroup, componentName) => {
    console.groupCollapsed('API: deleteComponent()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('channelId:', channelId)
    console.log('componentGroup:', componentGroup)
    console.log('componentName:', componentName)

    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/component_groups/${componentGroup}/components/${componentName}`, {
        method: 'DELETE',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response
}
