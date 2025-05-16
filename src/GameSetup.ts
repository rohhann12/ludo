import {WebSocket} from "ws";
import { v1 as uuidv1 } from 'uuid';
import { GAME_INIT, JOIN} from "./message";
export class Game{
    private player1:WebSocket|null
    private player2:WebSocket|null
    private player3:WebSocket|null
    private player4:WebSocket|null
    private allGames =new Map<number, string>();
    private board:Map<WebSocket,number[]>;
    private gameid:string
    private otp:number
    private count:number
    private turn:WebSocket | null
    private diceValue:number
    constructor(){
        this.player1=null
        this.player2=null
        this.player3=null
        this.player4=null
        this.allGames=new Map()
        this.diceValue=0
        this.gameid=""
        this.otp=0
        this.board=new Map()
        this.count=0;
        this.turn=null
    }

    private otpgenerator(){
        this.otp=Math.floor(Math.random()*10000)
        console.log(this.otp)
        return this.otp

    }
    public diceRoll(){
        this.diceValue= Math.floor(Math.random() * 6) + 1;
        return this.diceValue
    }
    public gotiKholna(gotiIndex:number,socket:WebSocket){
        // agr khuli hui h sari toh move
        // @ts-ignore
        socket=this.turnChecker()
        const whichPlayerMap=this.board.get(socket)
        const move=whichPlayerMap?.find(number=>{
            if(number===gotiIndex){
                return number+1; //khol di by increasing uska index value
            }
        })
    }
    public startGame(socket: WebSocket) {
        this.gameid = uuidv1();
        this.otp = this.otpgenerator();
        this.player1 = socket;
        this.allGames.set(this.otp,this.gameid); // OTP as key
 // Using OTP as key
        this.board.set(socket,[0,0,0,0]); //board init
        socket.send(JSON.stringify({
            type: GAME_INIT,
            message: "Game created successfully",
            otp: this.otp
        }));
    }

    public joinGame(socket: WebSocket, otp: number) {
        console.log(this.allGames)
        const exists = this.allGames.has(otp);
        console.log(exists)
        if (!exists) {
            socket.send(JSON.stringify({
                type: JOIN,
                message: "Invalid OTP or game not found"
            }));
        } else {
            // Add player logic
            if (!this.player2) {
                this.player2 = socket;
            this.board.set(this.player2,[0,0,0,0]); //board init
            } else if (!this.player3) {
                this.player3 = socket;            
                this.board.set(this.player3,[0,0,0,0]); //board init
            } else if (!this.player4) {
                this.player4 = socket
                this.board.set(this.player4,[0,0,0,0]); //board init
            } else {
                socket.send(JSON.stringify({
                    type: JOIN,
                    message: "Game is full"
                }));
                return;
            }

            socket.send(JSON.stringify({
                type: JOIN,
                message: "Successfully joined the game"
            }));
        }
    }

    public makeMove(movement:number,gotiIndex:number){
        this.diceRoll()
        if(movement!==this.diceValue){
            console.log("not correct steps")
        }
        this.turnChecker()
        // @ts-ignore
        const move=this.board.get(this.turn)
        console.log(move)
        const gotiMovement=move![gotiIndex]
        if(gotiMovement===0){
            console.log("khuli ni hai abhi")
            return;
        }else if(this.diceValue==6 || this.diceValue===1){
            // @ts-ignore
            this.gotiKholna(gotiIndex,this.turn)
        }else {
          const gotiMove=gotiMovement+movement
        }
        console.log(gotiMovement)
        // logic to check if the game is over or not
        this.count++;
    }       

    public turnChecker(){
        if(this.count%4===0){
            this.turn=this.player1
        }
        if(this.count%4===1){
            this.turn=this.player2
        }
        if(this.count%4===2){
            this.turn=this.player3
        }
        if(this.count%4===3){
            this.turn=this.player4
        }
        return this.turn 
    }
    
}