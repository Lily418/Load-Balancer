/*var io = require('socket.io-client');

console.log('connecting')
var socket = io.connect('http://192.168.56.101:3000');

socket.on('cpu-ip', function(msg){
    console.log(msg)
});*/

var requestsHandledPerInterval = 20

module.exports = function(redisClient, timeInterval, io){
    redisClient.get("training:requests:" + timeInterval, function(err, value){
        var optimalServers = Math.ceil(value / requestsHandledPerInterval);
        io.emit('optimal-servers', JSON.stringify({"timeInterval": timeInterval, "optimalServers": optimalServers}));
    });
}
