var app = require('express')();
var http = require('http').Server(app);

var server = http.listen(3005, function(){
  console.log('listening on *:3005');
});

//Arbitary calculation to simulate load when user makes a request
function doCalculations(){
    var x = 0;
    for(var i = 0; i < Math.pow(10, 8); i++){
        x += Math.random();
    }
    return x;
}

app.get('/', function(req, res){
    res.end("Here is a website " + doCalculations());
});

process.on( 'SIGINT', function() {
    console.log('TROLL')
    server.close();
    process.exit();
});
