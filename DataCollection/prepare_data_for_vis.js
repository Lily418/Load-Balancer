var redis = require("redis");
//Setup Redis
client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

visitors = []
multi = client.multi();

client.keys("*", function(err, keys){
    keys.forEach(function(key){
        multi.get(key, function(err, value){
            console.log(value)
            visitors.push([new Date(Number(key)), value])
        });
    });

    multi.exec(function(err, replies){
        console.log(JSON.stringify(visitors))
        client.quit();
    });
});
