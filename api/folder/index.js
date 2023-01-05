import axios from 'axios';

const FOLDER_API_PATH = 'management/folder/v1'

/**
 * Get the details of a specific folder.
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} folderPath
 * @param {string} depth
 * @returns {response}
 */
export const getFolder = async (environment, xAuthToken, folderPath, depth = '5') => {
    const response = await axios(`https://${environment}.bloomreach.io/${FOLDER_API_PATH}/${folderPath}?depth=${depth}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    return response;
}

/**
 * Create a folder or update if the folder already exists
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} folderPath
 * @returns
 */
export const createOrUpdateFolder = async (environment, xAuthToken, folderPath, displayname) => {
    const response = await axios(`https://${environment}.bloomreach.io/${FOLDER_API_PATH}/${folderPath}`, {
        method: 'PUT',
        headers: {
            'x-auth-token': xAuthToken,
            'Content-Type': 'application/json'
        },
        data: {
            "type": "folder",
            "path": folderPath,
            "displayName": displayname,
            "locale": "en",
            "allowedDocumentTypes": [],
            "allowedFolderTypes": []
        }
    })

    return response;
}
