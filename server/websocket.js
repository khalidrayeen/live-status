module.exports = function (wss) {
  let leaderboardData = [];
  let colorConfig = {};
  let bgUrl = '';
  let isVisible = false;

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

    // Send latest full state
    ws.send(JSON.stringify({ type: 'init', data: leaderboardData }));
    if (Object.keys(colorConfig).length > 0)
      ws.send(JSON.stringify({ type: 'color-config', colors: colorConfig }));
    if (bgUrl)
      ws.send(JSON.stringify({ type: 'background', url: bgUrl }));
    ws.send(JSON.stringify({ type: isVisible ? 'show' : 'hide' }));

    ws.on('message', (message) => {
      try {
        const msg = JSON.parse(message);

        switch (msg.type) {
          case 'background':
            bgUrl = msg.url;
            broadcast({ type: 'background', url: bgUrl });
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
            isVisible = true;
            broadcast({ type: 'show' });
            break;

          case 'hide':
            isVisible = false;
            broadcast({ type: 'hide' });
            break;

          case 'reset':
            leaderboardData = [];
            isVisible = false;
            bgUrl = '';
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
