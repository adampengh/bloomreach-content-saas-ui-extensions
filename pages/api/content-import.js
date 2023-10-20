const EXPORT_API_PATH = 'management/content-import/v1'

export default async function handler(req, res) {
  const { headers, query } = req

  const environment = query.environment
  const xAuthToken = headers['x-auth-token']
  const projectId = query.projectId
  console.log('environment', environment)
  console.log('xAuthToken', xAuthToken)
  console.log('projectId', projectId)


  const body = req.body
  console.log('body', body)

  const formData = new FormData()
  formData.append('file', body)
  console.log('formData', formData)


  const response = await fetch(`https://${environment}.bloomreach.io/${EXPORT_API_PATH}/projects/${projectId}`, {
    method: 'POST',
    headers: {
      'x-auth-token': xAuthToken,
      'Content-Type': 'multipart/form-data'
    },
    body: formData
  })

  const responsejson = await response.json()
  console.log('responsejson', responsejson)

  res.status(200).json({ 'status': 'ok' })
}
