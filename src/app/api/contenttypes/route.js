import axios from 'axios'
import { headers } from 'next/headers'

const CONTENT_TYPE_API_PATH = 'management/contenttypes/v1'


export async function GET() {
  return Response.json({ name: 'GET' })
}


export async function POST() {
  const options = { status: 405, statusText: 'Method Not Allowed' }
  const blob = new Blob([JSON.stringify(options, null, 2)], {
    type: "application/json",
  });
  const response = new Response(blob, options)
  return response
}


export async function DELETE(request) {
  console.log('DELETE CONTENT TYPE')

  // Get Headers for X-AUTH-TOKEN
  const headersList = headers()
  const xAuthToken = headersList.get('x-auth-token')
  console.log('xAuthToken', xAuthToken)
  if (!xAuthToken) {
    const response = { status: 401 }
    const blob = new Blob([JSON.stringify(response, null, 2)], {
      type: "application/json",
    });
    return new Response(blob, response)
  }

  // Get Query Parameters for environment and projectId
  const searchParams = request.nextUrl.searchParams
  const environment = searchParams.get('environment')
  if (!environment) {
    const response = { status: 406, statusText: 'Not Acceptable', message: 'environment query parameter is required'}
    const blob = new Blob([JSON.stringify(response, null, 2)], {
      type: "application/json",
    });
    return new Response(blob, response)
  }

  const contentTypeName = searchParams.get('contentTypeName')
  if (!contentTypeName) {
    const response = { status: 406, statusText: 'Not Acceptable', message: 'projectId query parameter is required'}
    const blob = new Blob([JSON.stringify(response, null, 2)], {
      type: "application/json",
    });
    return new Response(blob, response)
  }


  const response = await axios(`https://${environment}.bloomreach.io/${CONTENT_TYPE_API_PATH}/development/${contentTypeName}`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': xAuthToken
    }
  })
    .then(response => {
      console.log('response', response.data)
      const res = { status: 200 }
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });
      return { blob, res }
    })
    .catch(error => {
      console.error(error.response)
      console.error(error.response.data)
      const res = { status: error.response.status }
      const blob = new Blob([JSON.stringify(error, null, 2)], {
        type: "application/json",
      });
      return { blob, res }
    })

  console.log('response', response)
  const finalResponse = new Response(response.blob, response.res)
  return finalResponse
}
