import {WebSocket} from "ws";

export class Game{
     private player1:WebSocket|null
    private player2:WebSocket|null
    private player3:WebSocket|null
    private player4:WebSocket|null
    private game:string[]
    private gotiyan:string
    private gotiyanNumber:number
    private referenceGoti:string[]

    constructor(){
        this.player1=null
        this.player2=null
        this.player3=null
        this.player4=null
        this.game=[]
        this.gotiyan=""
        this.gotiyanNumber=4
        this.referenceGoti=[]
    }
}