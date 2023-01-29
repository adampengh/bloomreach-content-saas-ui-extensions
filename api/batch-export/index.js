import axios from 'axios';

const EXPORT_API_PATH = 'management/content-export/v1'

export const requestAnExport = async (environment, xAuthToken, projectId = 'core', dataTypes = ["resourcebundle", "page", "resourcebundle", "folder"], sourcePath) => {
    console.log(dataTypes)
    console.log(sourcePath)

    const response = await axios(`https://${environment}.bloomreach.io/${EXPORT_API_PATH}/`, {
        method: 'POST',
        headers: {
            'x-auth-token': xAuthToken
        },
        data: {
            "dataTypes": dataTypes,
            "sourcePath": `/content/documents/${sourcePath}`,
            "branch": projectId,
        }
    })

    return response;
}

export const getOperationDetails = async (environment, xAuthToken, operation_id) => {
    const response = await axios(`https://${environment}.bloomreach.io/${EXPORT_API_PATH}/operations/${operation_id}`, {
        method: 'GET',
        headers: {
            'x-auth-token': xAuthToken,
        }
    })

    return response;
}

export const downloadExportedFiles = async (environment, xAuthToken, operation_id) => {
    const response = await axios(`https://${environment}.bloomreach.io/${EXPORT_API_PATH}/operations/${operation_id}/files`, {
        method: 'GET',
        responseType: 'arraybuffer',
        headers: {
            'x-auth-token': xAuthToken,
            'accept': 'application/octet-stream'
        }
    })

    return response
}
