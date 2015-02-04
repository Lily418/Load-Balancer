var data = []
var w0 = 1;
var w1 = 0;
var w2 = 0;

module.exports = {
    function addData(d){
        data.push(d);
    }

    function predict(tMinusOneYear, tMinusOneHour){
        return Math.ceil((w1 * tMinusOneYear) + (w2 * tMinusOneHour) + w0);
    }

}
