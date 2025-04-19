module.exports = function (wss) {
  let leaderboardData = [];

  function broadcast(message) {
    const data = JSON.stringify(message);
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(data);
      }
    });
  }

  wss.on('connection', (ws) => {
    console.log("✅ New WebSocket connection");

    // Send initial leaderboard data to the new client
    ws.send(JSON.stringify({ type: 'init', data: leaderboardData }));

    ws.on('message', (message) => {
      try {
        const msg = JSON.parse(message);

        switch (msg.type) {
          case 'update':
            leaderboardData = msg.data;
            broadcast({ type: 'update', data: leaderboardData });
            break;

          case 'show':
            broadcast({ type: 'show' });
            break;

          case 'hide':
            broadcast({ type: 'hide' });
            break;

          case 'reset':
            leaderboardData = [];
            broadcast({ type: 'reset' });
            break;

          default:
            console.log("⚠️ Unknown message type:", msg.type);
        }
      } catch (err) {
        console.error("❌ Failed to parse message:", err);
      }
    });
  });
};
