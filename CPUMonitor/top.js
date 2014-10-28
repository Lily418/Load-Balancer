var exec = require('child_process').exec;

module.exports = function getCpuUsage(callback){
    console.log('getting cpu usage')
    var child = exec('top -b');
    child.stdout.on('data', function(data) {
        var matchCPUUsage = /Cpu\(s\):\s* [0-9]+\.[0-9]*/;
        var matchNumber = /[0-9]*\.[0-9]*/
        var usageString = matchCPUUsage.exec(data);
        if(usageString != null){
        var usageNum = Number(matchNumber.exec(usageString)[0]);
        callback(usageNum);
        }
    });
}
