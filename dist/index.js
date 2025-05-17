"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameSetup_1 = require("./GameSetup");
const message_1 = require("./message");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const game = new GameSetup_1.Game();
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        try {
            const parsed = JSON.parse(data.toString());
            if (parsed.action === message_1.ACTION) {
                game.startGame(ws);
            }
            else if (parsed.action === message_1.JOIN) {
                game.joinGame(ws, Number(parsed.otp));
            }
            else if (parsed.action === message_1.ROLL) {
                game.diceRoll(ws);
            }
            else if (parsed.action === message_1.MAKE_MOVE) {
                game.makeMove(ws, parsed.move, parsed.gotiIndex);
            }
            else {
                ws.send(JSON.stringify({ error: 'Unknown action type' }));
            }
        }
        catch (err) {
            ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
    });
    ws.send('something');
});
