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
    private playersJoined:WebSocket[]
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
        this.playersJoined=[]
    }
    // no need to check this
    private otpgenerator(){
        this.otp=Math.floor(Math.random()*10000)
        return this.otp

    }

    public diceRoll(socket: WebSocket) {
        this.turnChecker(socket)
        if(this.turn!==socket){
            socket.send(JSON.stringify({
                message:"you can roll the dice only once"
            }))
        }
        this.diceValue = Math.floor(Math.random() * 6) + 1;
        const turn=(this.turn)
        socket.send(JSON.stringify({
            type: "DICE_ROLLED",
            value: this.diceValue,
            turn: (this.turn===this.player1) ? "player1"
                    :(this.turn===this.player2) ? "player2"
                    :  (this.turn===this.player3) ? "player3"
                    :"player4"
        }));

        return this.diceValue;
    }

    public gotiChecker(){
        return false //return bool idhr
    }

    public gotiKholna(gotiIndex:number,socket:WebSocket){
        // ismei array nikala socket ko key rkh kr aur 
        // phir uss array ke gotindex mei add krdiya 
        // but it is not persisting for some reason
        // console.log("board is",this.board)
        if(gotiIndex>4){
            socket.send(JSON.stringify({
                message:"goti sahi ni chuni bhai apne"
            }))
            return;
        }
        const whichPlayerMap=this.board.get(socket)
        console.log("Before", this.board.get(socket));
        whichPlayerMap![gotiIndex] += 1;
        console.log("After", this.board.get(socket));
        const json = JSON.parse((this.board).toString()); // Buffer -> string -> JSON
      console.log("Client sent:", json);
        return this.board
    }
    public startGame(socket: WebSocket) {
        this.gameid = uuidv1();
        this.otp = this.otpgenerator();
        this.player1 = socket;
        this.allGames.set(this.otp,this.gameid); // OTP as key
        this.board.set(socket,[0,0,0,0]); 
        this.playersJoined.push(this.player1) 
        socket.send(JSON.stringify({
            type: GAME_INIT,
            message: "Game created successfully",
            otp: this.otp
        }));
    }

    public joinGame(socket: WebSocket, otp: number) {
        // console.log(this.allGames)
        const exists = this.allGames.has(otp);
        // console.log(exists)
        if (!exists) {
            socket.send(JSON.stringify({
                type: JOIN,
                message: "Invalid OTP or game not found"
            }));
        } else {    
            // Add player logic
            if (!this.player2) {
                this.player2 = socket;
                this.board.set(this.player2,[0,0,0,0]);
                this.playersJoined.push(this.player2) 
            } else if (!this.player3) {
                this.player3 = socket;            
                this.board.set(this.player3,[0,0,0,0]); 
                this.playersJoined.push(this.player3) 
            } else if (!this.player4) {
                this.player4 = socket
                this.board.set(this.player4,[0,0,0,0]); 
                this.playersJoined.push(this.player4) 
            } else {
                socket.send(JSON.stringify({
                    type: JOIN,
                    message: "Game is full"
                }));
                return;
            }
            socket.send(JSON.stringify({
                type: JOIN,
                message: "Successfully joined the game",
                player:socket
            }));
        }
    }

    public makeMove(socket:WebSocket,movement:number,gotiIndex:number){
        console.log("count",this.count)
        this.turnChecker(socket)
        if(movement!==this.diceValue){
            console.log("not correct steps")
            return;
        }
        if(this.turn!==socket){
            console.log("not your turn")
            return;
        }
        const move=this.board.get(socket)
        const gotiMovement=move![gotiIndex]
        console.log("gotiMovement",gotiMovement)
        if((this.diceValue==6 || this.diceValue===1 )&& gotiMovement===0){
            console.log("hit")
            this.gotiKholna(gotiIndex,socket)
        }else if(gotiMovement===0){
            console.log("khuli ni hai abhi")
        }else {
        const kholihuigoti=this.board.get(socket)
        console.log("Before", this.board.get(socket));
        kholihuigoti![gotiIndex] += movement;
        console.log("After", this.board.get(socket));
          
        }
        // logic to check if the game is over or not
        this.count++;
    }       

    public turnChecker(socket:WebSocket){ // idhr kuch bt h tabhi  system ni baithra 
        if(this.playersJoined.length===4){
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
        }else if(this.playersJoined.length===3){
                if(this.count%3===0){
            this.turn=this.player1
            }
            if(this.count%3===1){
                this.turn=this.player2
            }
            if(this.count%3===2){
                this.turn=this.player3
            }
            return this.turn
        }else if(this.playersJoined.length===2){
            if(this.count%2===0){
                this.turn=this.player1
            }
            if(this.count%2===1){
                this.turn=this.player2
            }
            return this.turn
        }else{
            socket.send(JSON.stringify({
                message:"You need min two players to start this game"
            }))
        }
    }
    
}