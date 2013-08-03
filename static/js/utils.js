(function (ns) {
    var utils = {};

    var sum = function (array, key) {
        var default_key = function (e) {
            return e;
        };
        if (typeof key !== 'function') {
            key = default_key;
        }
        return array.reduce(function(pv, cv) { return pv + key(cv); }, 0);
    };

    var max = function (array, key) {
        var default_key = function (e) {
            return e;
        };
        if (typeof key !== 'function') {
            key = default_key;
        }
        return array.reduce(function(pv, cv) { 
            var evaluated = key(cv);
            if (typeof pv === 'undefined' || cv > pv) {
                return evaluated;
            }
            return pv; 
        }, undefined);
    };

    utils.sum = sum;
    utils.max = max;
    ns.utils = utils;
})(window.swiftsense);