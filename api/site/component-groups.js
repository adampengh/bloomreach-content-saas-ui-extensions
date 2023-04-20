import axios from 'axios';

const SITE_MANAGEMENT_API_PATH = 'management/site/v1'

/**
 * Get all component groups
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
export const getAllComponentGroups = async (environment, xAuthToken, channelId) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/component_groups`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}

export const getComponentGroup = async (environment, xAuthToken, channelId, componentGroup) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/component_groups/${componentGroup}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}

export const createComponentGroup = async (environment, xAuthToken, channelId, componentGroup, data) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/component_groups/${componentGroup}`, {
        method: 'PUT',
        headers: {
            'x-auth-token': xAuthToken
        },
        data: data
    })

    return response
}

export const deleteComponentGroup = async (environment, xAuthToken, channelId, componentGroup) => {
    console.groupCollapsed('API: deleteComponentGroup()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('channelId:', channelId)
    console.log('componentGroup:', componentGroup)

    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/component_groups/${componentGroup}`, {
        method: 'DELETE',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response
}
