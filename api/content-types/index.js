import axios from 'axios';

const CONTENT_TYPE_API_PATH = 'management/contenttypes/v1'

/**
 * Get all content types
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} opt_projectId
 */
export const getAllContentTypes = async (environment, xAuthToken, opt_projectId) => {
    const projectId = opt_projectId || 'core';
    const response = await axios(`https://${environment}.bloomreach.io/${CONTENT_TYPE_API_PATH}/${projectId}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response
}
