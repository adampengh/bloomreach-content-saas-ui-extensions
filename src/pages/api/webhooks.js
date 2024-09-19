import io from 'socket.io-client';
import { NEXT_PUBLIC_WEBSOCKET_URL } from './lib/constants';

export default function handler(req, res) {
  const socketUrl = NEXT_PUBLIC_WEBSOCKET_URL;

  if (!socketUrl) {
    res.status(500).json({ status: 500, error: 'Websocket URL is null', socketUrl });
    return;
  }

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
