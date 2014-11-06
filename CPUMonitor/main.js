var io = require('socket.io-client');
var getCpuUsage = require("./top.js");

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
