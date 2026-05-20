/*Problem: We need to node.js to help assist in the automation of the game
Gameplan:*/

var express = require('express');//pulls express library that gets used in app variable
var http = require('http'); //builds server
var fs  = require('fs'); //handling files
var app = express();
const {Server} = require('socket.io');
//const sqldriver = require('msnodesqlv8');

var server = http.createServer(app);
var io = new Server(server,{
    cors:{
        origin: 'http://localhost:8000',
        methods:['GET','POST']
    }

});
var path = require('path');
app.use(express.static(path.join(__dirname,'./static'))); //serves static files from the static folder

const sql = require("mssql/msnodesqlv8");

const odbc = require('odbc');

const connectionString = {
connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=localhost\\SQLEXPRESS2;Database=ort_gamecodes;Trusted_Connection=yes;TrustServerCertificate=yes;',
connectionTimeout: 10,
loginTimeout: 10,
};
/*
const config = {
  server: "localhost\\SQLEXPRESS2",
  database: "o_r_tournament",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true
  }
};

sql.connect(config).then(()=>{
console.log('connected to database');
})
.catch(err=>{
console.log(err);
});
*/


async function connecttoDB(){
    try{

        
server.listen(3000,()=>{
    console.log('listening on *:3000');
});

        const connection = await odbc.connect(connectionString);
        console.log('connected!');

        io.on('connection',(socket)=>{

    socket.on('create code', async (joincode) => {
        try{
            const query = 'INSERT INTO gamecodes (Gamecodes) VALUES (?)';
            //const parameters = joincode;

            await connection.query(query,[joincode]);
            console.log('Code inserted successfully');
        }
        catch(err){
            console.error("Error connecting to database:", err.message);
            console.error("Error code:", err.code);
            console.error(err.odbcErrors);
        }
    });

    socket.on('check code',async (checkcode)=>{
        try{
        //How are we going to check the code? We need to check the code against the database and then if it is correct, we need to add the user to the game and then emit the username to all the other users in the game
        const query ='SELECT * FROM gamecodes WHERE Gamecodes = ?';
        const result =await connection.query(query,[checkcode]);
        console.log('Reached here');


        if (result.length > 0) {
            console.log('Game link found');
            // 'result' contains the row data, you might want to send result[0]
            io.emit('code checked', { success: true, data: result });
        } else {
            console.log('No matching code found');
            socket.emit('code checked', { success: false, message: 'Invalid code' });
        }
    } catch (err) {
        // This catches database errors (like syntax errors in your SQL)
        console.error("Database query error:", err.message);
        socket.emit('error', 'Internal server error');
    }
    });

});
    }
    catch(err){
        console.error("Error connecting to database:", err.message);
        console.error("Error code:", err.code);
        console.error(err.odbcErrors);
    }
}

connecttoDB();
app.get('/',(req,res) =>{
    res.sendFile(__dirname + '/templates/gameprep.html');
});





//node controller.js

