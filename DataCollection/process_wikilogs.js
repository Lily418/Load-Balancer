var fs = require('fs');
var byline = require('byline');
var redis = require("redis");

//Setup Redis
client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

if(typeof process.argv[2] == 'undefined'){
    console.log("Pass location of page counts file as argument");
    process.exit(1);
}

var stream = fs.createReadStream(process.argv[2])
stream = byline.createStream(stream);

stream.on('data', function(line){
    var line = line.toString();
    if(/^en\s/.test(line)){
        var properties = line.split(" ");
        console.log(process.argv[3] + " " + properties[2])
        client.set("wikiviews:" + process.argv[3], properties[2], redis.print);
        client.quit();
        stream.end();
    }
});

stream.on('end', function(){
    client.quit();
})
