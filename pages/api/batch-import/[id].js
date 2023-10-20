
import axios from 'axios'

const EXPORT_API_PATH = 'management/content-import/v1'

export default async function batchImport(req, res) {
  const { query, method, headers } = req
  console.log('method', method)

  const projectId = query.id
  console.log('projectId', projectId)
  const environment = query.environment
  console.log('environment', environment)
  const xAuthToken = headers['x-auth-token']
  console.log('xAuthToken', xAuthToken)


  console.log('req', req)

  switch (method) {
    case 'GET':
      console.log('GET BATCH IMPORT')
      // Get data in your database
      res.status(200).json({ status: 200 })
      break
    case 'PUT':
      console.log('PUT BATCH IMPORT')
      // Update or create data in your database
      res.status(200).json({ status: 200 })
      break
    case 'POST':
      console.log('POST BATCH IMPORT')
      // const formData = await req.formData()
      // if (formData) {
      //   console.log('formData', formData)
      //   console.log('formData.get("file")', formData.get('file'))

      //   const formDataToSend = new FormData()
      //   formDataToSend.append('file', formData.get('file'))
      // }
      // await axios(`https://${environment}.bloomreach.io/${EXPORT_API_PATH}/project/${projectId}`, {
      //   method: 'POST',
      //   headers: {
      //     'x-auth-token': xAuthToken
      //   }
      // })
      //   .then(response => {
      //     console.log(response.data)
      //     res.status(200).json(response.data)
      //   })
      //   .catch(error => {
      //     console.error(error.response)
      //     console.error(error.response.data)
      //     res.status(error.response.status).json({ error: error })
      //   })

      res.status(200).json({ status: 200 })
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

