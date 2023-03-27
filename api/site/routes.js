import axios from 'axios';

const SITE_MANAGEMENT_API_PATH = 'management/site/v1'

/**
 * Get all routes
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} channelId
 * @returns
 */
export const getAllRoutes = async (environment, xAuthToken, channelId) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/routes`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}

export const getRoute = async (environment, xAuthToken, channelId, route) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/routes/${route}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}

export const putRoute = async (environment, xAuthToken, channelId, route, data, opt_xResourceVersion) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/routes/${route}`, {
        method: 'PUT',
        headers: {
            'x-auth-token': xAuthToken,
            ...(opt_xResourceVersion && {'x-resource-version': opt_xResourceVersion}),
        },
        data: data
    })

    return response
}

export const deleteRoute = async (environment, xAuthToken, channelId, route) => {
    const response = await axios(`https://${environment}.bloomreach.io/${SITE_MANAGEMENT_API_PATH}/channels/${channelId}/routes/${route}`, {
        method: 'DELETE',
        headers: {
            'x-auth-token': xAuthToken
        }
    })
m
    return response
}
