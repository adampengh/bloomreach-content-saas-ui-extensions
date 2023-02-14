import axios from 'axios';

const CHANNEL_API_PATH = 'management/site/v1'

/**
 * Validate the x-auth-token
 * @param {string} environment
 * @param {string} xAuthToken
 * @returns
 */
export const validateToken = async (environment, xAuthToken) => {
    const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels`, {
        method: 'HEAD',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}
