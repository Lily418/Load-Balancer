var data = []
var w0 = 1;
var w1 = 0;
var w2 = 0;
var alpha = 0.01;

module.exports = {

    reportWeights : function(io) {
        setInterval(function(){
            io.emit('weights', JSON.stringify({"w0": w0, "w1": w1, "w2": w2}));
        }, 100);
    },

    weightUpdate : function() {
        setInterval(function(){
            data.forEach(function(d){
                var z = this.predict(d[0], d[1]);
                w1 += alpha * (d[2] - z) * d[0];
                w2 += alpha * (d[2] - z) * d[1];
                w0 += alpha * (d[2] - z);
            });
        }, 2);
    },

    addData : function(d){
        data.push(d);
    },

    predict : function(tMinusOneYear, tMinusOneHour){
        return Math.ceil((w1 * tMinusOneYear) + (w2 * tMinusOneHour) + w0);
    }

}
