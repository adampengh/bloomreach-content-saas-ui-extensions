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
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/routes/${layout}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}

export const putLayout = async (environment, xAuthToken, channelId, layout, data) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/routes/${layout}`, {
        method: 'PUT',
        headers: {
            'x-auth-token': xAuthToken
        },
        data: data
    })

    return response
}

export const deleteLayout = async (environment, xAuthToken, channelId, layout) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/routes/${layout}`, {
        method: 'DELETE',
        headers: {
            'x-auth-token': xAuthToken
        }
    })
m
    return response
}
