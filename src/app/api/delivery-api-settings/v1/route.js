import axios from 'axios'
import { headers } from 'next/headers'

const API_PATH = 'management/deliveryapisettings/v1/deliveryApiV2'

export async function GET() {
  return Response.json({ name: 'GET' })
}

export async function POST() {
  const options = { status: 405, statusText: 'Method Not Allowed' }
  const blob = new Blob([JSON.stringify(options, null, 2)], {
    type: 'application/json',
  });
  const response = new Response(blob, options)
  return response
}

export async function PATCH(request) {
  console.log('PATCH')

  const body = await request.json()
  console.log('body', body)

  // Get Headers for X-AUTH-TOKEN and X-Resource-Version
  const headersList = headers()
  const xAuthToken = headersList.get('x-auth-token')
  console.log('xAuthToken', xAuthToken)
  if (!xAuthToken) {
    const response = { status: 401 }
    const blob = new Blob([JSON.stringify(response, null, 2)], {
      type: 'application/json',
    });
    return new Response(blob, response)
  }

  const xResourceVersion = headersList.get('x-resource-version')
  console.log('xResourceVersion', xResourceVersion)
  if (!xResourceVersion) {
    const response = { status: 400, statusText: 'Bad Request', message: 'x-resource-version header is required'}
    const blob = new Blob([JSON.stringify(response, null, 2)], {
      type: 'application/json',
    });
    return new Response(blob, response)
  }

  // Get Query Parameters for environment
  const searchParams = request.nextUrl.searchParams
  const environment = searchParams.get('environment')
  if (!environment) {
    const response = { status: 406, statusText: 'Not Acceptable', message: 'environment query parameter is required'}
    const blob = new Blob([JSON.stringify(response, null, 2)], {
      type: 'application/json',
    });
    return new Response(blob, response)
  }


  const response = await axios(`https://${environment}.bloomreach.io/${API_PATH}/`, {
    method: 'PATCH',
    headers: {
      'x-auth-token': xAuthToken,
      'x-resource-version': xResourceVersion,
    },
    data: body
  })
    .then(response => {
      console.log('response', response.data)
      const res = { status: 200 }
      const blob = new Blob([JSON.stringify(body, null, 2)], {
        type: 'application/json',
      });
      return { blob, res }
    })
    .catch(error => {
      console.error(error.response)
      console.error(error.response.data)
      const res = { status: error.response.status }
      const blob = new Blob([JSON.stringify(error, null, 2)], {
        type: 'application/json',
      });
      return { blob, res }
    })

  console.log('response', response)

  const finalResponse = new Response(response.blob, response.res)
  return finalResponse
}
