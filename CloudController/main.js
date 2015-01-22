var io = require('socket.io-client')('http://192.168.56.101:3000');
var cloud = require('./cloud.js');

cloud.scale(1);


var socket = io.connect();

socket.on('connect', function () {
    console.log('connected')
});

socket.on('scale-request', function (msg) {
    console.log(msg);
    cloud.scale(msg);
});
