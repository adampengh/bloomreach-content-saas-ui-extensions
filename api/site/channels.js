import axios from 'axios';

const CHANNEL_API_PATH = 'management/site/v1'

/**
 * Get all channels
 * @param {string} environment
 * @param {string} xAuthToken
 * @returns
 */
export const getAllChannels = async (environment, xAuthToken) => {
    const response = await axios(`https://${environment}.bloomreach.io/${CHANNEL_API_PATH}/channels`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}
