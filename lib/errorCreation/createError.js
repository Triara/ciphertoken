'use strict';

module.exports = function (mainErrorName, errorDescription) {
    return {
        error: mainErrorName,
        description: errorDescription
    }
};
