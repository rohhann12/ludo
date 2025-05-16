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
        this.diceValue = 0;
        this.gameid = "";
        this.otp = 0;
        this.board = new Map();
        this.count = 0;
        this.turn = null;
    }
    otpgenerator() {
        this.otp = Math.floor(Math.random() * 10000);
        console.log(this.otp);
        return this.otp;
    }
    diceRoll() {
        this.diceValue = Math.floor(Math.random() * 6) + 1;
        return this.diceValue;
    }
    gotiKholna(gotiIndex, socket) {
        // agr khuli hui h sari toh move
        // @ts-ignore
        socket = this.turnChecker();
        const whichPlayerMap = this.board.get(socket);
        const move = whichPlayerMap === null || whichPlayerMap === void 0 ? void 0 : whichPlayerMap.find(number => {
            if (number === gotiIndex) {
                return number + 1; //khol di by increasing uska index value
            }
        });
    }
    startGame(socket) {
        this.gameid = (0, uuid_1.v1)();
        this.otp = this.otpgenerator();
        this.player1 = socket;
        this.allGames.set(this.otp, this.gameid); // OTP as key
        // Using OTP as key
        this.board.set(socket, [0, 0, 0, 0]); //board init
        socket.send(JSON.stringify({
            type: message_1.GAME_INIT,
            message: "Game created successfully",
            otp: this.otp
        }));
    }
    joinGame(socket, otp) {
        console.log(this.allGames);
        const exists = this.allGames.has(otp);
        console.log(exists);
        if (!exists) {
            socket.send(JSON.stringify({
                type: message_1.JOIN,
                message: "Invalid OTP or game not found"
            }));
        }
        else {
            // Add player logic
            if (!this.player2) {
                this.player2 = socket;
                this.board.set(this.player2, [0, 0, 0, 0]); //board init
            }
            else if (!this.player3) {
                this.player3 = socket;
                this.board.set(this.player3, [0, 0, 0, 0]); //board init
            }
            else if (!this.player4) {
                this.player4 = socket;
                this.board.set(this.player4, [0, 0, 0, 0]); //board init
            }
            else {
                socket.send(JSON.stringify({
                    type: message_1.JOIN,
                    message: "Game is full"
                }));
                return;
            }
            socket.send(JSON.stringify({
                type: message_1.JOIN,
                message: "Successfully joined the game"
            }));
        }
    }
    makeMove(movement, gotiIndex) {
        this.diceRoll();
        if (movement !== this.diceValue) {
            console.log("not correct steps");
        }
        this.turnChecker();
        // @ts-ignore
        const move = this.board.get(this.turn);
        console.log(move);
        const gotiMovement = move[gotiIndex];
        if (gotiMovement === 0) {
            console.log("khuli ni hai abhi");
            return;
        }
        else if (this.diceValue == 6 || this.diceValue === 1) {
            // @ts-ignore
            this.gotiKholna(gotiIndex, this.turn);
        }
        else {
            const gotiMove = gotiMovement + movement;
        }
        console.log(gotiMovement);
        // logic to check if the game is over or not
        this.count++;
    }
    turnChecker() {
        if (this.count % 4 === 0) {
            this.turn = this.player1;
        }
        if (this.count % 4 === 1) {
            this.turn = this.player2;
        }
        if (this.count % 4 === 2) {
            this.turn = this.player3;
        }
        if (this.count % 4 === 3) {
            this.turn = this.player4;
        }
        return this.turn;
    }
}
exports.Game = Game;
