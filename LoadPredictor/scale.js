/*var io = require('socket.io-client');

console.log('connecting')
var socket = io.connect('http://192.168.56.101:3000');

socket.on('cpu-ip', function(msg){
console.log(msg)
});*/

var requestsHandledPerInterval = 20

function calculateOptimalServers(redisClient, timeInterval, seriesTag, callback){
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
    for(var i = 0; i < 1000000; i += 10000){
        calculateOptimalServers(redisClient, timeInterval, "training", createEmitOptimal(io));
    }

    /*var prevInterval = timeInterval - (10 * 1000);
    //Calculate true optimal for previous timeframe
    redisClient.get("testing:requests:" + prevInterval, function(err,value){
    var optimalServers = Math.ceil(value / requestsHandledPerInterval);
    io.emit('optimal-servers', JSON.stringify({"timeInterval": timeInterval, "optimalServers": optimalServers}))
});*/
}
