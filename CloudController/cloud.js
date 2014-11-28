var exec = require('child_process').exec;

module.exports = {
    createNewServer: function(){
        var vmName = new Date().getTime();
        var createVm = exec('VBoxManage clonevm cd37efcb-9af4-4b90-a008-9ddc22e84006 --options link --snapshot 70b1f605-f17b-4075-818e-bc7f9fd4f679 --register --name ' + vmName);
        createVm.on('exit', function(){
            var startvm = exec('VBoxManage startvm ' + vmName + " --type headless");
        });


    }

}
