import io from 'socket.io-client';

export default function handler(req, res) {
  const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';
  const socket = io(socketUrl);

  // Process a POST request
  if (req.method === 'POST') {
    // Get the request body
    const data = req.body

    // Emit the data to the socket
    socket.emit('webhookApiRouteHandler', data);

    // Return the data
    res.status(200).json(data)
  } else {
    res.status(405).json({ status: 405, error: 'Method not allowed, only POST requests are allowed' })
  }
}
