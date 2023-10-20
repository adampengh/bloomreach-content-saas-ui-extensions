import axios from 'axios';

const EXPORT_API_PATH = 'management/content-import/v1'

// export const requestImport = async (
//     environment,
//     xAuthToken,
//     projectId = 'core',
//     file
// ) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('fileName', file.name);

//   const response = await axios(`https://${environment}.bloomreach.io/${EXPORT_API_PATH}/project/${projectId}`, formData, {
//     method: 'POST',
//     headers: {
//       'content-type': 'multipart/form-data',
//       'x-auth-token': xAuthToken
//     }
//   })

//   return response;
// }

export const requestImport = async (
  environment,
  xAuthToken,
  projectId = 'core',
  file
) => {
  console.groupCollapsed('API: deleteContentType()')
  console.log('environment:', environment)
  console.log('xAuthToken:', xAuthToken)
  console.log('projectId:', projectId)
  console.log('file:', file)

  const formData = new FormData();
  formData.append('file', file);

  const response = await axios(`/api/batch-import/${projectId}?environment=${environment}`, {
    method: 'POST',
    headers: {
      'x-auth-token': xAuthToken,
      'content-type': 'multipart/form-data'
    },
    body: formData
  })

  console.log('response', response.data)
  console.groupEnd()

  return response;
}

export const getImportOperationStatus = async (environment, xAuthToken, operation_id) => {
  const response = await axios(`https://${environment}.bloomreach.io/${EXPORT_API_PATH}/operations/${operation_id}`, {
    method: 'GET',
    headers: {
      'x-auth-token': xAuthToken,
    }
  })

  return response;
}
