module.exports = function (wss) {
  let leaderboardData = [];
  let colorConfig = {}; // New: Store latest color config

  function broadcast(message) {
    const data = JSON.stringify(message);
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });
  }

  wss.on('connection', (ws) => {
    console.log("✅ New WebSocket connection");

    // Send current leaderboard and color config to the new client
    ws.send(JSON.stringify({ type: 'init', data: leaderboardData }));
    if (Object.keys(colorConfig).length > 0) {
      ws.send(JSON.stringify({ type: 'color-config', colors: colorConfig }));
    }

    ws.on('message', (message) => {
      try {
        const msg = JSON.parse(message);

        switch (msg.type) {

          case 'background':
            broadcast({ type: 'background', url: msg.url });
            break;

          case 'update':
            leaderboardData = msg.data;
            broadcast({ type: 'update', data: leaderboardData });
            break;

          case 'color-config':
            colorConfig = msg.colors || {};
            broadcast({ type: 'color-config', colors: colorConfig });
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
