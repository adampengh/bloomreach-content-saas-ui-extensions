import { headers } from 'next/headers'
import axios from 'axios'

// API

const CONTENT_API_PATH = 'management/content/v1';

export async function GET() {
  return Response.json({ name: 'GET' })
}

export async function POST(request) {
  console.log('UNLINK CONTENT TRANSLATION')

  // Get Headers for X-AUTH-TOKEN
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

  // Build request body
  const body = await request.json()
  const { environment, source } = body
  console.log('environment', environment)
  console.log('source', source)

  const response = await axios(
    `https://${environment}.bloomreach.io/${CONTENT_API_PATH}/translation/unlink`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        'x-auth-token': xAuthToken,
      },
      data: [source]
    },
  )
    .then(response => {
      console.log('response', response.data)
      const res = { status: 200 }
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json',
      });
      return { blob, res }
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        const res = { status: error.response.status }
        const blob = new Blob([JSON.stringify(error.response.data, null, 2)], {type: 'application/json'});
        return { blob, res }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('error.request', error.request);
        const res = { status: 400 }
        const blob = new Blob([JSON.stringify(res, null, 2)], {type: 'application/json'});
        return { blob, res }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        const res = { status: 400 }
        const blob = new Blob([JSON.stringify(res, null, 2)], {type: 'application/json'});
        return { blob, res }
      }
    })


  // console.log('response', response)
  const finalResponse = new Response(response.blob, response.res)
  return finalResponse
}
