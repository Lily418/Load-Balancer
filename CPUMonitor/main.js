var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var getCpuUsage = require("./top.js");

var run = true;

function sendCPUUsage(usage){
    console.log('emit' + usage)
    io.emit('cpu-usage', usage);
};

getCpuUsage(sendCPUUsage);

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
