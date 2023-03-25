import axios from 'axios';

const FOLDER_API_PATH = 'management/folder/v1'

/**
 * Get the details of a specific folder.
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} folderPath
 * @param {string} depth
 * @returns {<Promise>}
 */
export const getFolder = async (environment, xAuthToken, folderPath, depth = '5') => {
    console.groupCollapsed('API: getFolder()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('folderPath:', folderPath)
    console.log('depth:', depth)

    const response = await axios(`https://${environment}.bloomreach.io/${FOLDER_API_PATH}/${folderPath}?depth=${depth}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response;
}

/**
 * Create a folder or update, if the folder already exists
 * @param {string} environment
 * @param {string} xAuthToken
 * @param {string} folderType
 * @param {string} channel
 * @param {string} folderPath
 * @param {string} displayName
 * @param {Array<string>=} opt_allowedDocumentTypes
 * @param {Array<string>=} opt_allowedFolderTypes
 * @returns {<Promise>}
 */
export const createOrUpdateFolder = async (
    environment,
    xAuthToken,
    folderType,
    channel,
    folderPath,
    displayname,
    opt_allowedDocumentTypes,
    opt_allowedFolderTypes
) => {
    const allowedDocumentTypes = opt_allowedDocumentTypes ? opt_allowedDocumentTypes : ["ALL_DOCUMENTS"]
    const allowedFolderTypes = opt_allowedFolderTypes ? opt_allowedFolderTypes : ["FOLDER"]

    console.groupCollapsed('API: createOrUpdateFolder()')
    console.log('environment:', environment)
    console.log('xAuthToken:', xAuthToken)
    console.log('folderType:', folderType)
    console.log('channel:', channel)
    console.log('folderPath:', folderPath)
    console.log('displayname:', displayname)
    console.log('allowedDocumentTypes:', allowedDocumentTypes)
    console.log('allowedFolderTypes:', allowedFolderTypes)

    const response = await axios(`https://${environment}.bloomreach.io/${FOLDER_API_PATH}/${folderPath}`, {
        method: 'PUT',
        headers: {
            'x-auth-token': xAuthToken,
            'Content-Type': 'application/json'
        },
        data: {
            "type": folderType,
            "path": folderPath,
            "displayName": displayname,
            "channel": channel,
            "allowedDocumentTypes": allowedDocumentTypes,
            "allowedFolderTypes": allowedFolderTypes
        }
    })

    console.log('response', response.data)
    console.groupEnd()

    return response;
}
