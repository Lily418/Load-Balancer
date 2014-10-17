var getCpuUsage = require("./top.js");

var run = true;

function sendCPUUsage(usage){
    console.log(usage);
};

getCpuUsage(sendCPUUsage);
