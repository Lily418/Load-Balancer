var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io-client');
var getCpuUsage = require("./top.js");

var run = true;

http.listen(3005, function(){
  console.log('listening on *:3005');
});

//Arbitary calculation to simulate load when user makes a request
function doCalculations(){
    var x = 0;
    for(var i = 0; i < 100; i++){
        x += Math.random();
    }
    return x;
}

app.get('/', function(req, res){
    res.end("Here is a website " + doCalculations());
});



console.log('connecting')
var socket = io.connect('http://192.168.56.101:3000');

socket.on('connect', function () {
    console.log('connected')
    getCpuUsage(sendCPUUsage);
});

socket.on('connect_failed', function(){
    console.log('Connection Failed');
});


function sendCPUUsage(usage){
    console.log('emit' + usage)
    socket.emit('cpu-usage', usage);
};
