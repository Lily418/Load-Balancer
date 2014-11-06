var exec = require('child_process').exec;

var count = 0;

module.exports = function getCpuUsage(callback){
    var child = exec('sudo nice --20 top -b -n 10');
    child.stdout.on('data', function(data) {
        var matchCPUUsage = /Cpu\(s\):\s* [0-9]+\.[0-9]*/;
        var matchNumber = /[0-9]*\.[0-9]*/
        var usageString = matchCPUUsage.exec(data);
        //console.log(data);
        if(usageString != null){
        var usageNum = Number(matchNumber.exec(usageString)[0]);
        callback(usageNum);
        count++;

        if(count == 10){
            count = 0;
            getCpuUsage(callback);
        }
        }
    });
}
