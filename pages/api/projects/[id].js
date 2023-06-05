import axios from 'axios'

const PROJECTS_API_PATH = 'management/projects/v1'

export default async function contentTypes(req, res) {
  const { query, method, headers } = req
  const projectId = query.id
  const environment = query.environment
  const xAuthToken = headers['x-auth-token']

  switch (method) {
    case 'GET':
      console.log('GET PROJECT')
      // Get data in your database
      res.status(200).json({ status: 200 })
      break
    case 'PUT':
      console.log('PUT PROJECT')
      // Update or create data in your database
      res.status(200).json({ status: 200 })
      break
    case 'DELETE':
      console.log('DELETE PROJECT')
      await axios(`https://${environment}.bloomreach.io/${PROJECTS_API_PATH}/${projectId}`, {
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

