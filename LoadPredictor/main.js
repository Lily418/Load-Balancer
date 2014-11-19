var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require("request");


//var connectedServers = {}
var serverQueue = []

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//Returns the IP of the next server in the round-robin
function nextServer(){
    var ip = serverQueue.shift();
    serverQueue.push(ip);
    return ip;
}

app.get('/', function(req, res){
    var server = nextServer();
    request("http://" + server + ":3005" , function(error, response, body) {
        res.write("You were served by " + server + "\n")
        res.end(body);
    });
});

io.on('connection', function(socket){
  console.log(socket.request.connection._peername.address);
  var ip = socket.request.connection._peername.address;

  socket.on('cpu-usage', function(msg){
    if(serverQueue.indexOf(ip) === -1){
        serverQueue.push(ip);
    }

    //connectedServers[ip] = {time: new Date().getTime()};
    if(ip == "192.168.56.101"){
    io.emit('cpu-ip', JSON.stringify({ip: ip,
                                usage: msg}));
    }
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    var index = serverQueue.indexOf(ip);
    if(index > -1){
        serverQueue.splice(index, 1);
    }
  });
});
