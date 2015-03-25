var io = require('socket.io-client')('http://192.168.56.101:3000');
var cloud = require('./cloud.js');
var initalScaling = 3;

cloud.scale(initalScaling);


var socket = io.connect();

socket.on('connect', function () {
    io.emit('scale-instructions-req', "New Client Connected");
    console.log('connected');
});

socket.on('scale-request', function (msg) {
    console.log(msg);
    cloud.scale(msg);
});
