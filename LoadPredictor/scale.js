var lr = require('./linear_regression.js');

var requestsHandledPerInterval = 10
var list = []

var prediction = false;

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

function predictOptimal(average, redisClient, timeInterval, callback){
    calculateOptimalServers(redisClient, timeInterval, "training", function(intervalMinusOneYear, tMinusOneYear){
        calculateOptimalServers(redisClient, timeInterval - 10000, "testing", function(intervalMinusOneHour, tMinusOneHour){

            if(intervalMinusOneHour == 0){
                callback(tMinusOneYear);
            }
            else {
                callback(Math.ceil(lr.predict(tMinusOneYear,tMinusOneHour)));
            }
        });
    });
}

var currentScaling = 3;
function scaleBasedOnCurrentUsage(average, redisClient, timeInterval, callback){
    console.log(average);
    if(average < 30){
        currentScaling -= 1;
    }
    else if(average > 75){
        currentScaling += 1;
    }

    if(currentScaling < 1){
        currentScaling = 1;
    } else if(currentScaling > 10){
        currentScaling = 10;
    }

    callback(Math.ceil(currentScaling));
}

function createEmitMLData(io){
    var data = [];
    return function(t_label) {
        return function(timeInterval, optimalServers){
            data.push([t_label, optimalServers]);
            if(data.length == 3){
                data.sort(function(v){
                    return v[0];
                });

                data = data.map(function(v){
                    return v[1];
                });


                lr.addData(data);
                io.emit('ml-data', JSON.stringify(data));
            }
        }
    }
}

module.exports = {
    emitTrainingData: function(redisClient, io){
        for(var i = 10000; i <= 5000000; i += 10000){
            calculateOptimalServers(redisClient, i, "training", createEmitOptimal(io, "Training_Data"));
        }

        //lr.reportWeights(io);
        lr.weightUpdate(io);
    },

    emitTestData: function(redisClient, timeInterval, io){
        if(timeInterval != 10000){
        var add_ml_scalar = createEmitMLData(io);
        calculateOptimalServers(redisClient, timeInterval, "testing", add_ml_scalar(2));
        calculateOptimalServers(redisClient, timeInterval - 10000, "testing", add_ml_scalar(1));
        calculateOptimalServers(redisClient, timeInterval, "training", add_ml_scalar(0));
        }

        calculateOptimalServers(redisClient, timeInterval, "testing", createEmitOptimal(io, "Test_Recording"));
    },

    scale: function(redisClient, timeInterval, io, average){
        var predictFunc = predictOptimal;
        if(!prediction){
            predictFunc = scaleBasedOnCurrentUsage;
        }

        predictFunc(average, redisClient, timeInterval, function(prediction){
            io.emit('scale-request', prediction);
            io.emit('optimal-servers', JSON.stringify({"series": "Prediction", "timeInterval": timeInterval, "optimalServers": prediction}));
        });
    }
}
