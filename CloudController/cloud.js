var exec = require('child_process').exec;

module.exports = {
    createNewServer: function(){
        var vmName = new Date().getTime();
        var createVm = exec('VBoxManage clonevm cd37efcb-9af4-4b90-a008-9ddc22e84006 --options link --snapshot 71dfb56e-76b9-42a8-b51e-6271c84db2ce --register --name ' + vmName);
        createVm.on('exit', function(){
            var startvm = exec('VBoxManage startvm ' + vmName + " --type headless");
        });


    }

}
