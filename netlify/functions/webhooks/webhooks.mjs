import io from 'socket.io-client';

export default async (req, context) => {
  const socketUrl = Netlify.env.get('NEXT_PUBLIC_WEBSOCKET_URL');

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
