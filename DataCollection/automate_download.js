var request = require("request");
var env = require('jsdom').env
var exec = require('child_process').exec;

var url = "https://dumps.wikimedia.org/other/pagecounts-raw/2013/2013-01/"

var processesToRun = [];

env(url, function(errors, window){
    var $ = require('jquery')(window);
    $('li a').each(function(){
        if(/^projectcounts/.test($(this).text())){
            var href = $(this).attr('href');
            var year = href.slice(14, 18)
            var month = href.slice(18,20)
            var day  =  href.slice(20,22)
            var hour =  href.slice(23,25)
            //-1 from month because JS counts January as 0
            var date = new Date(year, month - 1, day, hour, 0,0,0);
            var unix_time = date.getTime();
            processesToRun.push('./download_log.sh ' + href + " " + unix_time);
        }
    });

    for(var i = 0; i < 20; i++){
        runProcess();
    }
});


function runProcess(){

    var p = processesToRun.pop();
    //console.log(p)
    if(typeof p != 'undefined'){
        console.log(p)
        var child = exec(p);

        child.stdout.on('data', function(data){
            console.log(data);
        });

        child.on('exit', function(){
            runProcess();
        });
    }
}
