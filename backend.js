let http = require('http');
const express = require('express');
const { Server } = require('socket.io');

/*http.createServer(function(req,res) {
    res.writeHead(200,{'Content-Type':'text/plain'});

}).listen(8080);*/

const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors:{origin:'*'}});

io.on('connection',(socket)=>{

    console.log("Someone has connected");
    socket.emit('userconnected','User has connected');

});

server.listen(3000,()=>{
    console.log("Server is listening");
});


