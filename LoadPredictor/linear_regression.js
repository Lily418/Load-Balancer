var data = []
var w0 = 1;
var w1 = 0;
var w2 = 0;

module.exports = {
    addData : function(d){
        data.push(d);
    }

    predict : function(tMinusOneYear, tMinusOneHour){
        return Math.ceil((w1 * tMinusOneYear) + (w2 * tMinusOneHour) + w0);
    }

}
