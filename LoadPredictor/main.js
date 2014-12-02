var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require("request");
var redis = require("redis");

//Setup Redis
client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});




//var connectedServers = {}
var serverQueue = []

http.listen(3000, function(){
    console.log('listening on *:3000');
});

//Returns the IP of the next server in the round-robin
function nextServer(){
    var ip = serverQueue.shift();
    serverQueue.push(ip);
    return ip;
}

var cpuUsages = []
var time = 0;
var recordingInterval = 1000 * 10;
var endtime = 7440000;
var training = true;
var recording = false;
var ended = false;
var keyPrefix = training ? "training:" : "testing:";

//Clear data from previous runs
client.keys(keyPrefix + "*", function(err, keys){
    keys.forEach(function(key){
        client.del(key);
    });
    console.log("Flushed Keys");
});





function startRecordingUsage() {
    var recordUsage = setInterval(function(){
        if(!ended){
            var count = cpuUsages.length;
            if(count == 0){
                return;
            }

            var sum = 0;
            while(cpuUsages.length > 0){
                sum += cpuUsages.pop();
            }

            var average = sum / count;

            console.log(JSON.stringify({ip: "Average",
            usage: average.toString()}));

            io.emit('cpu-ip', JSON.stringify({ip: "Average",
            usage: average.toString()}));

            time += recordingInterval;

            client.set(keyPrefix + time, average, redis.print);
            if(time > endtime){
                ended = true;
            }

        }

    }, recordingInterval);
}

io.on('connection', function(socket){
    console.log(socket.request.connection._peername.address);
    var ip = socket.request.connection._peername.address;

    socket.on('cpu-usage', function(msg){
        if(serverQueue.indexOf(ip) === -1){
            serverQueue.push(ip);
        }

        if(recording){
            cpuUsages.push(msg);
        }
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
        var index = serverQueue.indexOf(ip);
        if(index > -1){
            serverQueue.splice(index, 1);
        }
    });
});

app.get('/', function(req, res){
    if(!recording){
        recording = true;
        startRecordingUsage();
    }

    client.incr(keyPrefix + "requests:" + time);

    var server = nextServer();
    request("http://" + server + ":3005" , function(error, response, body) {
        res.write("You were served by " + server + "\n")
        res.end(body);
        client.incr(keyPrefix + "responses:" + server + ":" + time);

    });
});
