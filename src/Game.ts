import {WebSocket} from "ws";
import { v1 as uuidv1 } from 'uuid';
import { GAME_INIT, JOIN_GAME } from "./message";
export class Game{
     private player1:WebSocket|null
    private player2:WebSocket|null
    private player3:WebSocket|null
    private player4:WebSocket|null
    private allGames =new Map<string, number>();
    private gotiyan:string
    private gotiyanNumber:number
    private referenceGoti:string[]
    private gameid:string
    private otp:number
    constructor(){
        this.player1=null
        this.player2=null
        this.player3=null
        this.player4=null
        this.allGames=new Map()
        this.gotiyan=""
        this.gotiyanNumber=4
        this.referenceGoti=[]

        this.gameid=""
        this.otp=0
    }

    private otpgenerator(){
        const otp=Math.floor(Math.random()*10000)
        console.log(otp)
        return otp

    }
    public startGame(socket: WebSocket) {
    this.gameid = uuidv1();
    this.otp = this.otpgenerator();
    this.player1 = socket;
    this.allGames.set(this.gameid,this.otp); // Using OTP as key

    socket.send(JSON.stringify({
        type: GAME_INIT,
        message: "Game created successfully",
        otp: this.otp
    }));
    }

    public joinGame(socket: WebSocket, otp: number) {
        const exists = this.allGames.has(`${otp}`);

        if (!exists) {
            socket.send(JSON.stringify({
                type: JOIN_GAME,
                message: "Invalid OTP or game not found"
            }));
        } else {
            // Add player logic
            if (!this.player2) {
                this.player2 = socket;
            } else if (!this.player3) {
                this.player3 = socket;
            } else if (!this.player4) {
                this.player4 = socket;
            } else {
                socket.send(JSON.stringify({
                    type: JOIN_GAME,
                    message: "Game is full"
                }));
                return;
            }

            socket.send(JSON.stringify({
                type: JOIN_GAME,
                message: "Successfully joined the game"
            }));
        }
    }


    public removeUer(socket:WebSocket){

    }

    public leave(socket:WebSocket){

    }
}