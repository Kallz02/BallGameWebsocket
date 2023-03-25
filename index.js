const http=require("http");//http server
const { connect } = require("http2");
const websocketServer=require("websocket").server
const httpServer=http.createServer();

httpServer.listen(9090,()=>console.log("Listen on 9000"));

//hashmap to store the details
const clients={};

//to store games
const games={};

const wsServer=new websocketServer({
  "httpServer":httpServer
})
wsServer.on("request",request =>{
  const connection =request.accept(null,request.origin);//It has to accept request
  connection.on("open",()=> console.log("opened!"))
  connection.on("closed",()=> console.log("closed!"))
  connection.on("message",message=>{
     const result = JSON.parse(message.utf8Data)//NOTE: Assumes they send JSON 
    //Recieved Message From CLient
    //user create new game
    if(result.method==="create"){
      const clientID=result.clientID
      //
      const gameID=guid();
      
      games[gameID]={
        "id":gameID,
        "balls":20
      }

      const payLoad={
        "method":"create",
        "game":games[gameID]
      }

      const con=clients[clientID].connection;

      con.send(JSON.stringify(payLoad));
    }


  })

  //generate client ID
  const clientID=guid();
  clients[clientID]={
    "connection":connection
  }

//Message to send Back
  const payLoad={
    "method":"connect",
    "clientID":clientID
  }
  //Send Back client connect
  connection.send(JSON.stringify(payLoad))

})





//Function To Generate Random ID 
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();


//Serve Static files

const app= require("express")();
app.get("/",(req,res)=>res.sendFile(__dirname+"/index.html"))
app.listen(9091,()=>console.log("Listening on port 9091"))