var exec = require('child_process').exec;
var virtualbox = require('virtualbox');

module.exports = {
    createNewServer: function(){
        var vmName = "AppServer_" + new Date().getTime();
        var createVm = exec('VBoxManage clonevm 2c4bb3f8-f561-4b65-ba81-3f890f5ac198 --options link --snapshot c6b0dcdb-63e8-43f3-84b8-7eb461d8b4e2 --register --name ' + vmName);
        createVm.on('exit', function(){
            var startvm = exec('VBoxManage startvm ' + vmName + " --type headless");
        });
    },

    scale: function(vmCount){
        var vmList = []
        var createNewServer = this.createNewServer;
        virtualbox.list(function (machines, error) {
            for (var vms in machines) {
                if (machines.hasOwnProperty(vms)) {
                    if(/^AppServer_/.test(machines[vms].name)){
                        if(machines[vms].running){
                            vmList.push(machines[vms].name);
                        }
                    }
                }
            }

            if(vmCount == vmList.length){
                console.log('Maintain Scaling ' + vmCount)
            }
            else if(vmCount > vmList.length){
                for(var i = 0; i < vmCount - vmList.length; i++){
                    createNewServer();
                }
            }
            else {
                //Scale Down to be implemented
                for(var i = 0; i < vmList.length - vmCount; i++){
                    var machine = vmList[i]
                    var shutdown = exec('VBoxManage controlvm ' + machine + " acpipowerbutton");
                    //shutdown.on('exit', function(){
                    //    console.log('VBoxManage unregistervm '+ machine);
                    //    exec('VBoxManage unregistervm '+ machine);
                    //});
                }
            }

        });
    }


}
