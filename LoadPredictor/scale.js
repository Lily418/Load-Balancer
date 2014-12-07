/*var io = require('socket.io-client');

console.log('connecting')
var socket = io.connect('http://192.168.56.101:3000');

socket.on('cpu-ip', function(msg){
    console.log(msg)
});*/

var requestsHandledPerInterval = 20

function calculateOptimalServers(timeInterval, seriesTag, callback){
    redisClient.get(seriesTag + ":requests:" + timeInterval, function(err, value){
        var optimalServers = Math.ceil(value / requestsHandledPerInterval);
        callback(timeInterval, optimalServers);
    });
}

function createEmitOptimal(io){
    return function(timeInterval, optimalServers){
        io.emit('optimal-servers', JSON.stringify({"timeInterval": timeInterval, "optimalServers": optimalServers}));
    }
}

module.exports = function(redisClient, timeInterval, io){
    calculateOptimalServers(timeInterval, "training", createEmitOptimal(io));

    /*var prevInterval = timeInterval - (10 * 1000);
    //Calculate true optimal for previous timeframe
    redisClient.get("testing:requests:" + prevInterval, function(err,value){
        var optimalServers = Math.ceil(value / requestsHandledPerInterval);
        io.emit('optimal-servers', JSON.stringify({"timeInterval": timeInterval, "optimalServers": optimalServers}))
    });*/
}
