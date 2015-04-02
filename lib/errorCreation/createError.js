'use strict';

module.exports = function (mainErrorName, errorDescription) {
    return {
        err: mainErrorName,
        des: errorDescription
    }
};
