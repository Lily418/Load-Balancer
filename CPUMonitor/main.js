var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io-client');
var getCpuUsage = require("./top.js");

var run = true;

console.log('connecting')
var socket = io.connect('http://178.62.27.130:3000');

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
