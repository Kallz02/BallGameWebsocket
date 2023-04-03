
//Variables
let clientId = null;
let gameId = null;
let playerColor = null;

// let ws = new WebSocket("ws://172.16.16.3:9190") 
let ws = new WebSocket("wss://api.wsbg.akshayk.dev") 
// let ws = new WebSocket("ws://localhost:9193")
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtGameId = document.getElementById("txtGameId");
const divPlayers = document.getElementById("divPlayers");
const divBoard = document.getElementById("divBoard");
const clientdd=document.getElementById("clientID");
const gamesDisplay = document.getElementById("game-id");
        
//Button for joining the game
btnJoin.addEventListener("click", e => {

    if (gameId === null)
    gameId = txtGameId.value;
                
    const payLoad = {
        "method": "join",
        "clientId": clientId,
        "gameId": gameId
        }

    ws.send(JSON.stringify(payLoad));

})

//Button for creating new game
//calls the create instance in server

btnCreate.addEventListener("click", e => {

    const payLoad = {
        "method": "create",
        "clientId": clientId
    }

    ws.send(JSON.stringify(payLoad));

})

ws.onmessage = message => {
//Data Coming From The Server
const response = JSON.parse(message.data);
//connection Successful or not
if (response.method === "connect"){
        clientId = response.clientId;
        console.log("Client id Set successfully " + clientId)
        clientdd.innerHTML="Client ID:"+clientId;
}

//create the game
if (response.method === "create"){
    gameId = response.game.id;
    console.log("game successfully created with id " + response.game.id + " with " + response.game.balls + " balls")  
    gamesDisplay.innerHTML="New Game ID : " + response.game.id;
}



//Updating The State Of The Game When 3 players are online
if (response.method === "update"){
    if (!response.game.state) return;
    for(const b of Object.keys(response.game.state))
        {
        const color = response.game.state[b];
        const ballObject = document.getElementById("ball" + b);
        ballObject.style.backgroundColor = color
    }

}

//Joining The game (Considers The ID)
if (response.method === "join"){
    const game = response.game;
    //For Displaying players currently in room
    while(divPlayers.firstChild)
        divPlayers.removeChild (divPlayers.firstChild)

    game.clients.forEach (c => {
        General
        const d = document.createElement("div");
        d.style.width = "200px";
        d.style.background = c.color
        d.textContent = c.clientId;
        divPlayers.appendChild(d);

        if (c.clientId === clientId) playerColor = c.color;
                    gamesDisplay.innerHTML="Game ID :" + c.gameId; 
        })

        //Generating The Ball Buttons
        while(divBoard.firstChild)
        divBoard.removeChild (divBoard.firstChild)

        for (let i = 0; i < game.balls; i++){

            const b = document.createElement("button");
            b.id = "ball" + (i +1);
            b.tag = i+1
            b.textContent = i+1
            b.style.width = "150px"
            b.style.height = "150px"
            b.addEventListener("click", e => {
            b.style.background = playerColor
                            
            //returning the state to change 
            const payLoad = {
                "method": "play",
                "clientId": clientId,
                "gameId": gameId,
                "ballId": b.tag,
                "color": playerColor
                }
            ws.send(JSON.stringify(payLoad))
            })
            divBoard.appendChild(b);
        }




    }
}