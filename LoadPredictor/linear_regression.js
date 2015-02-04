var data = []
var w0 = 1;
var w1 = 0;
var w2 = 0;

module.exports = {

    reportWeights : function(io){
        setInterval(function(){
            io.emit('weights', JSON.stringify({"w0": w0, "w1": w1, "w2": w2}));
        } 100);
    }

    addData : function(d){
        data.push(d);
    },

    predict : function(tMinusOneYear, tMinusOneHour){
        return Math.ceil((w1 * tMinusOneYear) + (w2 * tMinusOneHour) + w0);
    }

}
