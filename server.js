const { createServer } = require('http')
const express = require('express')
const next = require('next')
const socketIO = require('socket.io')

const dev = process.env.NEXT_PUBLIC_NODE_ENV !== 'production'
const hostname = process.env.NEXT_PUBLIC_HOSTNAME || 'localhost'
const port = process.env.NEXT_PUBLIC_PORT || 3000

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = socketIO(httpServer);

  io.on('connection', (socket) => {
    socket.on('webhookApiRouteHandler', (data) => {
      io.emit('webhookExecution', data)
    })
  })

  server.all('*', (req, res) => {
    return handler(req, res)
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Server Ready! 🚀 `);
    });
})
