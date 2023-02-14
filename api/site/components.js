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
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/component_groups/${componentGroup}/components/`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}

export const getComponent = async (environment, xAuthToken, channelId, componentGroup, componentName) => {
    console.log('GET COMPONENT')
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/component_groups/${componentGroup}/components/${componentName}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}

export const putComponent = async (environment, xAuthToken, channelId, componentGroup, componentName, data) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/component_groups/${componentGroup}/components/${componentName}`, {
        method: 'PUT',
        headers: {
            'x-auth-token': xAuthToken
        },
        data: data
    })

    return response
}

export const deleteComponent = async (environment, xAuthToken, channelId, componentGroup, componentName) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/component_groups/${componentGroup}/components/${componentName}`, {
        method: 'DELETE',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}
