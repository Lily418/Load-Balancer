/*var io = require('socket.io-client');

console.log('connecting')
var socket = io.connect('http://192.168.56.101:3000');

socket.on('cpu-ip', function(msg){
console.log(msg)
});*/

var requestsHandledPerInterval = 10
var list = []

function calculateOptimalServers(redisClient, timeInterval, seriesTag, callback){
    redisClient.get(seriesTag + ":requests:" + timeInterval, function(err, value){
        list.push(Number(value));
        if(list.length == 100){
            var s = "";
            for(var i = 0; i < 100; i++){
                s += list[i] + ","
            }
            console.log(s);
        }

        var optimalServers = Math.ceil(value / requestsHandledPerInterval);
        callback(timeInterval, optimalServers);
    });
}


function createEmitOptimal(io, series){
    return function(timeInterval, optimalServers){
        io.emit('optimal-servers', JSON.stringify({"series": series, "timeInterval": timeInterval, "optimalServers": optimalServers}));
    }
}

function predictOptimal(redisClient, timeInterval, callback){
    calculateOptimalServers(redisClient, timeInterval, "training", function(timeInterval, optimalServers){
        callback(optimalServers);
    });
}

module.exports = {
    emitTrainingData: function(redisClient, io){
        for(var i = 10000; i <= 1000000; i += 10000){
            calculateOptimalServers(redisClient, i, "training", createEmitOptimal(io, "Training_Data"));
        }
    },

    emitTestData: function(redisClient, timeInterval, io){
        calculateOptimalServers(redisClient, timeInterval, "testing", createEmitOptimal(io, "Test_Recording"));
    },

    scale: function(redisClient, timeInterval, io){
        predictOptimal(redisClient, timeInterval, function(prediction){
            io.emit('scale-request', prediction);
            io.emit('optimal-servers', JSON.stringify({"series": "Prediction", "timeInterval": timeInterval, "optimalServers": prediction}));
        });
    }
}

/*var prevInterval = timeInterval - (10 * 1000);
//Calculate true optimal for previous timeframe
redisClient.get("testing:requests:" + prevInterval, function(err,value){
var optimalServers = Math.ceil(value / requestsHandledPerInterval);
io.emit('optimal-servers', JSON.stringify({"timeInterval": timeInterval, "optimalServers": optimalServers}))
});*/
