const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const setupWebSocket = require('./server/websocket');

const app = express();
const PORT = 3001;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

setupWebSocket(wss);
app.use(express.static('public'));

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
