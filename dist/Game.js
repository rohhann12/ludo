"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const uuid_1 = require("uuid");
const message_1 = require("./message");
class Game {
    constructor() {
        this.allGames = new Map();
        this.player1 = null;
        this.player2 = null;
        this.player3 = null;
        this.player4 = null;
        this.allGames = new Map();
        this.gotiyan = "";
        this.gotiyanNumber = 4;
        this.referenceGoti = [];
        this.gameid = "";
        this.otp = 0;
    }
    otpgenerator() {
        const otp = Math.floor(Math.random() * 10000);
        console.log(otp);
        return otp;
    }
    startGame(socket) {
        this.gameid = (0, uuid_1.v1)();
        this.otp = this.otpgenerator();
        this.player1 = socket;
        this.allGames.set(`${this.otp}`, 1); // Using OTP as key
        socket.send(JSON.stringify({
            type: message_1.GAME_INIT,
            message: "Game created successfully",
            otp: this.otp
        }));
    }
    joinGame(socket, otp) {
        const exists = this.allGames.has(`${otp}`);
        if (!exists) {
            socket.send(JSON.stringify({
                type: message_1.JOIN_GAME,
                message: "Invalid OTP or game not found"
            }));
        }
        else {
            // Add player logic
            if (!this.player2) {
                this.player2 = socket;
            }
            else if (!this.player3) {
                this.player3 = socket;
            }
            else if (!this.player4) {
                this.player4 = socket;
            }
            else {
                socket.send(JSON.stringify({
                    type: message_1.JOIN_GAME,
                    message: "Game is full"
                }));
                return;
            }
            socket.send(JSON.stringify({
                type: message_1.JOIN_GAME,
                message: "Successfully joined the game"
            }));
        }
    }
    removeUer(socket) {
    }
    leave(socket) {
    }
}
exports.Game = Game;
