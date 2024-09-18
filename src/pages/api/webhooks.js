import io from 'socket.io-client';

export default function handler(req, res) {
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL || 'https';
  const hostname = process.env.NEXT_PUBLIC_HOSTNAME || 'localhost';
  const port = process.env.NEXT_PUBLIC_PORT || 3000;
  const socket = io(`${protocol}://${hostname}:${port}`);

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
