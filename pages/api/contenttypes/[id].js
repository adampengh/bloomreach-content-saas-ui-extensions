import axios from 'axios'

const CONTENT_TYPE_API_PATH = 'management/contenttypes/v1'

export default async function contentTypes(req, res) {
  const { query, method, headers } = req
  const contentTypeName = query.id
  const environment = query.environment
  const xAuthToken = headers['x-auth-token']

  switch (method) {
    case 'GET':
      console.log('GET CONTENT TYPE')
      // Get data from your brX
      await axios(`https://${environment}.bloomreach.io/${CONTENT_TYPE_API_PATH}/development/${contentTypeName}`, {
        method: 'GET',
        headers: {
          'x-auth-token': xAuthToken
        }
      })
        .then(response => {
          res.status(200).json(response.data)
        })
        .catch(error => {
          console.error(error)
          res.status(404).json({ error: error })
        })
      break
    case 'PUT':
      console.log('PUT CONTENT TYPE')
      // Update or create data in your database
      res.status(200).json({ status: 200 })
      break
    case 'DELETE':
      console.log('DELETE CONTENT TYPE')
      await axios(`https://${environment}.bloomreach.io/${CONTENT_TYPE_API_PATH}/development/${contentTypeName}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': xAuthToken
        }
      })
        .then(response => {
          console.log(response.data)
          res.status(200).json(response.data)
        })
        .catch(error => {
          console.error(error.response)
          console.error(error.response.data)
          res.status(error.response.status).json({ error: error })
        })
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

