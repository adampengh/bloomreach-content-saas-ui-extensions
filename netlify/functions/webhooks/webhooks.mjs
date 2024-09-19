import io from 'socket.io-client';

export default async (req, context) => {
  const socketUrl = Netlify.env.get("NEXT_PUBLIC_WEBSOCKET_URL");

  console.log('method', req.method)

  if (req.method !== 'POST') {
    return Response.json({ status: 405, error: 'Method not allowed, only POST requests are allowed' }, { status: 405 })
  }

  const data = await req.json()
  console.log('data', data);

  if (socketUrl) {
    const socket = io(socketUrl);
    socket.emit('webhookApiRouteHandler', data);
    return Response.json(data);
  }

};

// const handler = async (event) => {
//   console.log('event', event)
//   if (event.httpMethod !== 'POST') {
//     return {
//       statusCode: 405,
//       body: JSON.stringify({ message: 'Method Not Allowed' }),
//       headers: {
//         'Allow': 'POST'
//       }
//     }
//   }

//   const socketUrl = Netlify.env.get('NEXT_PUBLIC_WEBSOCKET_URL');
//   const socket = io(socketUrl);

//   let body = event.body
//   console.log('body', body)

//   socket.emit('webhookApiRouteHandler', body);

//   return {
//     statusCode: 200,
//     body: body
//   }
// }

// module.exports = { handler }
