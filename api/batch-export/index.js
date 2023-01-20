import axios from 'axios';


const EXPORT_API_PATH = 'management/content-export/v1'


export const requestAnExport = async (environment, xAuthToken, projectId,
                                      dataTypes = ["resourcebundle", "page", "resourcebundle", "folder"],
                                      sourcePath ) => {
    const url = `https://${environment}.bloomreach.io/${EXPORT_API_PATH}/`
    console.log(url)
    console.log(dataTypes)
    console.log(sourcePath)
    const response = await axios(url, {
        method: 'POST', headers: {
            'x-auth-token': xAuthToken
        }, data: {
            "dataTypes": dataTypes,
            "sourcePath": sourcePath ,
            "branch": projectId,
        }
    })
    return response;
}

export const getOperationDetails = async (environment, xAuthToken, operation_id) => {
    var config = {
        method: 'get',
        url: `https://${environment}.bloomreach.io/${EXPORT_API_PATH}/operations/${operation_id}`,
        headers: {
            'x-auth-token': xAuthToken,
        }
    };

    const response = await axios(config)
    return response;
}
