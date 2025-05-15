import { WebSocketServer } from 'ws';
import { Game } from './Game';
import { ACTION } from './message';

const wss = new WebSocketServer({ port: 8080 });
const game=new Game()
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
  try {
    const parsed = JSON.parse(data.toString());

    if (parsed.action === "ACTION") {
      game.startGame(ws);
    } else if (parsed.action === "JOIN") {
      game.joinGame(ws, Number(parsed.otp));
    } else {
      ws.send(JSON.stringify({ error: 'Unknown action type' }));
    }
  } catch (err) {
    ws.send(JSON.stringify({ error: 'Invalid message format' }));
  }
});


  ws.send('something');
});